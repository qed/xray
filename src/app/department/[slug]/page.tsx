import Link from 'next/link';
import { getDepartment, getDepartmentSlugs, getMilestones, getStatuses } from '@/lib/parser';
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

  // Build milestone lookup for priority cards
  const milestoneLookup = new Map(milestones.map((m) => [m.id, m.name]));

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500">
        <Link href="/" className="hover:text-cyan-400 transition-colors">
          Overview
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{profile.name}</span>
      </div>

      {/* Department Header */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
        {profile.mission && (
          <p className="text-slate-400 text-lg max-w-3xl">{profile.mission}</p>
        )}
        {profile.scope && (
          <p className="text-slate-500 text-sm mt-2 max-w-3xl">{profile.scope}</p>
        )}
      </section>

      {/* Team Roster */}
      {profile.teamMembers.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">Team</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <TeamRoster members={profile.teamMembers} />
          </div>
        </section>
      )}

      {/* Tool Stack */}
      {profile.tools.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">Tool Stack</h2>
          <ToolStack tools={profile.tools} />
        </section>
      )}

      {/* Milestone Pipeline */}
      <section>
        <h2 className="text-xl font-semibold text-cyan-400 mb-4">Milestone Pipeline</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
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
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">
            Automation Priorities
          </h2>
          <div className="space-y-3">
            {priorities.map((priority) => {
              const statusKey = `${slug}/priority-${priority.rank}`;
              const status = statuses[statusKey];
              const milestoneStage = status?.milestone ?? 0;
              const milestoneName = milestoneLookup.get(milestoneStage) ?? 'Not Started';

              return (
                <PriorityCard
                  key={priority.rank}
                  priority={priority}
                  milestoneStage={milestoneStage}
                  milestoneName={milestoneName}
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
