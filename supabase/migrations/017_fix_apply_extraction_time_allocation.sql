-- Migration 017: Remove non-existent time_allocation column from apply_extraction RPC
--
-- The team_members table has no time_allocation column, but migration 014
-- added it to the INSERT statement inside apply_extraction().

CREATE OR REPLACE FUNCTION apply_extraction(
  p_conversation_id uuid,
  p_extraction jsonb,
  p_mode text DEFAULT 'overwrite'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id uuid;
  v_dept_slug text;
  v_dept_id uuid;
  v_profile jsonb;
  v_priorities jsonb;
  v_p jsonb;
  v_tm jsonb;
  v_result jsonb;
  v_inserted_priority_id uuid;
  v_slug_base text;
  v_slug_candidate text;
  v_slug_counter int;
BEGIN
  -- Get org_id from conversation
  SELECT org_id INTO v_org_id FROM conversations WHERE id = p_conversation_id;
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;

  v_profile := p_extraction->'profile';
  v_priorities := p_extraction->'priorities';

  IF v_profile IS NOT NULL THEN
    v_dept_slug := v_profile->>'slug';

    IF v_dept_slug IS NULL OR v_dept_slug = '' THEN
      RAISE EXCEPTION 'Department slug is required';
    END IF;

    -- Slug generation: lowercase, alphanumeric + hyphens only
    v_dept_slug := lower(regexp_replace(
      regexp_replace(
        regexp_replace(v_dept_slug, '[^a-z0-9\s-]', '', 'gi'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    ));
    v_dept_slug := left(trim(BOTH '-' FROM v_dept_slug), 80);

    -- Check if department exists
    SELECT id INTO v_dept_id FROM departments
      WHERE org_id = v_org_id AND slug = v_dept_slug;

    IF v_dept_id IS NOT NULL AND p_mode = 'overwrite' THEN
      -- Overwrite: update existing department
      UPDATE departments SET
        name = COALESCE(v_profile->>'name', name),
        mission = COALESCE(v_profile->>'mission', ''),
        scope = COALESCE(v_profile->>'scope', ''),
        tools = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'tools')),
          '{}'
        ),
        single_points_of_failure = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'singlePointsOfFailure')),
          '{}'
        ),
        pain_points = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'painPoints')),
          '{}'
        ),
        tribal_knowledge_risks = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'tribalKnowledgeRisks')),
          '{}'
        )
      WHERE id = v_dept_id;

      -- Remove existing priorities for overwrite
      DELETE FROM priorities WHERE department_id = v_dept_id;
    ELSIF v_dept_id IS NULL THEN
      -- Insert new department
      INSERT INTO departments (org_id, slug, name, mission, scope, tools, single_points_of_failure, pain_points, tribal_knowledge_risks)
      VALUES (
        v_org_id,
        v_dept_slug,
        COALESCE(v_profile->>'name', v_dept_slug),
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
    END IF;

    -- Insert priorities
    IF v_priorities IS NOT NULL AND jsonb_array_length(v_priorities) > 0 THEN
      FOR i IN 0..jsonb_array_length(v_priorities) - 1 LOOP
        v_p := v_priorities->i;

        -- Generate slug from name
        v_slug_base := lower(regexp_replace(
          regexp_replace(
            regexp_replace(COALESCE(v_p->>'name', 'priority'), '[^a-z0-9\s-]', '', 'gi'),
            '\s+', '-', 'g'
          ),
          '-+', '-', 'g'
        ));
        v_slug_base := left(trim(BOTH '-' FROM v_slug_base), 80);
        v_slug_candidate := v_slug_base;
        v_slug_counter := 1;
        WHILE EXISTS (SELECT 1 FROM priorities WHERE department_id = v_dept_id AND slug = v_slug_candidate) LOOP
          v_slug_counter := v_slug_counter + 1;
          v_slug_candidate := v_slug_base || '-' || v_slug_counter;
        END LOOP;

        INSERT INTO priorities (
          department_id, rank, name, slug, effort, complexity,
          what_to_automate, current_state, why_it_matters,
          estimated_time_savings, suggested_approach, success_criteria,
          dependencies, status,
          frequency, hands_on_time, waiting_overhead, hidden_costs,
          automation_percentage, employees_affected,
          revenue_opportunity, growth_potential
        ) VALUES (
          v_dept_id,
          COALESCE((v_p->>'rank')::int, i + 1),
          v_p->>'name',
          v_slug_candidate,
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
          'proposed',
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

        -- Phase 1 dual-write: still create milestone for compatibility
        INSERT INTO milestones (priority_id, stage)
        VALUES (v_inserted_priority_id, 0);
      END LOOP;
    END IF;

    -- Handle team members
    IF v_profile->'teamMembers' IS NOT NULL AND jsonb_array_length(v_profile->'teamMembers') > 0 THEN
      IF p_mode = 'overwrite' THEN
        DELETE FROM team_members WHERE department_id = v_dept_id;
      END IF;

      FOR i IN 0..jsonb_array_length(v_profile->'teamMembers') - 1 LOOP
        v_tm := (v_profile->'teamMembers')->i;
        INSERT INTO team_members (department_id, name, title, responsibilities)
        VALUES (
          v_dept_id,
          v_tm->>'name',
          COALESCE(v_tm->>'title', ''),
          COALESCE(v_tm->>'responsibilities', '')
        )
        ON CONFLICT DO NOTHING;
      END LOOP;
    END IF;

    -- Handle handoffs
    IF v_profile->'handoffs' IS NOT NULL THEN
      UPDATE departments SET
        handoffs_inbound = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'handoffs'->'inbound')),
          '{}'
        ),
        handoffs_outbound = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'handoffs'->'outbound')),
          '{}'
        )
      WHERE id = v_dept_id;
    END IF;

    -- Handle scaling concerns
    IF v_profile->'scalingConcerns' IS NOT NULL THEN
      UPDATE departments SET
        scaling_concerns = COALESCE(
          ARRAY(SELECT jsonb_array_elements_text(v_profile->'scalingConcerns')),
          '{}'
        )
      WHERE id = v_dept_id;
    END IF;

    -- Link conversation to department
    UPDATE conversations SET department_id = v_dept_id WHERE id = p_conversation_id;

    v_result := jsonb_build_object('department_id', v_dept_id, 'mode', p_mode);
  END IF;

  RETURN v_result;
END;
$$;
