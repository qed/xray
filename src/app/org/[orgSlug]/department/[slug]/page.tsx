import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrgBySlug, getDepartmentBySlug, getPriorities, getTeamMembers, getScalingRisks, getTopWins } from '@/lib/db';
import { MILESTONE_STAGES } from '@/lib/constants';
import type { AutomationPriority } from '@/lib/types';
import TeamRoster from '@/components/TeamRoster';
import ToolStack from '@/components/ToolStack';
import PriorityCard from '@/components/PriorityCard';
import MilestonePipeline from '@/components/MilestonePipeline';
import RiskSection from '@/components/RiskSection';

function toAutomationPriority(p: { rank: number; name: string; effort: string; complexity: string; what_to_automate: string; current_state: string; why_it_matters: string; estimated_time_savings: string; suggested_approach: string; success_criteria: string; dependencies: string[]; status: string }, deptSlug: string): AutomationPriority {
  return {
    departmentSlug: deptSlug,
    rank: p.rank,
    name: p.name,
    effort: p.effort as AutomationPriority['effort'],
    complexity: p.complexity as AutomationPriority['complexity'],
    whatToAutomate: p.what_to_automate,
    currentState: p.current_state,
    whyItMatters: p.why_it_matters,
    estimatedTimeSavings: p.estimated_time_savings,
    suggestedApproach: p.suggested_approach,
    successCriteria: p.success_criteria,
    dependencies: p.dependencies,
    status: p.status,
  };
}

export default async function DepartmentPage({ params }: { params: Promise<{ orgSlug: string; slug: string }> }) {
  const { orgSlug, slug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const dept = await getDepartmentBySlug(org.id, slug);
  if (!dept) notFound();

  const dbPriorities = await getPriorities(dept.id);
  const teamMembers = await getTeamMembers(dept.id);
  const scalingRisks = await getScalingRisks(dept.id);
  const milestones = MILESTONE_STAGES.map((m) => ({ id: m.stage, name: m.name }));
  const priorities = dbPriorities.map((p) => toAutomationPriority(p, slug));

  // Get RankedOpportunity objects for this department's priorities
  const allOpps = await getTopWins(org.id, 100);
  const deptOpps = allOpps.filter((opp) => opp.departmentSlug === slug);
  const oppByRank = new Map(deptOpps.map((opp) => [opp.rank, opp]));

  // Build statuses from milestones table data (already in priorities via join)
  const statuses: Record<string, { milestone: number }> = {};
  for (const p of dbPriorities) {
    statuses[`${slug}/priority-${p.rank}`] = { milestone: p.milestone_stage ?? 0 };
  }

  return (
    <div className="space-y-10">
      <div className="text-sm text-slate-400">
        <Link href={`/org/${orgSlug}/priorities`} className="hover:text-emerald-600 transition-colors">
          AI Priorities
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-600">{dept.name}</span>
      </div>

      <section>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{dept.name}</h1>
        {dept.mission && <p className="text-slate-500 text-lg max-w-3xl">{dept.mission}</p>}
        {dept.scope && <p className="text-slate-400 text-sm mt-2 max-w-3xl">{dept.scope}</p>}
      </section>

      {teamMembers.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-emerald-600 mb-4">Team</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            <TeamRoster members={teamMembers} />
          </div>
        </section>
      )}

      {dept.tools && dept.tools.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-emerald-600 mb-4">Tool Stack</h2>
          <ToolStack tools={dept.tools} />
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-emerald-600 mb-4">Milestone Pipeline</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <MilestonePipeline
            priorities={priorities}
            statuses={statuses}
            milestones={milestones}
            departmentSlug={slug}
          />
        </div>
      </section>

      {priorities.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-emerald-600 mb-4">Automation Priorities</h2>
          <div className="space-y-3">
            {priorities.map((priority) => {
              const opp = oppByRank.get(priority.rank);
              if (!opp) return null;
              return <PriorityCard key={priority.rank} opportunity={opp} />;
            })}
          </div>
        </section>
      )}

      <section>
        <RiskSection
          singlePointsOfFailure={dept.single_points_of_failure ?? []}
          scalingRisks={scalingRisks}
        />
      </section>
    </div>
  );
}
