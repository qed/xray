-- Migration 021: Org-wide read access for all members
--
-- X-Ray is a shared visibility tool — every org member should see every
-- department and priority in their org by default. Migration 015 scoped
-- SELECT to linked departments for members; this restores org-wide read
-- while keeping writes department-scoped (user_writable_department_ids
-- is unchanged).
--
-- Strategy: redefine user_all_linked_department_ids() to return every
-- department in any org the caller is a member of, regardless of role
-- or member_departments links. All existing SELECT policies reference
-- this helper, so they automatically widen.

CREATE OR REPLACE FUNCTION user_all_linked_department_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Every member (owner, admin, or member) can read every department in
  -- orgs they belong to. Writes are still gated by
  -- user_writable_department_ids().
  SELECT d.id
  FROM departments d
  JOIN org_members om ON om.org_id = d.org_id
  WHERE om.user_id = auth.uid();
$$;
