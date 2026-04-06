import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getCompanyOverview, getTimeSavingsRollup, getStrategicBlockers, getTopWins } from '@/lib/db';
import DashboardContent from '@/components/DashboardContent';
import ExecutiveDashboard from '@/components/ExecutiveDashboard';

export default async function DashboardPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  const [overview, timeSavings, blockers, allOpportunities] = await Promise.all([
    getCompanyOverview(org.id),
    getTimeSavingsRollup(org.id),
    getStrategicBlockers(org.id),
    getTopWins(org.id, 1000),
  ]);

  if (role === 'admin') {
    return (
      <ExecutiveDashboard
        departments={overview.departments}
        timeSavings={timeSavings}
        allOpportunities={allOpportunities}
        orgSlug={orgSlug}
        orgName={org.name}
      />
    );
  }

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
