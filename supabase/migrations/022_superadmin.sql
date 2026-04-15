-- Migration 022: Superadmin portal
--
-- Creates:
--   - platform_admins: runtime source of truth for who has /admin access
--   - admin_audit_log: append-only log of every destructive/sensitive operator action
--   - BEFORE UPDATE OR DELETE trigger on admin_audit_log enforcing append-only at DB level
--   - log_admin_action(): SECURITY DEFINER RPC for Node to write audit rows via one canonical path
--
-- Schema fixes:
--   - Five FKs to auth.users get ON DELETE SET NULL (or DROP NOT NULL + SET NULL for priority_notes.user_id)
--     so that supabase.auth.admin.deleteUser() doesn't FK-fail when the user has authored content.
--
-- Relationships with existing RLS:
--   - All admin reads/writes go through createAdminClient() (service role) in Node.
--   - platform_admins and admin_audit_log deny anon/authenticated via RLS; service role bypasses.
--   - SUPERADMIN_EMAILS env-var bootstrap lives in app code (src/lib/admin/is-platform-admin.ts),
--     not in the DB. This keeps the failsafe independent of platform_admins content.

-- ============================================================
-- 1. platform_admins
-- ============================================================
CREATE TABLE platform_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE platform_admins ENABLE ROW LEVEL SECURITY;

-- No policies: only service role (via createAdminClient) can read/write.
-- Authenticated/anon requests get empty result sets, which is what we want.

-- ============================================================
-- 2. admin_audit_log
-- ============================================================
CREATE TABLE admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  target_org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  action text NOT NULL,
  before jsonb,
  after jsonb,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_log_operator ON admin_audit_log(operator_id);
CREATE INDEX idx_admin_audit_log_target_user ON admin_audit_log(target_user_id);
CREATE INDEX idx_admin_audit_log_action ON admin_audit_log(action);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. Append-only trigger on admin_audit_log
-- ============================================================
-- Rationale: "append-only by UI convention" is weak. A DB-level trigger ensures even
-- direct service-role UPDATE/DELETE requests fail. To legitimately alter the log
-- (e.g., a future migration), drop the trigger in a transaction, do the work, recreate.

CREATE OR REPLACE FUNCTION admin_audit_log_block_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'admin_audit_log is append-only (migration 022)';
END;
$$;

CREATE TRIGGER admin_audit_log_append_only
BEFORE UPDATE OR DELETE ON admin_audit_log
FOR EACH ROW
EXECUTE FUNCTION admin_audit_log_block_mutation();

-- ============================================================
-- 4. log_admin_action() SECURITY DEFINER RPC
-- ============================================================
-- Single canonical write path for audit rows. Takes actor + target + action + state.
-- Callable only by service-role in practice (no EXECUTE grants to authenticated/anon).

CREATE OR REPLACE FUNCTION log_admin_action(
  p_operator_id uuid,
  p_action text,
  p_target_user_id uuid DEFAULT NULL,
  p_target_org_id uuid DEFAULT NULL,
  p_before jsonb DEFAULT NULL,
  p_after jsonb DEFAULT NULL,
  p_reason text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO admin_audit_log (
    operator_id, action, target_user_id, target_org_id, before, after, reason
  ) VALUES (
    p_operator_id, p_action, p_target_user_id, p_target_org_id, p_before, p_after, p_reason
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Revoke default PUBLIC EXECUTE; service role bypasses this.
REVOKE EXECUTE ON FUNCTION log_admin_action(uuid, text, uuid, uuid, jsonb, jsonb, text) FROM PUBLIC;

-- ============================================================
-- 5. FK cleanup: allow auth.users deletion by setting authorship FKs to NULL
-- ============================================================
-- Before this migration, supabase.auth.admin.deleteUser() would FK-fail on any user who
-- had ever authored an invite, upload, project brief, priority note, or member-department
-- assignment. Intent of "delete user" is remove the auth row, not scrub their content.
-- We null authorship instead of cascading so historical data (notes, briefs) survives.

-- Each block is guarded with to_regclass() so the migration works against any
-- Supabase project whose prior migrations are partial. Tables that don't exist
-- in this environment are silently skipped; they can't hold user references
-- anyway.

-- 5.1 invites.created_by
DO $$ BEGIN
  IF to_regclass('public.invites') IS NOT NULL THEN
    ALTER TABLE invites DROP CONSTRAINT IF EXISTS invites_created_by_fkey;
    ALTER TABLE invites
      ADD CONSTRAINT invites_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 5.2 uploads.uploaded_by
DO $$ BEGIN
  IF to_regclass('public.uploads') IS NOT NULL THEN
    ALTER TABLE uploads DROP CONSTRAINT IF EXISTS uploads_uploaded_by_fkey;
    ALTER TABLE uploads
      ADD CONSTRAINT uploads_uploaded_by_fkey
      FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 5.3 project_briefs.created_by
DO $$ BEGIN
  IF to_regclass('public.project_briefs') IS NOT NULL THEN
    ALTER TABLE project_briefs DROP CONSTRAINT IF EXISTS project_briefs_created_by_fkey;
    ALTER TABLE project_briefs
      ADD CONSTRAINT project_briefs_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 5.4 member_departments.created_by (user_id already CASCADEs)
DO $$ BEGIN
  IF to_regclass('public.member_departments') IS NOT NULL THEN
    ALTER TABLE member_departments DROP CONSTRAINT IF EXISTS member_departments_created_by_fkey;
    ALTER TABLE member_departments
      ADD CONSTRAINT member_departments_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 5.5 priority_notes.user_id — currently NOT NULL with no ON DELETE; needs both changes.
DO $$ BEGIN
  IF to_regclass('public.priority_notes') IS NOT NULL THEN
    ALTER TABLE priority_notes ALTER COLUMN user_id DROP NOT NULL;
    ALTER TABLE priority_notes DROP CONSTRAINT IF EXISTS priority_notes_user_id_fkey;
    ALTER TABLE priority_notes
      ADD CONSTRAINT priority_notes_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- Done. To apply: supabase migration up, or paste into the Supabase SQL editor.
-- ============================================================
