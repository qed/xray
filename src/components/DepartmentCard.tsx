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
      className="block bg-slate-50 border border-slate-200 rounded-xl p-6 hover:border-emerald-300 hover:bg-slate-100 transition-all group"
    >
      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors mb-4">
        {name}
      </h3>

      <div className="text-sm text-slate-500 mb-3">
        {totalPriorities} priorities
      </div>

      <div className="flex gap-4 text-xs mb-4">
        <span className="text-emerald-600">{completed} done</span>
        <span className="text-amber-600">{inProgress} in progress</span>
        <span className="text-slate-400">{notStarted} not started</span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-emerald-600 h-2 rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="text-xs text-slate-400 mt-1 text-right">{progressPercent}%</div>
    </Link>
  );
}
