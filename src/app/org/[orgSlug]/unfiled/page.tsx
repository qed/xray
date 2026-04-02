import { notFound } from 'next/navigation';
import { getOrgBySlug, getDepartments, getTeamMembers, getUnfiledRankedOpportunities } from '@/lib/db';
import MissingGapsWorkflow from '@/components/MissingGapsWorkflow';
import type { DepartmentGaps } from '@/components/MissingGapsWorkflow';

export default async function UnfiledPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const [allDepts, unfiled] = await Promise.all([
    getDepartments(org.id),
    getUnfiledRankedOpportunities(org.id),
  ]);

  // Group unfiled priorities by department
  const deptMap = new Map<string, typeof unfiled>();
  for (const p of unfiled) {
    const list = deptMap.get(p.departmentSlug) ?? [];
    list.push(p);
    deptMap.set(p.departmentSlug, list);
  }

  // Build department gaps with team members
  const departmentGaps: DepartmentGaps[] = await Promise.all(
    allDepts
      .filter((d) => deptMap.has(d.slug))
      .map(async (d) => ({
        department: d,
        teamMembers: await getTeamMembers(d.id),
        priorities: deptMap.get(d.slug)!,
      }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Missing Gaps</h1>
        <p className="text-slate-500 mt-1">Fill in missing priority data with AI or manually</p>
      </div>

      {departmentGaps.length === 0 ? (
        <div className="bg-slate-50 border border-emerald-200 rounded-xl p-8 text-center">
          <p className="text-emerald-600 text-lg font-medium">All priorities are complete</p>
          <p className="text-slate-500 mt-2 text-sm">Every priority has all required fields filled in.</p>
        </div>
      ) : (
        <MissingGapsWorkflow departments={departmentGaps} />
      )}
    </div>
  );
}
