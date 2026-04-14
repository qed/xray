-- Migration 020: Department self-serve support
--
-- 1. New SELECT policy so members can see all org departments (for the picker)
-- 2. Unique constraint on department names per org
-- 3. create_department_shell RPC — creates an empty department + auto-joins creator

-- ============================================================
-- 1. Allow any org member to see all departments in their org
-- ============================================================
-- The existing dept_select_scoped policy only returns departments a member
-- is linked to via member_departments. Members with 0 links see nothing.
-- This additive policy lets any org member see all departments in their org
-- (PostgreSQL OR's multiple SELECT policies together).

CREATE POLICY "dept_select_org_member"
  ON departments FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));

-- ============================================================
-- 2. Unique department names per org
-- ============================================================

ALTER TABLE departments ADD CONSTRAINT departments_org_name_unique UNIQUE (org_id, name);

-- ============================================================
-- 3. create_department_shell RPC
-- ============================================================
-- Creates an empty department (name + slug only) and auto-joins the creator.
-- Uses SECURITY DEFINER to bypass dept_insert_owners_only RLS policy,
-- since any role can create departments in the self-serve flow.

CREATE OR REPLACE FUNCTION create_department_shell(
  p_name text,
  p_org_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  v_dept_id uuid;
  v_slug_base text;
  v_slug_candidate text;
  v_slug_counter int;
BEGIN
  -- Authenticate
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate org membership (any role)
  SELECT role INTO v_role
  FROM org_members
  WHERE user_id = v_user_id AND org_id = p_org_id;

  IF v_role IS NULL THEN
    RAISE EXCEPTION 'Not a member of this organization';
  END IF;

  -- Validate name
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RAISE EXCEPTION 'Department name cannot be empty';
  END IF;

  IF length(trim(p_name)) > 100 THEN
    RAISE EXCEPTION 'Department name cannot exceed 100 characters';
  END IF;

  -- Generate slug from name (same pattern as apply_extraction)
  v_slug_base := lower(regexp_replace(
    regexp_replace(
      regexp_replace(trim(p_name), '[^a-z0-9\s-]', '', 'gi'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  ));
  v_slug_base := left(trim(BOTH '-' FROM v_slug_base), 80);

  -- Dedup slug with counter suffix
  v_slug_candidate := v_slug_base;
  v_slug_counter := 1;
  WHILE EXISTS (SELECT 1 FROM departments WHERE org_id = p_org_id AND slug = v_slug_candidate) LOOP
    v_slug_counter := v_slug_counter + 1;
    v_slug_candidate := v_slug_base || '-' || v_slug_counter;
  END LOOP;

  -- Create empty department
  INSERT INTO departments (org_id, name, slug)
  VALUES (p_org_id, trim(p_name), v_slug_candidate)
  RETURNING id INTO v_dept_id;

  -- Auto-join creator to the new department
  INSERT INTO member_departments (user_id, department_id, created_by)
  VALUES (v_user_id, v_dept_id, v_user_id)
  ON CONFLICT (user_id, department_id) DO NOTHING;

  RETURN v_dept_id;
END;
$$;

GRANT EXECUTE ON FUNCTION create_department_shell(text, uuid) TO authenticated;
