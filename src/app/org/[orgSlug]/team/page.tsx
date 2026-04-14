import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  getOrgBySlug, getUserRole, getDepartments, getCompanyOverview,
  getUserDepartments,
} from '@/lib/db';
import { getColorPalette } from '@/lib/constants';
import DepartmentManager from './DepartmentManager';

export default async function TeamPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  const [memberDepts, departments, overview] = await Promise.all([
    getUserDepartments(user.id, org.id),
    getDepartments(org.id),
    getCompanyOverview(org.id),
  ]);

  const joinedIds = new Set(memberDepts.map((md) => md.department_id));

  // Build sidebar items with the same shape as the company dashboard
  const sidebarItems = overview.departments.map((dept) => {
    const dbDept = departments.find((d) => d.slug === dept.slug);
    return {
      slug: dept.slug,
      name: dept.name,
      priorityCount: dept.totalPriorities,
      activeCount: dept.inProgress,
      palette: getColorPalette(dbDept?.color_index ?? null),
    };
  });

  // Build department list with join status and palette
  const deptList = departments.map((d) => {
    const summary = overview.departments.find((s) => s.slug === d.slug);
    return {
      id: d.id,
      slug: d.slug,
      name: d.name,
      joined: joinedIds.has(d.id),
      totalPriorities: summary?.totalPriorities ?? 0,
      completed: summary?.completed ?? 0,
      inProgress: summary?.inProgress ?? 0,
      progressPercent: summary?.progressPercent ?? 0,
      palette: getColorPalette(d.color_index ?? null),
    };
  });

  return (
    <DepartmentManager
      orgId={org.id}
      orgSlug={orgSlug}
      orgName={org.name}
      role={role}
      sidebarItems={sidebarItems}
      departments={deptList}
    />
  );
}
