import Link from 'next/link';
import { getDepartmentSlugs, getDepartment, getMilestones, getStatuses } from '@/lib/parser';
import ImplementationPlan from '@/components/ImplementationPlan';

export function generateStaticParams() {
  const slugs = getDepartmentSlugs();
  const params: { slug: string; priority: string }[] = [];
  for (const slug of slugs) {
    const dept = getDepartment(slug);
    for (const p of dept.priorities) {
      params.push({ slug, priority: `priority-${p.rank}` });
    }
  }
  return params;
}

export default async function PlanPage({ params }: { params: Promise<{ slug: string; priority: string }> }) {
  const { slug, priority: priorityParam } = await params;
  const rank = parseInt(priorityParam.replace('priority-', ''));
  const department = getDepartment(slug);
  const priority = department.priorities.find(p => p.rank === rank);
  const milestones = getMilestones();
  const statuses = getStatuses();

  if (!priority) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Priority Not Found</h1>
        <Link href={`/department/${slug}`} className="text-cyan-400 hover:text-cyan-300">
          Back to {department.profile.name}
        </Link>
      </div>
    );
  }

  const statusKey = `${slug}/priority-${priority.rank}`;
  const status = statuses[statusKey];
  const currentMilestone = status?.milestone ?? 0;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500">
        <Link href="/" className="hover:text-cyan-400 transition-colors">
          Overview
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/department/${slug}`} className="hover:text-cyan-400 transition-colors">
          {department.profile.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Priority {priority.rank}</span>
      </div>

      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-400/10 text-cyan-400 text-lg font-bold shrink-0">
            {priority.rank}
          </span>
          <h1 className="text-3xl font-bold text-white">{priority.name}</h1>
        </div>
        <p className="text-slate-500 text-sm ml-12">
          {department.profile.name} &middot; Impact: {priority.impact} &middot; Complexity: {priority.complexity}
        </p>
      </section>

      {/* Plan content */}
      <ImplementationPlan
        priority={priority}
        departmentName={department.profile.name}
        milestones={milestones}
        currentMilestone={currentMilestone}
      />

      {/* Back link */}
      <div className="pt-4">
        <Link
          href={`/department/${slug}`}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
        >
          &larr; Back to {department.profile.name}
        </Link>
      </div>
    </div>
  );
}
