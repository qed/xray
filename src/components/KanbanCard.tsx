import type { RankedOpportunity } from '@/lib/types';

interface KanbanCardProps {
  opportunity: RankedOpportunity;
}

const departmentColors: Record<string, string> = {
  accounting: 'bg-violet-900/40 text-violet-300',
  'sales-operations': 'bg-sky-900/40 text-sky-300',
};

const impactColors: Record<string, string> = {
  Critical: 'bg-red-900/50 text-red-300',
  'Very High': 'bg-orange-900/50 text-orange-300',
  High: 'bg-amber-900/50 text-amber-300',
  Medium: 'bg-yellow-900/50 text-yellow-300',
  Low: 'bg-slate-800 text-slate-400',
};

const complexityColors: Record<string, string> = {
  Low: 'bg-emerald-900/50 text-emerald-300',
  Medium: 'bg-yellow-900/50 text-yellow-300',
  'Medium-High': 'bg-orange-900/50 text-orange-300',
  High: 'bg-red-900/50 text-red-300',
};

export default function KanbanCard({ opportunity }: KanbanCardProps) {
  const deptColor = departmentColors[opportunity.departmentSlug] ?? 'bg-slate-800 text-slate-300';
  const impactColor = impactColors[opportunity.impact] ?? 'bg-slate-800 text-slate-400';
  const complexColor = complexityColors[opportunity.complexity] ?? 'bg-slate-800 text-slate-400';

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 hover:border-cyan-400/30 hover:bg-slate-800/80 transition-colors cursor-default">
      {/* Name */}
      <p className="text-sm font-medium text-white leading-snug mb-2 line-clamp-2">
        {opportunity.name}
      </p>

      {/* Department tag */}
      <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${deptColor} mb-2`}>
        {opportunity.departmentName}
      </span>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${complexColor}`}>
          {opportunity.complexity}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${impactColor}`}>
          {opportunity.impact}
        </span>
        <span className="ml-auto text-[10px] font-semibold text-cyan-400">
          {opportunity.score}
        </span>
      </div>
    </div>
  );
}
