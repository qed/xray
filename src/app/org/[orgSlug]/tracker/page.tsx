import { notFound } from 'next/navigation';
import { getOrgBySlug, getOpportunitiesByStatus } from '@/lib/db';
import KanbanBoard from '@/components/KanbanBoard';

const STATUS_COLUMNS = [
  { id: 'proposed', name: 'Proposed' },
  { id: 'not_started', name: 'Not Started' },
  { id: 'in_progress', name: 'In Progress' },
  { id: 'complete', name: 'Completed' },
];

export default async function TrackerPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const grouped = await getOpportunitiesByStatus(org.id);

  const columns = STATUS_COLUMNS.map((col) => ({
    milestone: { id: STATUS_COLUMNS.indexOf(col), name: col.name },
    opportunities: grouped[col.id] ?? [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Implementation Tracker</h1>
        <p className="text-slate-500 mt-1">All automation priorities by status</p>
      </div>
      <KanbanBoard columns={columns} />
    </div>
  );
}
