import { notFound } from 'next/navigation';
import { getOrgBySlug, getTopWins, getDepartments } from '@/lib/db';
import PrioritiesPageContent from '@/components/PrioritiesPageContent';

export default async function PrioritiesPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const [allOpportunities, departments] = await Promise.all([
    getTopWins(org.id, 100),
    getDepartments(org.id),
  ]);

  const complete = allOpportunities.filter(
    (o) => o.completeness.score === o.completeness.total
  );

  return (
    <PrioritiesPageContent
      opportunities={complete}
      allOpportunities={allOpportunities}
      departments={departments.map((d) => ({ slug: d.slug, name: d.name }))}
      orgSlug={orgSlug}
    />
  );
}
