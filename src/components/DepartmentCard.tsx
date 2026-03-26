import Link from 'next/link';
import type { DepartmentSummary } from '@/lib/types';

interface DepartmentCardProps {
  department: DepartmentSummary;
}

export default function DepartmentCard({ department }: DepartmentCardProps) {
  const { slug, name, totalPriorities, completed, inProgress, notStarted, progressPercent } = department;

  return (
    <Link
      href={`/department/${slug}`}
      className="block bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-400/50 hover:bg-slate-800/50 transition-all group"
    >
      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-4">
        {name}
      </h3>

      <div className="text-sm text-slate-400 mb-3">
        {totalPriorities} priorities
      </div>

      <div className="flex gap-4 text-xs mb-4">
        <span className="text-emerald-400">{completed} done</span>
        <span className="text-amber-400">{inProgress} in progress</span>
        <span className="text-slate-500">{notStarted} not started</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2">
        <div
          className="bg-cyan-400 h-2 rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="text-xs text-slate-500 mt-1 text-right">{progressPercent}%</div>
    </Link>
  );
}
