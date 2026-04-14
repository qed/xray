import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  getOrgBySlug, getUserRole, getDepartments,
  getUserDepartments,
} from '@/lib/db';
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

  const [memberDepts, allDepts] = await Promise.all([
    getUserDepartments(user.id, org.id),
    getDepartments(org.id),
  ]);

  const joinedIds = new Set(memberDepts.map((md) => md.department_id));

  return (
    <DepartmentManager
      orgId={org.id}
      orgSlug={orgSlug}
      role={role}
      allDepartments={allDepts.map((d) => ({ id: d.id, name: d.name, joined: joinedIds.has(d.id) }))}
    />
  );
}
