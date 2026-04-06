-- Project briefs: point-in-time snapshot of department AI readiness assessment
CREATE TABLE project_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text DEFAULT '',
  profile_snapshot jsonb NOT NULL DEFAULT '{}',
  priorities_snapshot jsonb NOT NULL DEFAULT '[]',
  team_count int DEFAULT 0,
  total_potential_hours_per_week numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE project_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view project briefs"
  ON project_briefs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = project_briefs.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Owners can manage project briefs"
  ON project_briefs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = project_briefs.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role = 'owner'
    )
  );
