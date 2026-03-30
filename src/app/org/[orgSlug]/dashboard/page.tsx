import { notFound } from 'next/navigation';
import { getOrgBySlug, getCompanyOverview, getTimeSavingsRollup, getStrategicBlockers, getTopWins } from '@/lib/db';
import DashboardContent from '@/components/DashboardContent';

export default async function DashboardPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const [overview, timeSavings, blockers, allOpportunities] = await Promise.all([
    getCompanyOverview(org.id),
    getTimeSavingsRollup(org.id),
    getStrategicBlockers(org.id),
    getTopWins(org.id, 1000),
  ]);

  return (
    <DashboardContent
      allOpportunities={allOpportunities}
      departments={overview.departments}
      timeSavings={timeSavings}
      blockers={blockers}
      orgSlug={orgSlug}
    />
  );
}
