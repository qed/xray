import { notFound } from 'next/navigation';
import { getOrgBySlug, getCrossDepartmentDependencies, getDepartments } from '@/lib/db';
import DependencyGraph from '@/components/DependencyGraph';
import DependencyTable from '@/components/DependencyTable';

export default async function DependenciesPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const dependencies = await getCrossDepartmentDependencies(org.id);
  const departments = await getDepartments(org.id);
  const departmentNames = departments.map((d) => d.name);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dependencies</h1>
        <p className="text-slate-500 mt-1">Cross-department dependency map and relationships</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Department Dependency Map</h2>
        <DependencyGraph departments={departmentNames} dependencies={dependencies} />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">All Dependencies</h2>
        <DependencyTable dependencies={dependencies} />
      </div>
    </div>
  );
}
