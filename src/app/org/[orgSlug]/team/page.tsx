import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  getOrgBySlug, getUserRole, getDepartments,
  getPriorities, getTeamMembers, getTopWins,
  getUserDepartments,
} from '@/lib/db';
import TeamView from './TeamView';
import DepartmentPicker from './DepartmentPicker';

export default async function TeamPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  // Get user's linked departments
  const memberDepts = await getUserDepartments(user.id, org.id);

  // Owner/admin with no explicit links can see everything — but we still
  // show the department picker for them to choose which department to view
  if (memberDepts.length === 0) {
    // Fetch all departments for the picker (admins/owners can see all, members see what RLS allows)
    const allDepts = await getDepartments(org.id);

    return (
      <DepartmentPicker
        orgId={org.id}
        orgSlug={orgSlug}
        departments={allDepts.map((d) => ({ id: d.id, name: d.name }))}
        role={role}
      />
    );
  }

  // Load data for all linked departments
  const linkedDeptIds = memberDepts.map((md) => md.department_id);
  const allDepts = await getDepartments(org.id);
  const linkedDepts = allDepts.filter((d) => linkedDeptIds.includes(d.id));

  if (linkedDepts.length === 0) notFound();

  // Load priorities and team members for all linked departments in parallel
  const deptData = await Promise.all(
    linkedDepts.map(async (dept) => {
      const [priorities, teamMembers] = await Promise.all([
        getPriorities(dept.id),
        getTeamMembers(dept.id),
      ]);
      const proposedCount = priorities.filter((p) => p.status === 'proposed').length;
      const completedCount = priorities.filter((p) => p.status === 'complete').length;
      const inProgressCount = priorities.filter((p) => p.status === 'in_progress').length;
      const notStartedCount = priorities.filter(
        (p) => p.status === 'not_started' || p.status === 'approved'
      ).length;
      const activeTotal = completedCount + inProgressCount + notStartedCount;

      return {
        department: dept,
        priorities,
        teamMembers,
        stats: {
          total: priorities.length,
          completed: completedCount,
          inProgress: inProgressCount,
          notStarted: notStartedCount,
          proposed: proposedCount,
          progressPercent: activeTotal > 0 ? Math.round((completedCount / activeTotal) * 100) : 0,
        },
      };
    })
  );

  return (
    <TeamView
      departments={deptData}
      orgSlug={orgSlug}
      role={role}
    />
  );
}
