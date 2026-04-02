import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getDepartments, getUnfiledRankedOpportunities } from '@/lib/db';
import { createAdminClient } from '@/lib/supabase/admin';
import GapFillChat from './GapFillChat';

export default async function GapFillChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgSlug: string }>;
  searchParams: Promise<{ dept?: string; priority?: string }>;
}) {
  const { orgSlug } = await params;
  const { dept: deptSlug, priority: priorityId } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const role = await getUserRole(org.id, user.id);
  if (!role || role === 'member') redirect(`/org/${orgSlug}/intake`);

  const [departments, unfiled] = await Promise.all([
    getDepartments(org.id),
    getUnfiledRankedOpportunities(org.id),
  ]);

  // Filter to specific department if provided
  const targetPriorities = deptSlug
    ? unfiled.filter((p) => p.departmentSlug === deptSlug)
    : unfiled;

  // If a specific priority is requested, focus on that
  const targetPriority = priorityId
    ? targetPriorities.find((p) => p.id === priorityId)
    : targetPriorities[0];

  if (!targetPriority) {
    redirect(`/org/${orgSlug}/unfiled`);
  }

  const dept = departments.find((d) => d.slug === targetPriority.departmentSlug);

  // Check for existing conversation for this priority
  const admin = createAdminClient();
  const { data: existingConvo } = await admin
    .from('conversations')
    .select('id, status')
    .eq('org_id', org.id)
    .eq('user_id', user.id)
    .eq('mode', 'gap-fill')
    .contains('context', { priorityId: targetPriority.id })
    .in('status', ['active'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let existingMessages: { role: 'user' | 'assistant'; content: string }[] = [];
  if (existingConvo) {
    const { data: msgs } = await admin
      .from('messages')
      .select('role, content')
      .eq('conversation_id', existingConvo.id)
      .order('created_at', { ascending: true });
    existingMessages = (msgs || []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
  }

  // Build context for the gap-fill conversation
  const missingFields = targetPriority.completeness.missing;
  const existingData: Record<string, string> = {};
  const fieldMap: Record<string, string> = {
    whatToAutomate: 'what_to_automate',
    currentState: 'current_state',
    whyItMatters: 'why_it_matters',
    estimatedTimeSavings: 'estimated_time_savings',
    suggestedApproach: 'suggested_approach',
    successCriteria: 'success_criteria',
  };

  for (const [propName, dbName] of Object.entries(fieldMap)) {
    const val = targetPriority[propName as keyof typeof targetPriority];
    if (val && typeof val === 'string' && val.trim()) {
      existingData[dbName] = val;
    }
  }
  if (targetPriority.complexity) existingData.complexity = targetPriority.complexity;
  if (targetPriority.effort) existingData.effort = targetPriority.effort;
  if (targetPriority.dependencies?.length) existingData.dependencies = targetPriority.dependencies.join(', ');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <a
          href={`/org/${orgSlug}/unfiled`}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          &larr; Back to Missing Gaps
        </a>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-3 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-900">{targetPriority.name}</h2>
          <p className="text-xs text-slate-500">
            {dept?.name || targetPriority.departmentSlug} &middot; {missingFields.length} missing field{missingFields.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="h-[calc(100vh-16rem)]">
          <GapFillChat
            orgId={org.id}
            departmentName={dept?.name || targetPriority.departmentSlug}
            priorityName={targetPriority.name}
            priorityId={targetPriority.id}
            existingData={existingData}
            missingFields={missingFields}
            existingConversationId={existingConvo?.id}
            existingMessages={existingMessages}
            orgSlug={orgSlug}
          />
        </div>
      </div>
    </div>
  );
}
