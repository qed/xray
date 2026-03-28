import { notFound } from 'next/navigation';
import { getOrgBySlug, getConsolidatedRisks, getStaffingOverview } from '@/lib/db';
import RiskHeatmap from '@/components/RiskHeatmap';
import StaffingTable from '@/components/StaffingTable';

export default async function RisksPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const risks = await getConsolidatedRisks(org.id);
  const staffing = await getStaffingOverview(org.id);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Risks</h1>
        <p className="text-slate-500 mt-1">Cross-department risk landscape and staffing capacity</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Risk Heatmap</h2>
        <RiskHeatmap risks={risks} />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Staffing &amp; Capacity</h2>
        <StaffingTable staffing={staffing} />
      </div>
    </div>
  );
}
