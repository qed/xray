import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getDepartments } from '@/lib/db';
import IntakePageClient from './IntakePageClient';

export default async function IntakePage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) redirect('/join');

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  const departments = await getDepartments(org.id);

  const deptList = departments.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
  }));

  return (
    <IntakePageClient
      departments={deptList}
      orgSlug={orgSlug}
      orgId={org.id}
    />
  );
}
