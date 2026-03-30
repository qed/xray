import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrgBySlug, getDepartmentBySlug, getPriorities } from '@/lib/db';
import { MILESTONE_STAGES } from '@/lib/constants';
import type { AutomationPriority } from '@/lib/types';
import ImplementationPlan from '@/components/ImplementationPlan';

export default async function PlanPage({ params }: { params: Promise<{ orgSlug: string; slug: string; priority: string }> }) {
  const { orgSlug, slug, priority: priorityParam } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const dept = await getDepartmentBySlug(org.id, slug);
  if (!dept) notFound();

  const rank = parseInt(priorityParam.replace('priority-', ''));
  const dbPriorities = await getPriorities(dept.id);
  const dbPriority = dbPriorities.find((p) => p.rank === rank);
  const milestones = MILESTONE_STAGES.map((m) => ({ id: m.stage, name: m.name }));

  if (!dbPriority) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Priority Not Found</h1>
        <Link href={`/org/${orgSlug}/department/${slug}`} className="text-emerald-600 hover:text-emerald-700">
          Back to {dept.name}
        </Link>
      </div>
    );
  }

  const currentMilestone = dbPriority.milestone_stage ?? 0;
  const priority: AutomationPriority = {
    departmentSlug: slug,
    rank: dbPriority.rank,
    name: dbPriority.name,
    effort: dbPriority.effort as AutomationPriority['effort'],
    complexity: dbPriority.complexity as AutomationPriority['complexity'],
    whatToAutomate: dbPriority.what_to_automate,
    currentState: dbPriority.current_state,
    whyItMatters: dbPriority.why_it_matters,
    estimatedTimeSavings: dbPriority.estimated_time_savings,
    suggestedApproach: dbPriority.suggested_approach,
    successCriteria: dbPriority.success_criteria,
    dependencies: dbPriority.dependencies,
    status: dbPriority.status,
  };

  return (
    <div className="space-y-8">
      <div className="text-sm text-slate-400">
        <Link href={`/org/${orgSlug}/priorities`} className="hover:text-emerald-600 transition-colors">
          AI Priorities
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/org/${orgSlug}/department/${slug}`} className="hover:text-emerald-600 transition-colors">
          {dept.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-600">Priority {priority.rank}</span>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 text-lg font-bold shrink-0">
            {priority.rank}
          </span>
          <h1 className="text-3xl font-bold text-slate-900">{priority.name}</h1>
        </div>
        <p className="text-slate-500 text-sm ml-12">
          {dept.name} &middot; Complexity: {priority.complexity}
        </p>
      </section>

      <ImplementationPlan
        priority={priority}
        departmentName={dept.name}
        milestones={milestones}
        currentMilestone={currentMilestone}
      />

      <div className="pt-4">
        <Link
          href={`/org/${orgSlug}/department/${slug}`}
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
        >
          &larr; Back to {dept.name}
        </Link>
      </div>
    </div>
  );
}
