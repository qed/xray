import type { MilestoneConfig, RankedOpportunity } from '@/lib/types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  milestone: MilestoneConfig;
  opportunities: RankedOpportunity[];
}

const columnColors: Record<number, string> = {
  0: 'bg-slate-900/50 border-slate-800',
  1: 'bg-slate-900/60 border-blue-900/40',
  2: 'bg-slate-900/70 border-indigo-900/40',
  3: 'bg-slate-900/80 border-emerald-900/40',
};

const headerAccent: Record<number, string> = {
  0: 'text-slate-400',
  1: 'text-blue-400',
  2: 'text-indigo-400',
  3: 'text-emerald-400',
};

const countBg: Record<number, string> = {
  0: 'bg-slate-800 text-slate-300',
  1: 'bg-blue-900/50 text-blue-300',
  2: 'bg-indigo-900/50 text-indigo-300',
  3: 'bg-emerald-900/50 text-emerald-300',
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
      <div className="p-4 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-semibold ${accent}`}>
            {milestone.name}
          </h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge}`}>
            {opportunities.length}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
          {milestone.definition}
        </p>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {opportunities.length === 0 ? (
          <p className="text-xs text-slate-600 text-center py-6">
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
