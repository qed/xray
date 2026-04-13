-- Migration 015: Department-scoped RLS and SECURITY DEFINER RPCs
--
-- Rewrites RLS from org-wide FOR ALL to department-scoped SELECT/UPDATE/DELETE.
-- Creates RPCs for safe member-department assignment.
-- Strategy: create new policies first (coexist with old FOR ALL), then drop old.

-- ============================================================
-- 1. Role-aware department ID helper
-- ============================================================
CREATE OR REPLACE FUNCTION user_linked_department_ids(p_org_id uuid)
RETURNS SETOF uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role
  FROM org_members
  WHERE user_id = auth.uid() AND org_id = p_org_id;

  IF v_role IS NULL THEN
    RETURN; -- not a member of this org, return empty
  END IF;

  IF v_role = 'owner' OR v_role = 'admin' THEN
    -- Owners and admins see all departments in the org
    RETURN QUERY SELECT id FROM departments WHERE org_id = p_org_id;
  ELSE
    -- Members see only linked departments
    RETURN QUERY
      SELECT md.department_id
      FROM member_departments md
      JOIN departments d ON d.id = md.department_id
      WHERE md.user_id = auth.uid() AND d.org_id = p_org_id;
  END IF;
END;
$$;

-- Helper: get user's role in an org (used by policies)
CREATE OR REPLACE FUNCTION user_role_in_org(p_org_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM org_members WHERE user_id = auth.uid() AND org_id = p_org_id LIMIT 1;
$$;

-- Helper: get all department IDs a user is linked to (across all orgs)
-- Used in policies where we need a simple IN check without knowing the org
CREATE OR REPLACE FUNCTION user_all_linked_department_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- For owners/admins: all departments in their orgs
  -- For members: only linked departments
  SELECT d.id
  FROM departments d
  JOIN org_members om ON om.org_id = d.org_id AND om.user_id = auth.uid()
  WHERE om.role IN ('owner', 'admin')
  UNION
  SELECT md.department_id
  FROM member_departments md
  WHERE md.user_id = auth.uid();
$$;

-- Writable departments: departments the user can UPDATE (owner=all, member/admin=linked only)
CREATE OR REPLACE FUNCTION user_writable_department_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Owners: all departments in their orgs
  SELECT d.id
  FROM departments d
  JOIN org_members om ON om.org_id = d.org_id AND om.user_id = auth.uid()
  WHERE om.role = 'owner'
  UNION
  -- Members and admins: only linked departments
  SELECT md.department_id
  FROM member_departments md
  WHERE md.user_id = auth.uid();
$$;

-- ============================================================
-- 2. New split policies (coexist with old FOR ALL during rollout)
-- ============================================================

-- -- Departments --
CREATE POLICY "dept_select_scoped"
  ON departments FOR SELECT
  USING (id IN (SELECT user_all_linked_department_ids()));

CREATE POLICY "dept_update_owners_only"
  ON departments FOR UPDATE
  USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role = 'owner'
  ));

CREATE POLICY "dept_insert_owners_only"
  ON departments FOR INSERT
  WITH CHECK (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role = 'owner'
  ));

CREATE POLICY "dept_delete_owners_only"
  ON departments FOR DELETE
  USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role = 'owner'
  ));

-- -- Priorities --
CREATE POLICY "priorities_select_scoped"
  ON priorities FOR SELECT
  USING (department_id IN (SELECT user_all_linked_department_ids()));

CREATE POLICY "priorities_update_scoped"
  ON priorities FOR UPDATE
  USING (department_id IN (SELECT user_writable_department_ids()));

CREATE POLICY "priorities_insert_owners_only"
  ON priorities FOR INSERT
  WITH CHECK (department_id IN (
    SELECT d.id FROM departments d
    JOIN org_members om ON om.org_id = d.org_id AND om.user_id = auth.uid()
    WHERE om.role = 'owner'
  ));

CREATE POLICY "priorities_delete_owners_only"
  ON priorities FOR DELETE
  USING (department_id IN (
    SELECT d.id FROM departments d
    JOIN org_members om ON om.org_id = d.org_id AND om.user_id = auth.uid()
    WHERE om.role = 'owner'
  ));

-- -- Team Members --
CREATE POLICY "team_members_select_scoped"
  ON team_members FOR SELECT
  USING (department_id IN (SELECT user_all_linked_department_ids()));

CREATE POLICY "team_members_modify_owners_only"
  ON team_members FOR INSERT
  WITH CHECK (department_id IN (
    SELECT d.id FROM departments d
    JOIN org_members om ON om.org_id = d.org_id AND om.user_id = auth.uid()
    WHERE om.role = 'owner'
  ));

CREATE POLICY "team_members_delete_owners_only"
  ON team_members FOR DELETE
  USING (department_id IN (
    SELECT d.id FROM departments d
    JOIN org_members om ON om.org_id = d.org_id AND om.user_id = auth.uid()
    WHERE om.role = 'owner'
  ));

-- -- Member Departments --
CREATE POLICY "md_select_own_or_admin"
  ON member_departments FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM org_members om
      JOIN departments d ON d.org_id = om.org_id
      WHERE d.id = member_departments.department_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "md_delete_self"
  ON member_departments FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "md_delete_admin"
  ON member_departments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM org_members om
      JOIN departments d ON d.org_id = om.org_id
      WHERE d.id = member_departments.department_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
    )
  );

-- -- Priority Notes --
CREATE POLICY "notes_select_linked"
  ON priority_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM priorities p
      WHERE p.id = priority_notes.priority_id
        AND p.department_id IN (SELECT user_all_linked_department_ids())
    )
  );

CREATE POLICY "notes_insert_linked"
  ON priority_notes FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM priorities p
      WHERE p.id = priority_notes.priority_id
        AND p.department_id IN (SELECT user_writable_department_ids())
    )
  );

CREATE POLICY "notes_delete_own"
  ON priority_notes FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "notes_delete_owner"
  ON priority_notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM priorities p
      JOIN departments d ON d.id = p.department_id
      JOIN org_members om ON om.org_id = d.org_id
      WHERE p.id = priority_notes.priority_id
        AND om.user_id = auth.uid()
        AND om.role = 'owner'
    )
  );

-- ============================================================
-- 3. Drop old FOR ALL policies
-- ============================================================
DROP POLICY IF EXISTS "Users can access org departments" ON departments;
DROP POLICY IF EXISTS "Users can access org team members" ON team_members;
DROP POLICY IF EXISTS "Users can access org priorities" ON priorities;
DROP POLICY IF EXISTS "Users can access org milestones" ON milestones;
DROP POLICY IF EXISTS "Users can access org scaling risks" ON scaling_risks;
DROP POLICY IF EXISTS "Users can access org quick wins" ON quick_wins;
DROP POLICY IF EXISTS "Users can access org thirty day targets" ON thirty_day_targets;
DROP POLICY IF EXISTS "Users can access org ninety day targets" ON ninety_day_targets;

-- Re-create org-scoped FOR ALL on tables that don't need department scoping
CREATE POLICY "scaling_risks_org_access"
  ON scaling_risks FOR ALL
  USING (department_id IN (SELECT user_all_linked_department_ids()));

CREATE POLICY "quick_wins_org_access"
  ON quick_wins FOR ALL
  USING (department_id IN (SELECT user_all_linked_department_ids()));

CREATE POLICY "thirty_day_targets_org_access"
  ON thirty_day_targets FOR ALL
  USING (department_id IN (SELECT user_all_linked_department_ids()));

CREATE POLICY "ninety_day_targets_org_access"
  ON ninety_day_targets FOR ALL
  USING (department_id IN (SELECT user_all_linked_department_ids()));

CREATE POLICY "milestones_org_access"
  ON milestones FOR ALL
  USING (priority_id IN (
    SELECT p.id FROM priorities p
    WHERE p.department_id IN (SELECT user_all_linked_department_ids())
  ));

-- ============================================================
-- 4. SECURITY DEFINER RPCs for department assignment
-- ============================================================

-- Admin/owner assigns departments to a member
CREATE OR REPLACE FUNCTION assign_member_departments(
  p_user_id uuid,
  p_department_ids uuid[],
  p_org_id uuid
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid;
  v_caller_role text;
  v_target_role text;
  v_valid_dept_count int;
  v_inserted int := 0;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate caller is owner or admin of the org
  SELECT role INTO v_caller_role
  FROM org_members
  WHERE user_id = v_caller_id AND org_id = p_org_id;

  IF v_caller_role IS NULL OR v_caller_role NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'Only owners and admins can assign departments';
  END IF;

  -- Validate target user is a member of the org
  SELECT role INTO v_target_role
  FROM org_members
  WHERE user_id = p_user_id AND org_id = p_org_id;

  IF v_target_role IS NULL THEN
    RAISE EXCEPTION 'Target user is not a member of this organization';
  END IF;

  -- Validate array size
  IF array_length(p_department_ids, 1) > 50 THEN
    RAISE EXCEPTION 'Cannot assign more than 50 departments at once';
  END IF;

  -- Validate ALL department IDs belong to this org (reject entire call if any invalid)
  SELECT COUNT(*) INTO v_valid_dept_count
  FROM departments
  WHERE id = ANY(p_department_ids) AND org_id = p_org_id;

  IF v_valid_dept_count != array_length(p_department_ids, 1) THEN
    RAISE EXCEPTION 'One or more department IDs do not belong to this organization';
  END IF;

  -- First remove existing assignments for this user in this org
  DELETE FROM member_departments md
  USING departments d
  WHERE md.department_id = d.id
    AND d.org_id = p_org_id
    AND md.user_id = p_user_id;

  -- Insert new assignments
  INSERT INTO member_departments (user_id, department_id, created_by)
  SELECT p_user_id, unnest(p_department_ids), v_caller_id
  ON CONFLICT (user_id, department_id) DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  RETURN v_inserted;
END;
$$;

GRANT EXECUTE ON FUNCTION assign_member_departments(uuid, uuid[], uuid) TO authenticated;

-- Member self-selects departments (trust-based)
CREATE OR REPLACE FUNCTION self_select_departments(
  p_department_ids uuid[],
  p_org_id uuid
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  v_valid_dept_count int;
  v_inserted int := 0;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate caller is a member of the org
  SELECT role INTO v_role
  FROM org_members
  WHERE user_id = v_user_id AND org_id = p_org_id;

  IF v_role IS NULL THEN
    RAISE EXCEPTION 'Not a member of this organization';
  END IF;

  -- Validate array size
  IF array_length(p_department_ids, 1) > 50 THEN
    RAISE EXCEPTION 'Cannot select more than 50 departments at once';
  END IF;

  -- Validate ALL department IDs belong to this org
  SELECT COUNT(*) INTO v_valid_dept_count
  FROM departments
  WHERE id = ANY(p_department_ids) AND org_id = p_org_id;

  IF v_valid_dept_count != array_length(p_department_ids, 1) THEN
    RAISE EXCEPTION 'One or more department IDs do not belong to this organization';
  END IF;

  -- Insert assignments (self-assigned: created_by = self)
  INSERT INTO member_departments (user_id, department_id, created_by)
  SELECT v_user_id, unnest(p_department_ids), v_user_id
  ON CONFLICT (user_id, department_id) DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  RETURN v_inserted;
END;
$$;

GRANT EXECUTE ON FUNCTION self_select_departments(uuid[], uuid) TO authenticated;

-- Invite-based department linking (service role context, auth.uid() is NULL)
CREATE OR REPLACE FUNCTION link_departments_for_invite(
  p_user_id uuid,
  p_department_ids uuid[],
  p_org_id uuid,
  p_invite_id uuid
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite_org_id uuid;
  v_valid_dept_count int;
  v_inserted int := 0;
BEGIN
  -- Validate the invite exists and belongs to this org
  SELECT org_id INTO v_invite_org_id
  FROM invites
  WHERE id = p_invite_id;

  IF v_invite_org_id IS NULL THEN
    RAISE EXCEPTION 'Invite not found';
  END IF;

  IF v_invite_org_id != p_org_id THEN
    RAISE EXCEPTION 'Invite does not belong to this organization';
  END IF;

  -- Validate user is a member of the org
  IF NOT EXISTS (
    SELECT 1 FROM org_members WHERE user_id = p_user_id AND org_id = p_org_id
  ) THEN
    RAISE EXCEPTION 'User is not a member of this organization';
  END IF;

  -- Validate array size
  IF p_department_ids IS NULL OR array_length(p_department_ids, 1) IS NULL THEN
    RETURN 0;
  END IF;

  IF array_length(p_department_ids, 1) > 50 THEN
    RAISE EXCEPTION 'Cannot assign more than 50 departments at once';
  END IF;

  -- Validate ALL department IDs belong to this org
  SELECT COUNT(*) INTO v_valid_dept_count
  FROM departments
  WHERE id = ANY(p_department_ids) AND org_id = p_org_id;

  IF v_valid_dept_count != array_length(p_department_ids, 1) THEN
    RAISE EXCEPTION 'One or more department IDs do not belong to this organization';
  END IF;

  -- Insert assignments
  INSERT INTO member_departments (user_id, department_id, created_by)
  SELECT p_user_id, unnest(p_department_ids), NULL  -- NULL created_by = system/invite
  ON CONFLICT (user_id, department_id) DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  RETURN v_inserted;
END;
$$;

-- Grant to service role (this is called from server-side invite acceptance)
GRANT EXECUTE ON FUNCTION link_departments_for_invite(uuid, uuid[], uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION link_departments_for_invite(uuid, uuid[], uuid, uuid) TO authenticated;
