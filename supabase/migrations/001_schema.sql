-- Multi-tenant schema for X-Ray

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Org membership
CREATE TABLE org_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE (org_id, user_id)
);

-- Invites
CREATE TABLE invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  email text,
  max_uses int,
  use_count int DEFAULT 0,
  expires_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Departments
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  mission text DEFAULT '',
  scope text DEFAULT '',
  tools text[] DEFAULT '{}',
  single_points_of_failure text[] DEFAULT '{}',
  pain_points text[] DEFAULT '{}',
  tribal_knowledge_risks text[] DEFAULT '{}',
  UNIQUE (org_id, slug)
);

-- Team members
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  title text DEFAULT '',
  responsibilities text DEFAULT ''
);

-- Priorities
CREATE TABLE priorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  rank int NOT NULL,
  name text NOT NULL,
  effort text DEFAULT '',
  complexity text DEFAULT '',
  impact text DEFAULT '',
  what_to_automate text DEFAULT '',
  current_state text DEFAULT '',
  why_it_matters text DEFAULT '',
  estimated_time_savings text DEFAULT '',
  suggested_approach text DEFAULT '',
  success_criteria text DEFAULT '',
  dependencies text[] DEFAULT '{}',
  status text DEFAULT '',
  UNIQUE (department_id, rank)
);

-- Milestones
CREATE TABLE milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  priority_id uuid UNIQUE NOT NULL REFERENCES priorities(id) ON DELETE CASCADE,
  stage int NOT NULL DEFAULT 0 CHECK (stage BETWEEN 0 AND 3),
  updated_at timestamptz DEFAULT now(),
  notes text DEFAULT ''
);

-- Scaling risks
CREATE TABLE scaling_risks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  area text NOT NULL,
  risk text NOT NULL,
  mitigation text DEFAULT ''
);

-- Quick wins
CREATE TABLE quick_wins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  description text NOT NULL
);

-- 30-day targets
CREATE TABLE thirty_day_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  description text NOT NULL
);

-- 90-day targets
CREATE TABLE ninety_day_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  description text NOT NULL
);

-- ====================
-- Row Level Security
-- ====================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE scaling_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE thirty_day_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ninety_day_targets ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION user_org_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT org_id FROM org_members WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION user_department_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT d.id FROM departments d WHERE d.org_id IN (SELECT user_org_ids());
$$;

-- Organizations
CREATE POLICY "Users can view their orgs"
  ON organizations FOR SELECT
  USING (id IN (SELECT user_org_ids()));

CREATE POLICY "Authenticated users can create orgs"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Org members
CREATE POLICY "Users can view org members"
  ON org_members FOR SELECT
  USING (org_id IN (SELECT user_org_ids()));

CREATE POLICY "Users can insert themselves as members"
  ON org_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can update members"
  ON org_members FOR UPDATE
  USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role = 'owner'
  ));

CREATE POLICY "Admins can remove members"
  ON org_members FOR DELETE
  USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Invites
CREATE POLICY "Anyone can read invites"
  ON invites FOR SELECT
  USING (true);

CREATE POLICY "Admins can create invites"
  ON invites FOR INSERT
  WITH CHECK (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

CREATE POLICY "Authenticated users can update invite use_count"
  ON invites FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Departments
CREATE POLICY "Users can access org departments"
  ON departments FOR ALL
  USING (org_id IN (SELECT user_org_ids()));

-- Team members
CREATE POLICY "Users can access org team members"
  ON team_members FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- Priorities
CREATE POLICY "Users can access org priorities"
  ON priorities FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- Milestones
CREATE POLICY "Users can access org milestones"
  ON milestones FOR ALL
  USING (priority_id IN (
    SELECT p.id FROM priorities p WHERE p.department_id IN (SELECT user_department_ids())
  ));

-- Scaling risks
CREATE POLICY "Users can access org scaling risks"
  ON scaling_risks FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- Quick wins
CREATE POLICY "Users can access org quick wins"
  ON quick_wins FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- 30-day targets
CREATE POLICY "Users can access org thirty day targets"
  ON thirty_day_targets FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- 90-day targets
CREATE POLICY "Users can access org ninety day targets"
  ON ninety_day_targets FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- Indexes
CREATE INDEX idx_org_members_user ON org_members(user_id);
CREATE INDEX idx_org_members_org ON org_members(org_id);
CREATE INDEX idx_departments_org ON departments(org_id);
CREATE INDEX idx_priorities_dept ON priorities(department_id);
CREATE INDEX idx_team_members_dept ON team_members(department_id);
CREATE INDEX idx_milestones_priority ON milestones(priority_id);
CREATE INDEX idx_invites_code ON invites(code);
