-- Add role to invites so invited users get the correct role on join
ALTER TABLE invites ADD COLUMN role text NOT NULL DEFAULT 'member'
  CHECK (role IN ('owner', 'admin', 'member'));

-- Add team_names to organizations for hackathon team assignment dropdowns
ALTER TABLE organizations ADD COLUMN team_names text[] DEFAULT '{}';

-- Fix: scope invites SELECT to org admins only (was wide open with USING (true))
DROP POLICY "Anyone can read invites" ON invites;

CREATE POLICY "Org admins can read invites"
  ON invites FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM org_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));
