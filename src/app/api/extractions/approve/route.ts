import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserRole } from '@/lib/db';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { extractionId, orgId, mode } = await req.json();
  if (!extractionId || !orgId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const role = await getUserRole(orgId, user.id);
  if (role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const admin = createAdminClient();

  // Load extraction
  const { data: extraction, error: fetchError } = await admin
    .from('extractions')
    .select('*, conversation:conversations(*)')
    .eq('id', extractionId)
    .single();

  if (fetchError || !extraction) {
    return NextResponse.json({ error: 'Extraction not found' }, { status: 404 });
  }

  const data = extraction.extracted_data;

  try {
    if (mode === 'intake' && data.profile) {
      // Create or update department from intake extraction
      const profile = data.profile;

      // Check if department exists
      const slug = profile.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      let { data: dept } = await admin
        .from('departments')
        .select('*')
        .eq('org_id', orgId)
        .eq('slug', slug)
        .single();

      if (!dept) {
        const { data: newDept, error: deptError } = await admin
          .from('departments')
          .insert({
            org_id: orgId,
            slug,
            name: profile.name,
            mission: profile.mission || '',
            scope: profile.scope || '',
            tools: profile.tools || [],
            single_points_of_failure: profile.singlePointsOfFailure || [],
            pain_points: profile.painPoints || [],
            tribal_knowledge_risks: profile.tribalKnowledgeRisks || [],
          })
          .select()
          .single();

        if (deptError) throw deptError;
        dept = newDept;
      } else {
        await admin
          .from('departments')
          .update({
            name: profile.name,
            mission: profile.mission || dept.mission,
            scope: profile.scope || dept.scope,
            tools: profile.tools?.length ? profile.tools : dept.tools,
            single_points_of_failure: profile.singlePointsOfFailure?.length ? profile.singlePointsOfFailure : dept.single_points_of_failure,
            pain_points: profile.painPoints?.length ? profile.painPoints : dept.pain_points,
            tribal_knowledge_risks: profile.tribalKnowledgeRisks?.length ? profile.tribalKnowledgeRisks : dept.tribal_knowledge_risks,
          })
          .eq('id', dept.id);
      }

      // Upsert team members
      if (profile.teamMembers?.length) {
        await admin.from('team_members').delete().eq('department_id', dept.id);
        await admin.from('team_members').insert(
          profile.teamMembers.map((tm: { name: string; title: string; responsibilities: string }) => ({
            department_id: dept!.id,
            name: tm.name,
            title: tm.title,
            responsibilities: tm.responsibilities,
          }))
        );
      }

      // Insert priorities
      if (data.priorities?.length) {
        const { data: insertedPriorities } = await admin
          .from('priorities')
          .insert(
            data.priorities.map((p: {
              rank: number; name: string; effort: string; complexity: string;
              whatToAutomate: string; currentState: string; whyItMatters: string;
              estimatedTimeSavings: string; suggestedApproach: string; successCriteria: string;
              dependencies: string[];
            }) => ({
              department_id: dept!.id,
              rank: p.rank,
              name: p.name,
              effort: p.effort || '',
              complexity: p.complexity || '',
              what_to_automate: p.whatToAutomate || '',
              current_state: p.currentState || '',
              why_it_matters: p.whyItMatters || '',
              estimated_time_savings: p.estimatedTimeSavings || '',
              suggested_approach: p.suggestedApproach || '',
              success_criteria: p.successCriteria || '',
              dependencies: p.dependencies || [],
              status: 'Not started',
            }))
          )
          .select();

        // Create milestone entries
        if (insertedPriorities) {
          await admin.from('milestones').insert(
            insertedPriorities.map((p: { id: string }) => ({
              priority_id: p.id,
              stage: 0,
            }))
          );
        }
      }

      // Link conversation to department
      await admin
        .from('conversations')
        .update({ department_id: dept.id })
        .eq('id', extraction.conversation_id);

    } else if (mode === 'gap-fill' && data.fields) {
      // Update existing priority with filled fields
      const priorityId = data.priorityId;
      if (!priorityId) throw new Error('No priorityId in extraction');

      const updates: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data.fields)) {
        if (value) updates[key] = value;
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await admin
          .from('priorities')
          .update(updates)
          .eq('id', priorityId);

        if (updateError) throw updateError;
      }
    }

    // Mark extraction as approved
    await admin
      .from('extractions')
      .update({ status: 'approved', reviewed_by: user.id })
      .eq('id', extractionId);

    // Mark conversation as approved
    await admin
      .from('conversations')
      .update({ status: 'approved' })
      .eq('id', extraction.conversation_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
