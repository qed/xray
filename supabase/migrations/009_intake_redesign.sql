-- Migration 009: Intake redesign
-- Adds Phase 8 fields, value dimensions, archived_data, message_attachments,
-- updates CHECK constraints, and creates the apply_extraction() Postgres function.

-- ============================================================
-- 1. ALTER conversations CHECK constraints
-- ============================================================

-- Add 'new-priorities' to mode CHECK
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_mode_check;
ALTER TABLE conversations ADD CONSTRAINT conversations_mode_check
  CHECK (mode IN ('intake', 'gap-fill', 'new-priorities'));

-- Add 'completed' to status CHECK
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_status_check;
ALTER TABLE conversations ADD CONSTRAINT conversations_status_check
  CHECK (status IN ('active', 'extracted', 'approved', 'completed'));

-- ============================================================
-- 2. ADD Phase 8 + value dimension columns to priorities
-- ============================================================

ALTER TABLE priorities ADD COLUMN IF NOT EXISTS frequency text DEFAULT '';
ALTER TABLE priorities ADD COLUMN IF NOT EXISTS hands_on_time text DEFAULT '';
ALTER TABLE priorities ADD COLUMN IF NOT EXISTS waiting_overhead text DEFAULT '';
ALTER TABLE priorities ADD COLUMN IF NOT EXISTS hidden_costs text DEFAULT '';
ALTER TABLE priorities ADD COLUMN IF NOT EXISTS automation_percentage text DEFAULT '';
ALTER TABLE priorities ADD COLUMN IF NOT EXISTS employees_affected text DEFAULT '';
ALTER TABLE priorities ADD COLUMN IF NOT EXISTS revenue_opportunity text DEFAULT '';
ALTER TABLE priorities ADD COLUMN IF NOT EXISTS growth_potential text DEFAULT '';

-- ============================================================
-- 3. ADD archived_data JSONB to departments
-- ============================================================

ALTER TABLE departments ADD COLUMN IF NOT EXISTS archived_data jsonb;

-- ============================================================
-- 4. CREATE message_attachments table
-- ============================================================

CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_message_attachments_message
  ON message_attachments(message_id);

-- RLS
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Users can see attachments for messages in their conversations
CREATE POLICY "Users see own attachments"
  ON message_attachments FOR SELECT
  USING (message_id IN (
    SELECT m.id FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE c.user_id = auth.uid()
  ));

-- Org admins see all attachments in their org's conversations
CREATE POLICY "Org admins see all attachments"
  ON message_attachments FOR SELECT
  USING (message_id IN (
    SELECT m.id FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    JOIN org_members om ON om.org_id = c.org_id
    WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
  ));

-- Service role inserts attachments (from API route)
CREATE POLICY "Service inserts attachments"
  ON message_attachments FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 5. CREATE apply_extraction() Postgres function
-- ============================================================

CREATE OR REPLACE FUNCTION apply_extraction(
  p_org_id uuid,
  p_extracted_data jsonb,
  p_conversation_id uuid,
  p_mode text  -- 'create' | 'overwrite' | 'append'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile jsonb;
  v_priorities jsonb;
  v_dept_id uuid;
  v_dept_slug text;
  v_dept record;
  v_tm jsonb;
  v_p jsonb;
  v_inserted_priority_id uuid;
  v_existing_priority record;
  v_max_rank int;
  v_result jsonb := '{}';
BEGIN
  v_profile := p_extracted_data->'profile';
  v_priorities := p_extracted_data->'priorities';

  -- --------------------------------------------------------
  -- MODE: append — just add new priorities to existing dept
  -- --------------------------------------------------------
  IF p_mode = 'append' THEN
    -- Get department_id from the conversation
    SELECT department_id INTO v_dept_id
    FROM conversations
    WHERE id = p_conversation_id;

    IF v_dept_id IS NULL THEN
      RAISE EXCEPTION 'No department linked to conversation for append mode';
    END IF;

    -- Get current max rank
    SELECT COALESCE(MAX(rank), 0) INTO v_max_rank
    FROM priorities
    WHERE department_id = v_dept_id;

    -- Insert new priorities
    IF v_priorities IS NOT NULL AND jsonb_array_length(v_priorities) > 0 THEN
      FOR i IN 0..jsonb_array_length(v_priorities) - 1 LOOP
        v_p := v_priorities->i;
        v_max_rank := v_max_rank + 1;

        INSERT INTO priorities (
          department_id, rank, name, effort, complexity,
          what_to_automate, current_state, why_it_matters,
          estimated_time_savings, suggested_approach, success_criteria,
          dependencies, status,
          frequency, hands_on_time, waiting_overhead, hidden_costs,
          automation_percentage, employees_affected,
          revenue_opportunity, growth_potential
        ) VALUES (
          v_dept_id,
          v_max_rank,
          v_p->>'name',
          COALESCE(v_p->>'effort', ''),
          COALESCE(v_p->>'complexity', ''),
          COALESCE(v_p->>'whatToAutomate', ''),
          COALESCE(v_p->>'currentState', ''),
          COALESCE(v_p->>'whyItMatters', ''),
          COALESCE(v_p->>'estimatedTimeSavings', ''),
          COALESCE(v_p->>'suggestedApproach', ''),
          COALESCE(v_p->>'successCriteria', ''),
          COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(v_p->'dependencies')),
            '{}'
          ),
          'Not started',
          COALESCE(v_p->>'frequency', ''),
          COALESCE(v_p->>'handsOnTime', ''),
          COALESCE(v_p->>'waitingOverhead', ''),
          COALESCE(v_p->>'hiddenCosts', ''),
          COALESCE(v_p->>'automationPercentage', ''),
          COALESCE(v_p->>'employeesAffected', ''),
          COALESCE(v_p->>'revenueOpportunity', ''),
          COALESCE(v_p->>'growthPotential', '')
        )
        RETURNING id INTO v_inserted_priority_id;

        -- Create milestone at stage 0
        INSERT INTO milestones (priority_id, stage)
        VALUES (v_inserted_priority_id, 0);
      END LOOP;
    END IF;

    v_result := jsonb_build_object('department_id', v_dept_id, 'mode', 'append');

  -- --------------------------------------------------------
  -- MODE: create or overwrite — full department + priorities
  -- --------------------------------------------------------
  ELSE
    IF v_profile IS NULL THEN
      RAISE EXCEPTION 'Profile required for create/overwrite mode';
    END IF;

    -- Build slug from department name
    v_dept_slug := lower(regexp_replace(
      regexp_replace(
        regexp_replace(v_profile->>'name', '[^a-z0-9\s-]', '', 'gi'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    ));
    v_dept_slug := trim(BOTH '-' FROM v_dept_slug);

    -- Check if department exists
    SELECT * INTO v_dept
    FROM departments
    WHERE org_id = p_org_id AND slug = v_dept_slug;

    IF v_dept.id IS NOT NULL AND p_mode = 'create' THEN
      -- Department exists but mode is 'create' — treat as new, slug already taken
      -- Caller should have used 'overwrite' or provided a different name
      RAISE EXCEPTION 'Department with slug "%" already exists. Use overwrite mode or a different name.', v_dept_slug;
    END IF;

    IF v_dept.id IS NOT NULL AND p_mode = 'overwrite' THEN
      v_dept_id := v_dept.id;

      -- Archive existing department data before overwriting
      UPDATE departments SET archived_data = jsonb_build_object(
        'archived_at', now(),
        'name', v_dept.name,
        'mission', v_dept.mission,
        'scope', v_dept.scope,
        'tools', v_dept.tools,
        'single_points_of_failure', v_dept.single_points_of_failure,
        'pain_points', v_dept.pain_points,
        'tribal_knowledge_risks', v_dept.tribal_knowledge_risks
      ) WHERE id = v_dept_id;

      -- Update department fields
      UPDATE departments SET
        name = COALESCE(v_profile->>'name', v_dept.name),
        mission = COALESCE(v_profile->>'mission', v_dept.mission),
        scope = COALESCE(v_profile->>'scope', v_dept.scope),
        tools = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'tools')),
          v_dept.tools
        ),
        single_points_of_failure = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'singlePointsOfFailure')),
          v_dept.single_points_of_failure
        ),
        pain_points = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'painPoints')),
          v_dept.pain_points
        ),
        tribal_knowledge_risks = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'tribalKnowledgeRisks')),
          v_dept.tribal_knowledge_risks
        )
      WHERE id = v_dept_id;

      -- Match-and-update priorities: update existing by name, insert new, delete removed
      IF v_priorities IS NOT NULL AND jsonb_array_length(v_priorities) > 0 THEN
        -- Update or insert each extracted priority
        FOR i IN 0..jsonb_array_length(v_priorities) - 1 LOOP
          v_p := v_priorities->i;

          -- Try to find existing priority by name in this department
          SELECT * INTO v_existing_priority
          FROM priorities
          WHERE department_id = v_dept_id AND lower(name) = lower(v_p->>'name')
          LIMIT 1;

          IF v_existing_priority.id IS NOT NULL THEN
            -- UPDATE existing priority (preserves id, milestone/brief FK links)
            UPDATE priorities SET
              rank = (v_p->>'rank')::int,
              name = v_p->>'name',
              effort = COALESCE(v_p->>'effort', ''),
              complexity = COALESCE(v_p->>'complexity', ''),
              what_to_automate = COALESCE(v_p->>'whatToAutomate', ''),
              current_state = COALESCE(v_p->>'currentState', ''),
              why_it_matters = COALESCE(v_p->>'whyItMatters', ''),
              estimated_time_savings = COALESCE(v_p->>'estimatedTimeSavings', ''),
              suggested_approach = COALESCE(v_p->>'suggestedApproach', ''),
              success_criteria = COALESCE(v_p->>'successCriteria', ''),
              dependencies = COALESCE(
                ARRAY(SELECT jsonb_array_elements_text(v_p->'dependencies')),
                '{}'
              ),
              frequency = COALESCE(v_p->>'frequency', ''),
              hands_on_time = COALESCE(v_p->>'handsOnTime', ''),
              waiting_overhead = COALESCE(v_p->>'waitingOverhead', ''),
              hidden_costs = COALESCE(v_p->>'hiddenCosts', ''),
              automation_percentage = COALESCE(v_p->>'automationPercentage', ''),
              employees_affected = COALESCE(v_p->>'employeesAffected', ''),
              revenue_opportunity = COALESCE(v_p->>'revenueOpportunity', ''),
              growth_potential = COALESCE(v_p->>'growthPotential', '')
            WHERE id = v_existing_priority.id;
          ELSE
            -- INSERT new priority
            INSERT INTO priorities (
              department_id, rank, name, effort, complexity,
              what_to_automate, current_state, why_it_matters,
              estimated_time_savings, suggested_approach, success_criteria,
              dependencies, status,
              frequency, hands_on_time, waiting_overhead, hidden_costs,
              automation_percentage, employees_affected,
              revenue_opportunity, growth_potential
            ) VALUES (
              v_dept_id,
              (v_p->>'rank')::int,
              v_p->>'name',
              COALESCE(v_p->>'effort', ''),
              COALESCE(v_p->>'complexity', ''),
              COALESCE(v_p->>'whatToAutomate', ''),
              COALESCE(v_p->>'currentState', ''),
              COALESCE(v_p->>'whyItMatters', ''),
              COALESCE(v_p->>'estimatedTimeSavings', ''),
              COALESCE(v_p->>'suggestedApproach', ''),
              COALESCE(v_p->>'successCriteria', ''),
              COALESCE(
                ARRAY(SELECT jsonb_array_elements_text(v_p->'dependencies')),
                '{}'
              ),
              'Not started',
              COALESCE(v_p->>'frequency', ''),
              COALESCE(v_p->>'handsOnTime', ''),
              COALESCE(v_p->>'waitingOverhead', ''),
              COALESCE(v_p->>'hiddenCosts', ''),
              COALESCE(v_p->>'automationPercentage', ''),
              COALESCE(v_p->>'employeesAffected', ''),
              COALESCE(v_p->>'revenueOpportunity', ''),
              COALESCE(v_p->>'growthPotential', '')
            )
            RETURNING id INTO v_inserted_priority_id;

            -- Create milestone for new priority
            INSERT INTO milestones (priority_id, stage)
            VALUES (v_inserted_priority_id, 0);
          END IF;
        END LOOP;

        -- Delete priorities that no longer appear in extraction
        DELETE FROM priorities
        WHERE department_id = v_dept_id
          AND lower(name) NOT IN (
            SELECT lower(elem->>'name')
            FROM jsonb_array_elements(v_priorities) AS elem
          );
      END IF;

    ELSE
      -- Create new department
      INSERT INTO departments (
        org_id, slug, name, mission, scope,
        tools, single_points_of_failure, pain_points, tribal_knowledge_risks
      ) VALUES (
        p_org_id,
        v_dept_slug,
        v_profile->>'name',
        COALESCE(v_profile->>'mission', ''),
        COALESCE(v_profile->>'scope', ''),
        COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'tools')),
          '{}'
        ),
        COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'singlePointsOfFailure')),
          '{}'
        ),
        COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'painPoints')),
          '{}'
        ),
        COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'tribalKnowledgeRisks')),
          '{}'
        )
      )
      RETURNING id INTO v_dept_id;

      -- Insert priorities for new department
      IF v_priorities IS NOT NULL AND jsonb_array_length(v_priorities) > 0 THEN
        FOR i IN 0..jsonb_array_length(v_priorities) - 1 LOOP
          v_p := v_priorities->i;

          INSERT INTO priorities (
            department_id, rank, name, effort, complexity,
            what_to_automate, current_state, why_it_matters,
            estimated_time_savings, suggested_approach, success_criteria,
            dependencies, status,
            frequency, hands_on_time, waiting_overhead, hidden_costs,
            automation_percentage, employees_affected,
            revenue_opportunity, growth_potential
          ) VALUES (
            v_dept_id,
            (v_p->>'rank')::int,
            v_p->>'name',
            COALESCE(v_p->>'effort', ''),
            COALESCE(v_p->>'complexity', ''),
            COALESCE(v_p->>'whatToAutomate', ''),
            COALESCE(v_p->>'currentState', ''),
            COALESCE(v_p->>'whyItMatters', ''),
            COALESCE(v_p->>'estimatedTimeSavings', ''),
            COALESCE(v_p->>'suggestedApproach', ''),
            COALESCE(v_p->>'successCriteria', ''),
            COALESCE(
              ARRAY(SELECT jsonb_array_elements_text(v_p->'dependencies')),
              '{}'
            ),
            'Not started',
            COALESCE(v_p->>'frequency', ''),
            COALESCE(v_p->>'handsOnTime', ''),
            COALESCE(v_p->>'waitingOverhead', ''),
            COALESCE(v_p->>'hiddenCosts', ''),
            COALESCE(v_p->>'automationPercentage', ''),
            COALESCE(v_p->>'employeesAffected', ''),
            COALESCE(v_p->>'revenueOpportunity', ''),
            COALESCE(v_p->>'growthPotential', '')
          )
          RETURNING id INTO v_inserted_priority_id;

          INSERT INTO milestones (priority_id, stage)
          VALUES (v_inserted_priority_id, 0);
        END LOOP;
      END IF;
    END IF;

    -- Upsert team members (delete + insert for both create and overwrite)
    IF v_profile->'teamMembers' IS NOT NULL
       AND jsonb_array_length(v_profile->'teamMembers') > 0 THEN
      DELETE FROM team_members WHERE department_id = v_dept_id;
      FOR i IN 0..jsonb_array_length(v_profile->'teamMembers') - 1 LOOP
        v_tm := (v_profile->'teamMembers')->i;
        INSERT INTO team_members (department_id, name, title, responsibilities)
        VALUES (
          v_dept_id,
          v_tm->>'name',
          COALESCE(v_tm->>'title', ''),
          COALESCE(v_tm->>'responsibilities', '')
        );
      END LOOP;
    END IF;

    -- Link conversation to department
    UPDATE conversations
    SET department_id = v_dept_id
    WHERE id = p_conversation_id;

    -- Create project brief snapshot
    IF v_profile IS NOT NULL THEN
      INSERT INTO project_briefs (
        org_id, department_id, title, summary,
        profile_snapshot, priorities_snapshot,
        team_count, total_potential_hours_per_week
      ) VALUES (
        p_org_id,
        v_dept_id,
        (v_profile->>'name') || ' — AI Readiness Assessment',
        COALESCE(v_profile->>'mission', ''),
        v_profile,
        COALESCE(v_priorities, '[]'::jsonb),
        COALESCE(jsonb_array_length(v_profile->'teamMembers'), 0),
        0
      );
    END IF;

    v_result := jsonb_build_object('department_id', v_dept_id, 'mode', p_mode);
  END IF;

  -- Update conversation status
  UPDATE conversations
  SET status = 'completed', updated_at = now()
  WHERE id = p_conversation_id;

  RETURN v_result;
END;
$$;
