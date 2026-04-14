-- Migration 018: Fix time_allocation in the CORRECT apply_extraction overload
--
-- Migration 017 replaced the old 3-param overload (p_conversation_id, p_extraction, p_mode)
-- but the app uses the 4-param overload (p_org_id, p_extracted_data, p_conversation_id, p_mode)
-- from migration 014, which still references the non-existent time_allocation column.
--
-- This migration:
-- 1. Replaces the 4-param overload with time_allocation removed
-- 2. Drops the old 3-param overload (no longer used)

-- ============================================================
-- 1. Drop the old 3-param overload (unused, replaced by 4-param in migration 014)
-- ============================================================
DROP FUNCTION IF EXISTS apply_extraction(uuid, jsonb, text);

-- ============================================================
-- 2. Replace the 4-param overload with time_allocation removed
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
SET search_path = public
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
  v_priority_slug text;
  v_slug_base text;
  v_slug_candidate text;
  v_slug_counter int;
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
          v_max_rank,
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
        FOR i IN 0..jsonb_array_length(v_priorities) - 1 LOOP
          v_p := v_priorities->i;

          -- Try to find existing priority by name in this department
          SELECT * INTO v_existing_priority
          FROM priorities
          WHERE department_id = v_dept_id AND lower(name) = lower(v_p->>'name')
          LIMIT 1;

          IF v_existing_priority.id IS NOT NULL THEN
            -- UPDATE existing priority (preserves id, milestone/brief FK links)
            -- Set status to 'proposed' on overwrite so leads can re-approve
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
              status = 'proposed',
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

            -- INSERT new priority
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
              (v_p->>'rank')::int,
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
          END IF;
        END LOOP;

        -- Delete priorities that were removed in the overwrite
        -- (exist in DB but not in extracted data)
        DELETE FROM priorities
        WHERE department_id = v_dept_id
        AND lower(name) NOT IN (
          SELECT lower(jsonb_array_elements(v_priorities)->>'name')
        );
      END IF;

    ELSE
      -- New department
      INSERT INTO departments (
        org_id, name, slug, mission, scope,
        tools, single_points_of_failure, pain_points, tribal_knowledge_risks
      ) VALUES (
        p_org_id,
        v_profile->>'name',
        v_dept_slug,
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
    END IF;

    -- Handle team members
    IF v_profile->'teamMembers' IS NOT NULL AND jsonb_array_length(v_profile->'teamMembers') > 0 THEN
      -- Remove existing team members (overwrite scenario)
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
