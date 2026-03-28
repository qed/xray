import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getOrgMembers, getOrgInvites } from '@/lib/db';
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
    redirect(`/org/${orgSlug}/priorities`);
  }

  const members = await getOrgMembers(org.id);
  const invites = await getOrgInvites(org.id);

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
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Invite Codes</h2>
        <InviteManager invites={invites} orgId={org.id} />
      </div>
    </div>
  );
}
