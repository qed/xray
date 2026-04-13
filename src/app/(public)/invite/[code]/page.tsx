import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  const code = rawCode.toLowerCase();

  // Use service role to bypass RLS — the user isn't a member yet
  const cookieStore = await cookies();
  const anonSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
  const { data: { user } } = await anonSupabase.auth.getUser();

  if (!user) redirect(`/signup?invite=${code}`);

  const serviceSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return []; }, setAll() {} } }
  );

  const { data: invite } = await serviceSupabase.from('invites').select('*, organization:organizations(*)').eq('code', code).single();
  if (!invite) redirect('/join');

  const { data: existing } = await serviceSupabase.from('org_members').select('id').eq('org_id', invite.org_id).eq('user_id', user.id).single();
  if (existing) redirect(`/org/${invite.organization.slug}/dashboard`);

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) redirect('/join');
  if (invite.max_uses && invite.use_count >= invite.max_uses) redirect('/join');

  await serviceSupabase.from('org_members').insert({ org_id: invite.org_id, user_id: user.id, role: invite.role ?? 'member' });
  await serviceSupabase.from('invites').update({ use_count: invite.use_count + 1 }).eq('id', invite.id);

  redirect(`/org/${invite.organization.slug}/dashboard`);
}
