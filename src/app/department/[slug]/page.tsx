import Link from 'next/link';
import { getDepartment, getDepartmentSlugs, getMilestones, getStatuses } from '@/lib/parser';
import { getTopWins } from '@/lib/aggregator';
import TeamRoster from '@/components/TeamRoster';
import ToolStack from '@/components/ToolStack';
import PriorityCard from '@/components/PriorityCard';
import MilestonePipeline from '@/components/MilestonePipeline';
import RiskSection from '@/components/RiskSection';

export function generateStaticParams() {
  return getDepartmentSlugs().map((slug) => ({ slug }));
}

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const department = getDepartment(slug);
  const milestones = getMilestones();
  const statuses = getStatuses();

  const { profile, priorities, scalingRisks } = department;

  // Get RankedOpportunity objects for this department's priorities
  const allOpps = getTopWins(100);
  const deptOpps = allOpps.filter((opp) => opp.departmentSlug === slug);
  // Build lookup by rank
  const oppByRank = new Map(deptOpps.map((opp) => [opp.rank, opp]));

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-400">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          AI Priorities
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-600">{profile.name}</span>
      </div>

      {/* Department Header */}
      <section>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{profile.name}</h1>
        {profile.mission && (
          <p className="text-slate-500 text-lg max-w-3xl">{profile.mission}</p>
        )}
        {profile.scope && (
          <p className="text-slate-400 text-sm mt-2 max-w-3xl">{profile.scope}</p>
        )}
      </section>

      {/* Team Roster */}
      {profile.teamMembers.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-emerald-600 mb-4">Team</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            <TeamRoster members={profile.teamMembers} />
          </div>
        </section>
      )}

      {/* Tool Stack */}
      {profile.tools.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-emerald-600 mb-4">Tool Stack</h2>
          <ToolStack tools={profile.tools} />
        </section>
      )}

      {/* Milestone Pipeline */}
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

      {/* Automation Priorities */}
      {priorities.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-emerald-600 mb-4">
            Automation Priorities
          </h2>
          <div className="space-y-3">
            {priorities.map((priority) => {
              const opp = oppByRank.get(priority.rank);
              if (!opp) return null;
              return (
                <PriorityCard
                  key={priority.rank}
                  opportunity={opp}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Single Points of Failure & Scaling Risks */}
      <section>
        <RiskSection
          singlePointsOfFailure={profile.singlePointsOfFailure}
          scalingRisks={scalingRisks}
        />
      </section>
    </div>
  );
}
