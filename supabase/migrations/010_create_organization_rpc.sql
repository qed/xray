-- ====================
-- RPC: create_organization
-- ====================
-- Atomically creates an organization and makes the calling user its owner.
-- Uses SECURITY DEFINER to bypass RLS on organizations/org_members so that
-- a newly-signed-up user (who isn't a member of any org yet) can create one.
-- Callers must be authenticated (auth.uid() IS NOT NULL) — enforced in-body.

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
