import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getDepartmentBySlug, getPriorityBySlug } from '@/lib/db';
import { getColorPalette } from '@/lib/constants';
import { generatePlaceholderReporting } from '@/lib/reporting';
import PriorityReportingView from '@/components/dashboard/PriorityReportingView';

export default async function PriorityDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; deptSlug: string; prioritySlug: string }>;
}) {
  const { orgSlug, deptSlug, prioritySlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  const dept = await getDepartmentBySlug(org.id, deptSlug);
  if (!dept) notFound();

  const priority = await getPriorityBySlug(dept.id, prioritySlug);
  if (!priority) notFound();

  const palette = getColorPalette(dept.color_index);

  // Use stored reporting_data, or generate deterministic placeholder on-the-fly
  const reportingData = priority.reporting_data ?? generatePlaceholderReporting(priority);

  return (
    <PriorityReportingView
      orgSlug={orgSlug}
      deptSlug={deptSlug}
      deptName={dept.name}
      priorityName={priority.name}
      priorityRank={priority.rank}
      reportingData={reportingData}
      palette={palette}
    />
  );
}
