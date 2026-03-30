import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parsePriorities, parseProfile } from '@/lib/parse-markdown';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const fileType = formData.get('fileType') as string;
  const slug = formData.get('slug') as string;
  const orgId = formData.get('orgId') as string;
  const newDepartmentName = formData.get('newDepartmentName') as string | null;

  if (!file || !file.name.endsWith('.md')) {
    return NextResponse.json({ error: 'File must be .md format' }, { status: 400 });
  }

  const text = await file.text();
  if (!text.trim()) {
    return NextResponse.json({ error: 'File is empty' }, { status: 400 });
  }

  let departmentSlug = slug;
  let departmentName = '';

  if (slug === '__new__' && newDepartmentName) {
    departmentSlug = newDepartmentName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    departmentName = newDepartmentName;
  }

  // Ensure department exists
  let { data: dept } = await supabase
    .from('departments')
    .select('*')
    .eq('org_id', orgId)
    .eq('slug', departmentSlug)
    .single();

  if (!dept) {
    const { data: newDept, error } = await supabase
      .from('departments')
      .insert({ org_id: orgId, slug: departmentSlug, name: departmentName || departmentSlug })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    dept = newDept;
  }

  try {
    if (fileType === 'profile') {
      const profile = parseProfile(text);
      await supabase
        .from('departments')
        .update({
          name: profile.name || dept.name,
          mission: profile.mission,
          scope: profile.scope,
          tools: profile.tools,
          single_points_of_failure: profile.singlePointsOfFailure,
          pain_points: profile.painPoints,
          tribal_knowledge_risks: profile.tribalKnowledgeRisks,
        })
        .eq('id', dept.id);

      // Upsert team members
      await supabase.from('team_members').delete().eq('department_id', dept.id);
      if (profile.teamMembers.length > 0) {
        await supabase.from('team_members').insert(
          profile.teamMembers.map((tm) => ({
            department_id: dept!.id,
            name: tm.name,
            title: tm.title,
            responsibilities: tm.responsibilities,
          }))
        );
      }
    } else {
      const priorities = parsePriorities(text);

      // Delete existing priorities for this department
      await supabase.from('priorities').delete().eq('department_id', dept.id);

      // Insert new priorities
      if (priorities.length > 0) {
        const { data: insertedPriorities } = await supabase
          .from('priorities')
          .insert(
            priorities.map((p) => ({
              department_id: dept!.id,
              rank: p.rank,
              name: p.name,
              effort: p.effort,
              complexity: p.complexity,
              what_to_automate: p.whatToAutomate,
              current_state: p.currentState,
              why_it_matters: p.whyItMatters,
              estimated_time_savings: p.estimatedTimeSavings,
              suggested_approach: p.suggestedApproach,
              success_criteria: p.successCriteria,
              dependencies: p.dependencies,
              status: p.status,
            }))
          )
          .select();

        // Create milestone entries for each priority
        if (insertedPriorities) {
          await supabase.from('milestones').insert(
            insertedPriorities.map((p) => ({
              priority_id: p.id,
              stage: 0,
            }))
          );
        }
      }
    }

    return NextResponse.json({ slug: departmentSlug });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
