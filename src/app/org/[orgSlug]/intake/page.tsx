import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole } from '@/lib/db';
import { createAdminClient } from '@/lib/supabase/admin';
import IntakeChat from './IntakeChat';

export default async function IntakePage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) redirect('/join');

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  // Load existing active conversation for this user
  const admin = createAdminClient();
  const { data: existingConvo } = await admin
    .from('conversations')
    .select('id, status, context')
    .eq('org_id', org.id)
    .eq('user_id', user.id)
    .eq('mode', 'intake')
    .in('status', ['active', 'extracted'])
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

  return (
    <div className="h-[calc(100vh-7rem)]">
      <IntakeChat
        orgId={org.id}
        orgName={org.name}
        existingConversationId={existingConvo?.id}
        existingMessages={existingMessages}
        isExtracted={existingConvo?.status === 'extracted'}
      />
    </div>
  );
}
