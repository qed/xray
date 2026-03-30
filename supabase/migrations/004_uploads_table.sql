-- Archive of every uploaded file for testing and verification
CREATE TABLE uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department_slug text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('profile', 'priorities')),
  filename text NOT NULL,
  content text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access org uploads"
  ON uploads FOR ALL
  USING (org_id IN (SELECT user_org_ids()));

CREATE INDEX idx_uploads_org ON uploads(org_id);
CREATE INDEX idx_uploads_dept ON uploads(department_slug);
