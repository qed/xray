import { getCrossDepartmentDependencies } from '@/lib/aggregator';
import { getAllDepartments } from '@/lib/parser';
import DependencyGraph from '@/components/DependencyGraph';
import DependencyTable from '@/components/DependencyTable';

export const dynamic = 'force-dynamic';

export default function DependenciesPage() {
  const dependencies = getCrossDepartmentDependencies();
  const departments = getAllDepartments();
  const departmentNames = departments.map((d) => d.profile.name);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Dependencies
        </h1>
        <p className="text-slate-500 mt-1">
          Cross-department dependency map and relationships
        </p>
      </div>

      {/* Dependency Graph */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Department Dependency Map
        </h2>
        <DependencyGraph
          departments={departmentNames}
          dependencies={dependencies}
        />
      </div>

      {/* All Dependencies Table */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          All Dependencies
        </h2>
        <DependencyTable dependencies={dependencies} />
      </div>
    </div>
  );
}
