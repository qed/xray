---
title: "Multi-Tenant Feature Patterns: Department-Scoped RLS, Self-Serve, Status Lifecycle, and Service Role Context"
date: 2026-04-13
last_updated: 2026-04-14
category: best-practices
module: supabase-rls-and-status
problem_type: best_practice
component: database
severity: high
applies_when:
  - Adding department-scoped data access for non-owner roles in a multi-tenant Supabase app
  - Implementing forward-only status lifecycle with database-enforced constraints
  - Migrating from one data model to another (e.g., milestones to status) in production
  - Handling service role context where auth.uid() is NULL (invite acceptance, system operations)
  - Creating junction tables that reference org-scoped entities without duplicating org_id
  - Users need to self-manage department membership without admin intervention
  - Org is scaling beyond a handful of departments and manual assignment is a bottleneck
  - RLS policies must allow members to see org-level data they need for self-serve flows
tags:
  - rls-policies
  - security-definer
  - supabase
  - status-lifecycle
  - multi-tenant
  - migration-safety
  - junction-tables
  - bridge-trigger
  - self-serve
  - department-management
  - join-leave
  - onboarding-redirect
  - proxy
---

# Multi-Tenant Feature Patterns: Department-Scoped RLS, Self-Serve, Status Lifecycle, and Service Role Context

## Context

The X-Ray app needed a "Department Lead Experience" — giving non-owner users (admins, members) scoped access to their assigned departments' priorities, with a forward-only status lifecycle replacing the legacy milestone system. This required:

1. New RLS policies granting department-scoped access through a `member_departments` junction table
2. A status column (`proposed → approved → not_started → in_progress → complete`) replacing milestone stages
3. Safe production migration from milestones to status with zero downtime
4. Invite-time department pre-assignment where `auth.uid()` is NULL (service role context)

These patterns emerged from building the feature across 8 implementation units and 3 Supabase migrations (014, 015, 016).

As the platform scaled from 4 to 11+ departments (auto memory [claude]), a "Department Self-Serve" feature was added, introducing 3 additional patterns (8–10) for self-managed join/leave/create flows. These patterns emerged from migration 020 and the self-serve UI work.

## Guidance

### 1. Two-Phase Deploy Strategy for Data Model Migrations

When replacing one data model with another in production, use a two-phase approach:

**Phase 1 — Dual-write with bridge trigger:**
- Add the new column (`status`) alongside the old (`milestones` table)
- Backfill existing data from old → new
- Create a bridge trigger that keeps old and new in sync during the transition
- Update application code to read from the new column

```sql
-- Phase 1: Bridge trigger keeps milestones and status in sync
CREATE OR REPLACE FUNCTION bridge_milestone_to_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE priorities SET status =
    CASE NEW.stage
      WHEN 0 THEN 'not_started'
      WHEN 1 THEN 'in_progress'
      WHEN 2 THEN 'in_progress'
      WHEN 3 THEN 'complete'
    END
  WHERE id = NEW.priority_id
    AND status NOT IN ('proposed', 'rejected');  -- guard: don't overwrite lifecycle states
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bridge_milestone_to_status
  AFTER INSERT OR UPDATE ON milestones
  FOR EACH ROW
  WHEN (OLD.stage IS DISTINCT FROM NEW.stage)
  EXECUTE FUNCTION bridge_milestone_to_status();
```

**Phase 2 — Finalize (after verification):**
- Add CHECK constraint on the new column
- Drop the bridge trigger
- Set column default for new rows

```sql
-- Phase 2: Status is now authoritative
ALTER TABLE priorities
  ADD CONSTRAINT priorities_status_check
  CHECK (status IN ('proposed','approved','rejected','not_started','in_progress','complete'));

DROP TRIGGER IF EXISTS bridge_milestone_to_status ON milestones;
DROP FUNCTION IF EXISTS bridge_milestone_to_status();

ALTER TABLE priorities
  ALTER COLUMN status SET DEFAULT 'proposed';
```

### 2. SECURITY DEFINER RPCs with Internal Validation

When RLS policies cannot express the required access pattern (e.g., cross-table joins through junction tables), use SECURITY DEFINER RPCs with explicit validation inside the function body:

```sql
CREATE OR REPLACE FUNCTION self_select_departments(p_department_ids uuid[])
RETURNS void AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_org_id  uuid;
BEGIN
  -- 1. Authenticate
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 2. Validate array size (prevent abuse)
  IF array_length(p_department_ids, 1) > 50 THEN
    RAISE EXCEPTION 'Too many departments';
  END IF;

  -- 3. Verify org membership and get org_id
  SELECT om.org_id INTO v_org_id
    FROM org_members om
    WHERE om.user_id = v_user_id
    LIMIT 1;
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Not a member of any organization';
  END IF;

  -- 4. Cross-org prevention: verify ALL departments belong to user's org
  IF EXISTS (
    SELECT 1 FROM unnest(p_department_ids) AS did
    LEFT JOIN departments d ON d.id = did AND d.org_id = v_org_id
    WHERE d.id IS NULL
  ) THEN
    RAISE EXCEPTION 'Department does not belong to your organization';
  END IF;

  -- 5. Idempotent upsert
  INSERT INTO member_departments (user_id, department_id)
  SELECT v_user_id, did FROM unnest(p_department_ids) AS did
  ON CONFLICT (user_id, department_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Key validation checklist for SECURITY DEFINER RPCs:
- Authenticate (`auth.uid()` check)
- Validate input bounds (array sizes, string lengths)
- Verify org membership
- Cross-org prevention (all referenced entities belong to caller's org)
- Idempotent operations (ON CONFLICT DO NOTHING)

### 3. RLS Policy Swap Strategy

When replacing broad `FOR ALL` policies with granular split policies, use a create-then-drop approach to avoid access gaps:

```sql
-- Step 1: Create new split policies FIRST (while old policy still active)
CREATE POLICY "owners_full_access" ON member_departments
  FOR ALL USING (/* owner check */);

CREATE POLICY "members_select_own" ON member_departments
  FOR SELECT USING (auth.uid() = user_id);

-- Step 2: Verify new policies work (test in staging or with verification queries)

-- Step 3: Only THEN drop the old broad policy
DROP POLICY IF EXISTS "org_members_manage" ON member_departments;
```

Never drop-then-create — the window between drop and create leaves the table inaccessible.

### 4. Forward-Only Status Transitions

Enforce status lifecycle in both the API layer and database:

```typescript
// API layer: validate transitions before saving
export const STATUS_TRANSITIONS: Record<PriorityStatus, PriorityStatus[]> = {
  proposed: ['approved', 'rejected'],
  approved: ['not_started'],           // transient gate
  rejected: [],                         // terminal
  not_started: ['in_progress'],
  in_progress: ['complete'],
  complete: [],                         // terminal
};

// Auto-transition transient states before persisting
if (newStatus === 'approved') {
  updates.status = 'not_started';  // 'approved' is a gate, not a resting state
}
```

```sql
-- Database layer: CHECK constraint as safety net
ALTER TABLE priorities
  ADD CONSTRAINT priorities_status_check
  CHECK (status IN ('proposed','approved','rejected','not_started','in_progress','complete'));
```

The API enforces transition rules; the database enforces valid values. Defense in depth.

### 5. Bridge Trigger Guard Clause

When a bridge trigger syncs old and new data models, add a guard to prevent the bridge from overwriting states that only exist in the new model:

```sql
-- The WHEN clause prevents firing on no-ops
CREATE TRIGGER bridge_milestone_to_status
  AFTER INSERT OR UPDATE ON milestones
  FOR EACH ROW
  WHEN (OLD.stage IS DISTINCT FROM NEW.stage)  -- skip no-op updates
  EXECUTE FUNCTION bridge_milestone_to_status();

-- Inside the function: guard against overwriting lifecycle-only states
WHERE status NOT IN ('proposed', 'rejected')
```

Without the guard, milestone updates would clobber `proposed` or `rejected` statuses that have no milestone equivalent.

### 6. Service Role Context (auth.uid() = NULL)

During invite acceptance, Supabase runs in service role context where `auth.uid()` returns NULL. Create dedicated RPCs that accept user_id as a parameter for these flows:

```sql
CREATE OR REPLACE FUNCTION link_departments_for_invite(
  p_user_id uuid,
  p_department_ids uuid[]
) RETURNS void AS $$
BEGIN
  -- No auth.uid() check — this is called during invite acceptance
  -- Validation: verify departments exist and belong to the invite's org
  INSERT INTO member_departments (user_id, department_id)
  SELECT p_user_id, did FROM unnest(p_department_ids) AS did
  ON CONFLICT (user_id, department_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

This RPC is called from the invite acceptance page after the org_members row is created, passing the newly authenticated user's ID.

### 7. Junction Tables Without org_id

When a junction table (like `member_departments`) references org-scoped entities, you don't need to duplicate `org_id` on the junction table. Instead, join through the parent:

```sql
-- member_departments has: user_id, department_id (no org_id)
-- To filter by org, join through departments:
SELECT md.* FROM member_departments md
JOIN departments d ON d.id = md.department_id
WHERE d.org_id = $1;
```

This avoids data duplication and the risk of org_id getting out of sync between the junction table and its parent.

### 8. Additive SELECT Policies for Visibility Gaps

When RLS restricts SELECT to rows a user is linked to, users with zero links see nothing — including the UI that would let them create their first link. Fix with an additive SELECT policy. PostgreSQL OR's multiple SELECT policies, so a broader policy coexists safely:

```sql
-- Existing: members only see departments they're linked to
-- Problem: 0 links = 0 visible departments = can't join anything

-- Fix: any org member can see all departments in their org
CREATE POLICY "dept_select_org_member"
  ON departments FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));
```

This does NOT weaken the existing `dept_select_scoped` policy. Both remain active; PostgreSQL grants access if ANY SELECT policy passes. Use this pattern whenever a self-serve picker needs to show resources the user hasn't joined yet.

### 9. Direct DELETE via RLS for Self-Mutations

When an existing RLS policy already covers the operation, skip the SECURITY DEFINER RPC entirely. The leave-department flow uses a direct DELETE because `md_delete_self` already allows users to delete their own `member_departments` rows:

```typescript
// src/app/api/departments/leave/route.ts
const { error } = await supabase
  .from('member_departments')
  .delete()
  .eq('user_id', user.id)
  .eq('department_id', departmentId);
```

Decision rule: if the existing RLS policy permits the operation for the right user, use a direct query. Only reach for SECURITY DEFINER when RLS actively blocks what you need. Every SECURITY DEFINER function is audit surface area — don't create them unnecessarily.

### 10. Proxy-Level Redirects for State-Based Routing

Next.js server layouts cannot access `pathname`. When a redirect depends on both user state AND the current path, put it in the proxy/middleware layer (`src/proxy.ts`) which has both:

```typescript
// src/proxy.ts — already has user, org, and pathname context
const teamPath = `/org/${orgSlug}/team`;
const settingsPath = `/org/${orgSlug}/settings`;
const isExempt = pathname === teamPath || pathname.startsWith(`${teamPath}/`)
  || pathname === settingsPath || pathname.startsWith(`${settingsPath}/`);

if (!isExempt) {
  const { count } = await supabase
    .from('member_departments')
    .select('id, department:departments!inner(org_id)', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('department.org_id', org.id);

  if (count === 0) {
    return NextResponse.redirect(new URL(teamPath, request.url));
  }
}
```

Always exempt the redirect destination and related pages to avoid loops. Use `head: true` with `count: 'exact'` for existence checks — avoids transferring row data.

## Why This Matters

- **Two-phase deploy** prevents data loss and downtime during model migrations. Rushing straight to the new model risks breaking reads while backfill is in progress.
- **SECURITY DEFINER with internal validation** is the only safe way to implement cross-table access patterns that RLS alone cannot express. Skipping validation creates privilege escalation vectors.
- **RLS policy swap** prevents access gaps that would lock users out during migration.
- **Forward-only transitions** prevent data integrity issues (e.g., a "complete" priority being moved back to "proposed") and simplify UI state management.
- **Bridge trigger guards** prevent the old system from corrupting new-system-only states during the transition period.
- **Service role context handling** is critical for any flow that runs outside a user session (invites, webhooks, cron jobs).
- **Additive SELECT policies** are the correct PostgreSQL pattern for widening visibility without weakening existing policies. Modifying the existing policy risks breaking other consumers.
- **Leaning on existing RLS** for simple self-mutations avoids unnecessary SECURITY DEFINER surface area.
- **Proxy-level redirects** solve the Next.js limitation of no pathname access in server layouts and keep redirect logic co-located with other auth/routing guards.

## When to Apply

- Building multi-tenant features where different roles need scoped access to shared data
- Migrating from one data model to another in a production Supabase app
- Creating invite or onboarding flows that need to write data before a user session exists
- Implementing status/workflow systems with enforced lifecycle rules
- Adding junction tables that bridge users to org-scoped entities
- Adding self-serve flows where users need to see resources they aren't yet linked to (visibility gap)
- Non-privileged roles need to perform INSERTs that RLS restricts to a higher role (SECURITY DEFINER RPC)
- Redirect based on user state + pathname in Next.js when server layouts lack pathname access

## Examples

### Before: Owner-only access with milestone stages

```typescript
// API: only owner can update priorities
if (role !== 'owner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

// UI: milestone-based progress
const completed = overview.byMilestoneStage[3] ?? 0;
const inProgress = (overview.byMilestoneStage[1] ?? 0) + (overview.byMilestoneStage[2] ?? 0);
```

### After: Role-scoped access with status lifecycle

```typescript
// API: owner OR linked department member
const linked = await isUserLinkedToDepartment(supabase, userId, priority.department_id);
if (role !== 'owner' && !linked) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// UI: status-based progress
const completed = overview.byStatus['complete'] ?? 0;
const inProgress = overview.byStatus['in_progress'] ?? 0;
const notStarted = (overview.byStatus['not_started'] ?? 0) + (overview.byStatus['approved'] ?? 0);
```

### Before: No department assignment at invite time

```typescript
// Invite acceptance: just creates org_members row
await supabase.from('org_members').insert({ org_id, user_id, role: invite.role });
```

### After: Department pre-assignment during invite acceptance

```typescript
// Invite acceptance: creates org_members row + links departments
await supabase.from('org_members').insert({ org_id, user_id, role: invite.role });
if (invite.department_ids?.length) {
  await supabase.rpc('link_departments_for_invite', {
    p_user_id: userId,
    p_department_ids: invite.department_ids,
  });
}
```

### Before: Members with 0 departments see empty picker

```typescript
// getDepartments() uses user-scoped Supabase client
// dept_select_scoped only returns linked departments for members
// Member with 0 links → 0 visible departments → stuck
const allDepts = await getDepartments(org.id); // returns []
```

### After: Additive SELECT policy lets members see all org departments

```sql
-- Migration 020: additive policy, no existing policy changed
CREATE POLICY "dept_select_org_member"
  ON departments FOR SELECT
  USING (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));
```

```typescript
const allDepts = await getDepartments(org.id); // returns all org departments
```

### Before: No way to leave a department

```typescript
// Only self_select_departments (INSERT) existed — no unlink path
// Users stuck in departments they joined by mistake
```

### After: Direct DELETE via existing RLS

```typescript
// md_delete_self RLS policy already allows users to delete own rows
await supabase.from('member_departments').delete()
  .eq('user_id', user.id).eq('department_id', departmentId);
```

## Related

- [Supabase RLS Org Creation with SECURITY DEFINER](../database-issues/supabase-rls-org-creation-security-definer-2026-04-13.md) — foundational SECURITY DEFINER pattern; this doc extends it to department-scoped access, junction tables, and self-serve department creation
- [Auth Proxy Public Path Registration](auth-proxy-public-path-registration-2026-04-13.md) — related auth pattern for public routes; relevant when self-serve pages need unauthenticated access
