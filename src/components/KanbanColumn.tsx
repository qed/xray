import type { MilestoneConfig, RankedOpportunity } from '@/lib/types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  milestone: MilestoneConfig;
  opportunities: RankedOpportunity[];
}

const columnColors: Record<number, string> = {
  0: 'bg-slate-50 border-slate-200',
  1: 'bg-blue-50/50 border-blue-200',
  2: 'bg-indigo-50/50 border-indigo-200',
  3: 'bg-emerald-50/50 border-emerald-200',
};

const headerAccent: Record<number, string> = {
  0: 'text-slate-500',
  1: 'text-blue-600',
  2: 'text-indigo-600',
  3: 'text-emerald-600',
};

const countBg: Record<number, string> = {
  0: 'bg-slate-100 text-slate-600',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-indigo-100 text-indigo-700',
  3: 'bg-emerald-100 text-emerald-700',
};

export default function KanbanColumn({ milestone, opportunities }: KanbanColumnProps) {
  const colColor = columnColors[milestone.id] ?? columnColors[0];
  const accent = headerAccent[milestone.id] ?? headerAccent[0];
  const badge = countBg[milestone.id] ?? countBg[0];

  return (
    <div
      className={`flex-shrink-0 w-72 md:w-80 rounded-xl border ${colColor} flex flex-col max-h-[calc(100vh-16rem)] snap-start`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-semibold ${accent}`}>
            {milestone.name}
          </h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge}`}>
            {opportunities.length}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {milestone.definition}
        </p>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {opportunities.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No items
          </p>
        ) : (
          opportunities.map((opp, idx) => (
            <KanbanCard key={`${opp.departmentSlug}-${opp.rank}-${idx}`} opportunity={opp} />
          ))
        )}
      </div>
    </div>
  );
}
