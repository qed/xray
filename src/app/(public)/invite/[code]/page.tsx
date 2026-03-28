import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/signup?invite=${code}`);

  const { data: invite } = await supabase.from('invites').select('*, organization:organizations(*)').eq('code', code).single();
  if (!invite) redirect('/join');

  const { data: existing } = await supabase.from('org_members').select('id').eq('org_id', invite.org_id).eq('user_id', user.id).single();
  if (existing) redirect(`/org/${invite.organization.slug}/priorities`);

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) redirect('/join');
  if (invite.max_uses && invite.use_count >= invite.max_uses) redirect('/join');

  await supabase.from('org_members').insert({ org_id: invite.org_id, user_id: user.id, role: 'member' });
  await supabase.from('invites').update({ use_count: invite.use_count + 1 }).eq('id', invite.id);

  redirect(`/org/${invite.organization.slug}/priorities`);
}
