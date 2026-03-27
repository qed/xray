import type { StrategicBlocker } from '@/lib/types';

interface Props {
  blockers: StrategicBlocker[];
}

export default function StrategicBlockers({ blockers }: Props) {
  if (blockers.length === 0) {
    return (
      <p className="text-slate-500 text-sm">
        No strategic blockers detected.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {blockers.map((blocker) => (
        <div
          key={blocker.id}
          className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-red-900">
              {blocker.name}
            </h3>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 whitespace-nowrap">
              {blocker.affectedPriorityCount} priorities
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {blocker.departments.map((dept) => (
              <span
                key={dept}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100/60 text-red-800"
              >
                {dept}
              </span>
            ))}
          </div>

          <ul className="text-xs text-red-700 space-y-0.5">
            {blocker.priorities.map((p, i) => (
              <li key={i}>
                {p.departmentName}: {p.priorityName}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
