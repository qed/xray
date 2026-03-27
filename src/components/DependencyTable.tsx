import type { DepartmentDependency } from '@/lib/types';

interface Props {
  dependencies: DepartmentDependency[];
}

export default function DependencyTable({ dependencies }: Props) {
  if (dependencies.length === 0) {
    return (
      <p className="text-slate-500 text-sm">
        No cross-department dependencies detected.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
            <th className="py-3 px-4 font-medium">From</th>
            <th className="py-3 px-4 font-medium">To</th>
            <th className="py-3 px-4 font-medium">Description</th>
            <th className="py-3 px-4 font-medium">Priorities</th>
          </tr>
        </thead>
        <tbody>
          {dependencies.map((dep) => (
            <tr
              key={dep.id}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="py-3 px-4 font-medium text-slate-700">
                {dep.sourceDepartmentName}
              </td>
              <td className="py-3 px-4 font-medium text-slate-700">
                {dep.targetDepartmentName}
              </td>
              <td className="py-3 px-4 text-slate-600">{dep.description}</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {dep.priorityNames.length}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
