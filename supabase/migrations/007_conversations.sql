-- Conversations table for AI intake and gap-filling sessions
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  mode text NOT NULL CHECK (mode IN ('intake', 'gap-fill')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'extracted', 'approved')),
  context jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages within a conversation
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Extracted data awaiting approval
CREATE TABLE extractions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  extracted_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_conversations_org ON conversations(org_id);
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_extractions_conversation ON extractions(conversation_id);

-- RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE extractions ENABLE ROW LEVEL SECURITY;

-- Users can see their own conversations
CREATE POLICY "Users see own conversations"
  ON conversations FOR SELECT
  USING (user_id = auth.uid());

-- Org owners/admins can see all conversations in their org
CREATE POLICY "Org admins see all conversations"
  ON conversations FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM org_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Users can create conversations in their org
CREATE POLICY "Users create conversations"
  ON conversations FOR INSERT
  WITH CHECK (org_id IN (
    SELECT org_id FROM org_members
    WHERE user_id = auth.uid()
  ));

-- Users can update their own conversations
CREATE POLICY "Users update own conversations"
  ON conversations FOR UPDATE
  USING (user_id = auth.uid());

-- Messages: users see messages in their conversations
CREATE POLICY "Users see own messages"
  ON messages FOR SELECT
  USING (conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  ));

-- Org admins see all messages in their org's conversations
CREATE POLICY "Org admins see all messages"
  ON messages FOR SELECT
  USING (conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN org_members om ON om.org_id = c.org_id
    WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
  ));

-- Users insert messages in their conversations
CREATE POLICY "Users insert messages"
  ON messages FOR INSERT
  WITH CHECK (conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  ));

-- Extractions: org admins can see and update
CREATE POLICY "Org admins see extractions"
  ON extractions FOR SELECT
  USING (conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN org_members om ON om.org_id = c.org_id
    WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
  ));

CREATE POLICY "Org admins update extractions"
  ON extractions FOR UPDATE
  USING (conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN org_members om ON om.org_id = c.org_id
    WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
  ));

-- Service role inserts extractions (from API route)
CREATE POLICY "Service inserts extractions"
  ON extractions FOR INSERT
  WITH CHECK (true);
