import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getCompanyOverview, getTimeSavingsRollup, getDepartments } from '@/lib/db';
import { getColorPalette } from '@/lib/constants';
import CompanyDashboard from '@/components/dashboard/CompanyDashboard';

export default async function DashboardPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  const [overview, timeSavings, departments] = await Promise.all([
    getCompanyOverview(org.id),
    getTimeSavingsRollup(org.id),
    getDepartments(org.id),
  ]);

  // Build department list with color palettes
  const departmentsWithPalettes = overview.departments.map((dept) => {
    const dbDept = departments.find((d) => d.slug === dept.slug);
    return {
      ...dept,
      palette: getColorPalette(dbDept?.color_index ?? null),
    };
  });

  // Count quantifiable priorities (those with valid parsed time savings)
  const quantifiableCount = overview.topWins.filter((w) => w.parsedTimeSavings.valid).length;

  return (
    <CompanyDashboard
      orgSlug={orgSlug}
      orgName={org.name}
      departments={departmentsWithPalettes}
      totalPriorities={overview.totalOpportunities}
      totalInProgress={overview.byStatus['in_progress'] ?? 0}
      totalCompleted={overview.totalCompleted}
      totalHoursPerWeek={timeSavings.totalPotentialHoursPerWeek}
      quantifiableCount={quantifiableCount}
    />
  );
}
