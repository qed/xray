import { getUnfiledPriorities } from '@/lib/aggregator';

export default function UnfiledPage() {
  const unfiled = getUnfiledPriorities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Unfiled Priorities
        </h1>
        <p className="text-slate-400 mt-1">
          Priorities missing valid time estimates in hours/week
        </p>
      </div>

      {unfiled.length === 0 ? (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-8 text-center">
          <p className="text-emerald-400 text-lg font-medium">
            All priorities have valid time estimates
          </p>
          <p className="text-slate-400 mt-2 text-sm">
            Every priority has a valid hours/week value.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-amber-400 text-sm mb-4">
            {unfiled.length} {unfiled.length === 1 ? 'priority needs' : 'priorities need'} a valid hours/week estimate.
            Update the markdown files and reload.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Issue</th>
                  <th className="px-4 py-3">Current Text</th>
                </tr>
              </thead>
              <tbody>
                {unfiled.map((item) => (
                  <tr
                    key={`${item.departmentSlug}-${item.rank}`}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      #{item.rank} — {item.name}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.departmentName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded border text-xs font-medium bg-amber-500/20 text-amber-400 border-amber-500/30">
                        {item.issue}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-md truncate">
                      {item.rawText || '(no time estimate provided)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
