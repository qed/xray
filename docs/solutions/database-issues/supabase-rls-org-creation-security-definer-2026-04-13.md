---
title: Supabase RLS blocks new user org creation — use SECURITY DEFINER RPC
date: 2026-04-13
category: database-issues
module: authentication
problem_type: runtime_error
component: database_migration
severity: high
symptoms:
  - "new row violates row-level security policy for table organizations"
  - New users unable to create their first organization on /join page
root_cause: missing_config
resolution_type: code_fix
tags:
  - supabase
  - rls
  - security-definer
  - org-creation
  - postgresql
---

# Supabase RLS blocks new user org creation — use SECURITY DEFINER RPC

## Problem

New users signing up and attempting to create their first organization on the `/join` page received the error: "new row violates row-level security policy for table organizations". This blocked the entire onboarding flow.

## Symptoms

- Error appears immediately after clicking "Create Organization" with a valid name
- Only affects new users creating their first org (existing org members unaffected)
- The RLS INSERT policy `WITH CHECK (auth.uid() IS NOT NULL)` exists and should permit any authenticated user

## What Didn't Work

- The existing RLS policy looked correct in the migration file (`001_schema.sql`) — `WITH CHECK (auth.uid() IS NOT NULL)` should pass for any authenticated user
- Production database may have drifted from migration state, but verifying/re-applying the policy is fragile

## Solution

Created a `SECURITY DEFINER` PostgreSQL function that bypasses RLS entirely and atomically creates both the org and the owner membership:

```sql
CREATE OR REPLACE FUNCTION create_organization(p_name text, p_slug text)
RETURNS organizations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_org organizations;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO organizations (name, slug)
  VALUES (p_name, p_slug)
  RETURNING * INTO v_org;

  INSERT INTO org_members (org_id, user_id, role)
  VALUES (v_org.id, v_user_id, 'owner');

  RETURN v_org;
END;
$$;

GRANT EXECUTE ON FUNCTION create_organization(text, text) TO authenticated;
```

Updated the join page to call the RPC instead of direct inserts:

```typescript
// Before — two separate inserts, first one blocked by RLS
const { data: org } = await supabase.from('organizations').insert({ name, slug }).select().single();
await supabase.from('org_members').insert({ org_id: org.id, user_id: user.id, role: 'owner' });

// After — single RPC call, atomic, bypasses RLS
const { error } = await supabase.rpc('create_organization', { p_name: orgName, p_slug: slug });
```

## Why This Works

`SECURITY DEFINER` functions execute with the privileges of the function owner (typically the database owner), not the calling role. This bypasses RLS while still verifying authentication via `auth.uid()` inside the function body. The function also makes the operation atomic — if either insert fails, neither commits.

## Prevention

- For operations where a user must create a resource and immediately become its owner/member, prefer SECURITY DEFINER RPCs over relying on RLS INSERT policies
- When RLS policies depend on membership tables (like `user_org_ids()`), bootstrapping operations that create the first membership are inherently circular — SECURITY DEFINER breaks the cycle
- Always run the migration SQL in the Supabase SQL Editor after deploying code changes

## Related Issues

- `supabase/migrations/010_create_organization_rpc.sql` — the migration file
- `src/app/(public)/join/page.tsx` — updated client code
