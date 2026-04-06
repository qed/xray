import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getOrgBySlug, getUserRole, getDepartmentBySlug, getPriorities, getTeamMembers, getTopWins } from '@/lib/db';
import { MILESTONE_STAGES } from '@/lib/constants';
import TeamView from './TeamView';

export default async function TeamPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  // Find this user's department from their approved intake conversation
  const admin = createAdminClient();
  const { data: convo } = await admin
    .from('conversations')
    .select('department_id')
    .eq('org_id', org.id)
    .eq('user_id', user.id)
    .eq('mode', 'intake')
    .eq('status', 'approved')
    .not('department_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!convo?.department_id) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Team</h1>
          <p className="text-slate-500 mt-1">Your department view will appear here once your intake is approved.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-sm">No department linked to your account yet.</p>
          <p className="text-slate-400 text-sm mt-2">Complete your intake conversation and wait for approval to see your team dashboard.</p>
        </div>
      </div>
    );
  }

  // Load department data
  const dept = await admin
    .from('departments')
    .select('*')
    .eq('id', convo.department_id)
    .single();

  if (!dept.data) notFound();

  const [dbPriorities, teamMembers, allOpps] = await Promise.all([
    getPriorities(dept.data.id),
    getTeamMembers(dept.data.id),
    getTopWins(org.id, 100),
  ]);

  const deptOpps = allOpps.filter((opp) => opp.departmentSlug === dept.data.slug);

  // Calculate readiness
  const total = dbPriorities.length;
  const completed = dbPriorities.filter((p) => p.milestone_stage >= 3).length;
  const inProgress = dbPriorities.filter((p) => p.milestone_stage > 0 && p.milestone_stage < 3).length;
  const progressPercent = total > 0 ? Math.round(((completed * 1.0 + inProgress * 0.5) / total) * 100) : 0;

  return (
    <TeamView
      department={dept.data}
      priorities={deptOpps}
      teamMembers={teamMembers}
      stats={{
        total,
        completed,
        inProgress,
        notStarted: total - completed - inProgress,
        progressPercent,
      }}
    />
  );
}
