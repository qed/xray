import { notFound } from 'next/navigation';
import { getOrgBySlug, getToolOverlap, getDepartments } from '@/lib/db';
import ToolMatrix from '@/components/ToolMatrix';

export default async function ToolsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const tools = await getToolOverlap(org.id);
  const departments = await getDepartments(org.id);
  const allDepartmentNames = departments.map((d) => d.name);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tools</h1>
        <p className="text-slate-500 mt-1">Tool usage across departments and integration opportunities</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Tool Overlap Matrix</h2>
        <ToolMatrix tools={tools} allDepartments={allDepartmentNames} />
      </div>
    </div>
  );
}
