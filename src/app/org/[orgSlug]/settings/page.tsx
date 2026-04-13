import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getOrgMembers, getOrgInvites, getDepartments } from '@/lib/db';
import MemberList from '@/components/MemberList';
import InviteManager from '@/components/InviteManager';

export default async function SettingsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) redirect('/join');

  const role = await getUserRole(org.id, user.id);
  if (!role || (role !== 'owner' && role !== 'admin')) {
    redirect(`/org/${orgSlug}/dashboard`);
  }

  const [members, invites, departments] = await Promise.all([
    getOrgMembers(org.id),
    getOrgInvites(org.id),
    getDepartments(org.id),
  ]);

  // Build member → department mapping
  const { data: mdRows } = await supabase
    .from('member_departments')
    .select('user_id, department_id, department:departments!inner(org_id)')
    .eq('department.org_id', org.id);
  const memberDepartments: Record<string, string[]> = {};
  for (const row of mdRows ?? []) {
    (memberDepartments[row.user_id] ??= []).push(row.department_id);
  }

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">{org.name}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Members</h2>
        <MemberList
          members={members}
          currentUserId={user.id}
          currentUserRole={role}
          orgId={org.id}
          departments={departments.map((d) => ({ id: d.id, name: d.name }))}
          memberDepartments={memberDepartments}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Invite Codes</h2>
        <InviteManager
          invites={invites}
          orgId={org.id}
          departments={departments.map((d) => ({ id: d.id, name: d.name }))}
        />
      </div>
    </div>
  );
}
