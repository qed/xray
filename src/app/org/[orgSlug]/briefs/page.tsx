import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getProjectBriefs } from '@/lib/db';
import BriefsView from './BriefsView';

export default async function BriefsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const role = await getUserRole(org.id, user.id);
  if (!role || role === 'member') redirect(`/org/${orgSlug}/intake`);

  const briefs = await getProjectBriefs(org.id);

  return <BriefsView briefs={briefs} orgName={org.name} />;
}
