import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getDepartmentBySlug, getPriorities, getCompletenessScore } from '@/lib/db';
import { getColorPalette } from '@/lib/constants';
import { generatePlaceholderReporting } from '@/lib/reporting';
import DepartmentView from '@/components/dashboard/DepartmentView';

export default async function DepartmentDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string; deptSlug: string }>;
}) {
  const { orgSlug, deptSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  const dept = await getDepartmentBySlug(org.id, deptSlug);
  if (!dept) notFound();

  const rawPriorities = await getPriorities(dept.id);
  const palette = getColorPalette(dept.color_index);

  const priorities = rawPriorities.map((p) => {
    // Use stored reporting_data, or generate deterministic placeholder on-the-fly for pre-migration priorities
    const reportingData = p.reporting_data ?? generatePlaceholderReporting(p);

    return {
      id: p.id,
      slug: p.slug,
      rank: p.rank,
      name: p.name,
      status: p.status,
      effort: p.effort,
      complexity: p.complexity,
      completeness: getCompletenessScore(p),
      reportingData,
    };
  });

  return (
    <DepartmentView
      orgSlug={orgSlug}
      deptSlug={deptSlug}
      deptName={dept.name}
      palette={palette}
      priorities={priorities}
    />
  );
}
