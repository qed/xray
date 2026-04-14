---
title: "feat: Department self-serve join, leave, and create"
status: completed
origin: docs/brainstorms/department-self-serve-requirements.md
date: 2026-04-14
---

# Department Self-Serve: Join, Leave, and Create

## Problem Frame

Department assignment is fragmented: `/team` nav is member-only, new users land on the dashboard with no guidance to pick a department, there's no way to leave a department, and creating new departments requires a full Intake flow. This creates onboarding friction and makes department management feel rigid.

(see origin: `docs/brainstorms/department-self-serve-requirements.md`)

## Scope Boundaries

- **Not changing Intake** — department creation here is just an empty shell (name only); full profiles still come from Intake
- **No approval workflows** — join/leave is trust-based, no confirmation from department leads
- **Not changing dashboard** — dashboard continues to show all org data for owners; scoped data for members
- **Not removing invite pre-assignment** — invites can still pre-link departments; this adds self-serve on top

## Requirements Trace

| Req | Description | Implementation Unit |
|-----|-------------|-------------------|
| R1 | `/team` visible in nav for all roles | Unit 1 |
| R2 | Nav link under user's name in top-left | Unit 1 |
| R3 | Users with no departments redirected to `/team` from any org page | Unit 2 |
| R4 | Redirect is role-agnostic | Unit 2 |
| R5 | Department picker shows all existing departments | Already exists |
| R6 | "Create new department" option with inline name form | Unit 4 |
| R7 | Creating a department creates an empty shell (name only) | Unit 3, Unit 4 |
| R8 | Users can join additional departments from `/team` | Unit 5 |
| R9 | Users can leave any department from `/team` | Unit 3, Unit 5 |
| R10 | Join/leave available to all roles with no restrictions | Unit 3, Unit 5 |

## Key Decisions

### D1: Nav link — modify existing entry (not add a new one)
Change `roles: ['member']` to `roles: ['owner', 'admin', 'member']` on the existing "My Team" link in `src/app/org/[orgSlug]/layout.tsx:35`. One-line change, no new nav entry needed.

### D2: Redirect lives in org layout server component (not middleware)
The org layout (`src/app/org/[orgSlug]/layout.tsx`) already calls `getUserRole()` and has the auth/org context. Adding a `getUserDepartments()` check there covers all org pages. No middleware file exists in this project — adding one would be a new pattern with more blast radius. Layout redirect is simpler and scoped.

**Exemptions:** `/team` (destination) and `/settings` (always accessible). Check against `pathname` in the layout.

### D3: Leave department — direct DELETE via new API route (no new RPC)
RLS policy `md_delete_self` (migration 015, line 181-183) already allows users to delete their own `member_departments` rows. A new API route `/api/departments/leave` can call a direct DELETE with the Supabase client — no SECURITY DEFINER RPC needed because RLS handles authorization.

### D4: Create empty department — new SECURITY DEFINER RPC
`dept_insert_owners_only` RLS policy (migration 015, line 109-113) restricts department INSERT to owners. Since R10 says any role can create, we need a SECURITY DEFINER RPC `create_department_shell` that:
1. Validates org membership (any role)
2. Creates the department (name + auto-generated slug, empty profile fields)
3. Inserts the creator into `member_departments` atomically
This avoids the circular RLS problem (can't join a department you just created if INSERT is RLS-blocked). Follows the same pattern as `self_select_departments`.

### D5: Department names unique per org
Add a `UNIQUE(org_id, name)` constraint to prevent duplicate department names, which would confuse users in the picker. The slug is already unique per org.

### D6: Orphaned departments allowed
If the last member leaves a department, it remains. No auto-delete, no warning. Empty departments can still be joined later or filled via Intake.

## Implementation Units

### Unit 1: Nav visibility for all roles
- [x] **Goal:** Make `/team` link visible to owners, admins, and members
- **Files:**
  - `src/app/org/[orgSlug]/layout.tsx` — change line 35: `roles: ['member']` → `roles: ['owner', 'admin', 'member']`
- **Approach:** One-line change to the `allNavLinks` array
- **Patterns to follow:** Other nav links in the same array already use `['owner', 'admin', 'member']` (e.g., Dashboard, Intake)
- **Test scenarios:**
  - Owner sees "My Team" in nav
  - Admin sees "My Team" in nav
  - Member continues to see "My Team" in nav
- **Verification:** All three roles see the `/team` link in the nav bar

### Unit 2: First-login redirect to `/team`
- [x] **Goal:** Users with no department links get redirected to `/team` from any org page (except `/team` and `/settings`)
- **Files:**
  - `src/app/org/[orgSlug]/layout.tsx` — add `getUserDepartments` check after role check, redirect if empty and path is not `/team` or `/settings`
- **Approach:**
  1. Import `getUserDepartments` (already exported from `src/lib/db.ts`)
  2. After `const role = await getUserRole(...)` (line 25), call `getUserDepartments(user.id, org.id)`
  3. If empty and current path is not `/${orgSlug}/team` or `/${orgSlug}/settings`, redirect to `/org/${orgSlug}/team`
  4. Need to access current pathname — use `headers()` to read the URL or pass it through params. In Next.js App Router layouts, use the `headers()` API to get the request URL.
- **Patterns to follow:** Existing redirects in the same layout (lines 20, 23, 26)
- **Deferred to implementation:** Determine the exact Next.js 16 API for reading the current URL in a server layout. Check `node_modules/next/dist/docs/` for the correct approach.
- **Test scenarios:**
  - New user with 0 departments visiting `/org/acme/dashboard` → redirected to `/org/acme/team`
  - New user visiting `/org/acme/team` → NOT redirected (no loop)
  - New user visiting `/org/acme/settings` → NOT redirected
  - User with 1+ departments visiting `/org/acme/dashboard` → NOT redirected
  - Owner with 0 departments visiting `/org/acme/tracker` → redirected to `/org/acme/team`
- **Verification:** Brand-new user accepting an invite cannot navigate to any org page other than `/team` or `/settings` until they select a department

### Unit 3: Migration — RLS fix, `create_department_shell` RPC, unique name constraint
- [x] **Goal:** Database support for department self-serve: fix member visibility, create empty departments, enforce unique names
- **Files:**
  - `supabase/migrations/020_department_self_serve.sql` (new)
- **Approach:**
  Create migration with:
  1. **New SELECT policy** `dept_select_org_member` on `departments` — allows any org member to see all departments in their org: `USING (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()))`. This is needed because the existing `dept_select_scoped` policy (via `user_all_linked_department_ids()`) only returns linked departments for members — so members with 0 departments see an empty picker. The new policy is additive (PostgreSQL OR's multiple SELECT policies).
  2. `UNIQUE` constraint on `departments(org_id, name)` — prevents duplicate department names per org
  3. `create_department_shell(p_name text, p_org_id uuid)` SECURITY DEFINER RPC that:
     - Validates `auth.uid()` is authenticated
     - Validates caller is an org member (any role)
     - Validates name is not empty and not too long (≤100 chars)
     - Generates slug from name (same pattern as `apply_extraction`: lowercase, strip special chars, hyphenate spaces, dedup with counter suffix)
     - Inserts into `departments` with only `name`, `slug`, `org_id` set (all other fields NULL/defaults)
     - Inserts creator into `member_departments`
     - Returns the new department `id`
- **Patterns to follow:**
  - `self_select_departments` in `supabase/migrations/015_department_scoped_rls.sql:351-402` — same validation structure (auth check, org membership, array bounds)
  - Slug generation in `supabase/migrations/014_department_lead_tables.sql:184` and `013_fix_apply_extraction_slug.sql:60`
- **Test scenarios:**
  - Member with 0 departments can SELECT all org departments (new policy works)
  - Member creates a department → department row exists with name and slug, creator is in `member_departments`
  - Creating a department with a duplicate name → error (unique constraint)
  - Unauthenticated call → error
  - Non-org-member call → error
  - Empty name → error
  - Name > 100 chars → error
  - Slug collision with counter suffix → dedup works
- **Verification:** Members can see all org departments in the picker; RPC creates department + member link atomically; duplicate names rejected

### Unit 4: "Create new department" UI + API route
- [x] **Goal:** Add "Create new department" option to the department picker with inline name form
- **Files:**
  - `src/app/org/[orgSlug]/team/DepartmentPicker.tsx` — add "Create new" card with inline text input
  - `src/app/api/departments/create/route.ts` (new) — API route calling `create_department_shell` RPC
- **Approach:**
  1. **API route:** POST handler that validates auth, reads `{ orgId, name }` from body, calls `supabase.rpc('create_department_shell', { p_name: name, p_org_id: orgId })`, returns `{ departmentId }` or error
  2. **DepartmentPicker changes:**
     - Add a "Create new department" card at the end of the grid (styled differently — dashed border, plus icon)
     - Clicking it shows an inline text input + "Create" button (replaces the card content)
     - On submit, POST to `/api/departments/create`, then refresh the page (same pattern as existing save)
     - Handle errors (duplicate name, empty name) with inline error message
  3. **Zero departments state:** When `allDepts.length === 0` in `page.tsx` (line 32-41), show the DepartmentPicker with just the "Create new" option instead of the dead-end message
- **Patterns to follow:**
  - Existing DepartmentPicker card styling (line 67-91)
  - Existing `/api/departments/assign/route.ts` for API route structure
- **Test scenarios:**
  - User clicks "Create new", types name, submits → new department appears in picker, user is auto-joined
  - User submits empty name → inline error
  - User submits duplicate name → inline error "A department with this name already exists"
  - Zero-departments org → "Create new" option still available
  - After creating, user can select it and continue
- **Verification:** User can create a new department from the picker and is automatically a member of it

### Unit 5: Join additional + leave departments from TeamView
- [x] **Goal:** Users with existing departments can join more or leave any from `/team`
- **Files:**
  - `src/app/org/[orgSlug]/team/TeamView.tsx` — add "Join departments" button and "Leave" button per department
  - `src/app/org/[orgSlug]/team/page.tsx` — pass `allDepts` to TeamView for the join picker
  - `src/app/api/departments/leave/route.ts` (new) — API route for leaving a department
- **Approach:**
  1. **Leave API route:** POST handler that validates auth, reads `{ orgId, departmentId }` from body, calls `supabase.from('member_departments').delete().eq('user_id', user.id).eq('department_id', departmentId)`. RLS `md_delete_self` handles authorization.
  2. **TeamView changes:**
     - Add a "Leave" button on each department card (small, secondary style — e.g., text button in the card header)
     - On click, confirm with a simple "Leave [dept name]?" prompt, then POST to `/api/departments/leave`
     - After leaving, refresh. If user has 0 departments after leave, page naturally shows the picker again.
  3. **Join additional:**
     - Add a "Join a department" button/section at the bottom of TeamView
     - Shows unjoined departments from the org (pass `allDepts` from page.tsx, filter out already-joined)
     - Reuse the existing `/api/departments/assign` endpoint with `selfSelect: true`
     - Include "Create new department" option in the join section (same pattern as Unit 4)
  4. **page.tsx changes:** Pass `allDepts` list to TeamView component (currently only passed to DepartmentPicker)
- **Patterns to follow:**
  - DepartmentPicker's `handleSave` pattern for the join flow (line 30-53)
  - Existing card styling in TeamView for consistent look
- **Test scenarios:**
  - User clicks "Leave" on a department → confirmation → removed from department, page refreshes
  - User leaves their only department → picker view shown
  - User clicks "Join a department" → sees unjoined departments → selects → joined
  - User with all departments already joined → "Join" section shows only "Create new"
  - Leave + rejoin → works (idempotent via ON CONFLICT DO NOTHING on join)
- **Verification:** Any user can freely join additional departments and leave existing ones from `/team`

## Dependencies and Sequencing

```
Unit 1 (nav) ─────────────────────────── can ship independently
Unit 2 (redirect) ────────────────────── can ship independently
Unit 3 (migration) ──┬── Unit 4 (create UI) ──┬── Unit 5 (join/leave)
                      └───────────────────────┘
```

- Units 1 and 2 have no dependencies — can be done first or in parallel
- Unit 3 (migration) must be deployed before Unit 4 (create UI depends on the RPC)
- Unit 5 (join/leave) depends on Unit 4 being done (shares the "Create new" pattern) but the leave API route could technically be built in parallel with Unit 4

**Recommended order:** Unit 1 → Unit 2 → Unit 3 → Unit 4 → Unit 5

## System-Wide Impact

- **Org layout performance:** Unit 2 adds one extra query (`getUserDepartments`) to every org page load. This is a lightweight junction table query filtered by `user_id` + `org_id` — should be fast. Once user has departments, it returns quickly and the redirect is skipped.
- **RLS unchanged for existing policies:** No existing RLS policies are modified. The new RPC uses SECURITY DEFINER to bypass `dept_insert_owners_only` specifically for the shell creation case.
- **Dashboard unaffected:** Empty-shell departments have no priorities, team members, or profile data — they won't appear in dashboard aggregates until filled via Intake.

## Deferred to Implementation

- Exact Next.js 16 API for reading the current pathname in a server layout (Unit 2). Check `node_modules/next/dist/docs/` for the `headers()` approach or `usePathname` equivalent in server components.
- Slug deduplication logic details — follow the existing pattern in `apply_extraction` but verify the counter suffix approach works for the shell creation case.
- TeamView component structure — read the file during implementation to determine exact placement of join/leave UI.

## Verification

1. **New user flow:** Accept invite → land on any org page → redirected to `/team` → see picker → select departments or create new → land on team view
2. **Join flow:** Existing user on `/team` → click "Join a department" → see unjoined departments → select → joined and visible in team view
3. **Leave flow:** Existing user on `/team` → click "Leave" on a department → confirm → removed → if last department, picker shown
4. **Create flow:** Any user on picker → click "Create new department" → enter name → department created, user auto-joined
5. **Nav:** Owner, admin, and member all see "My Team" in the nav
6. **Edge cases:** Duplicate department name rejected, last member can leave (orphan OK), zero-departments org shows create option
