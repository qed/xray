import { getToolOverlap } from '@/lib/aggregator';
import { getAllDepartments } from '@/lib/parser';
import ToolMatrix from '@/components/ToolMatrix';

export default function ToolsPage() {
  const tools = getToolOverlap();
  const departments = getAllDepartments();
  const allDepartmentNames = departments.map((d) => d.profile.name);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Tools
        </h1>
        <p className="text-slate-500 mt-1">
          Tool usage across departments and integration opportunities
        </p>
      </div>

      {/* Tool Matrix */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Tool Overlap Matrix
        </h2>
        <ToolMatrix tools={tools} allDepartments={allDepartmentNames} />
      </div>
    </div>
  );
}
