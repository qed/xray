'use client';

import { useState } from 'react';
import Link from 'next/link';
import PrioritySidebar, { type PrioritySidebarItem } from './PrioritySidebar';
import StatCard from './StatCard';
import DashboardChart from './DashboardChart';
import type { ReportingData } from '@/lib/types';
import type { ColorPalette } from '@/lib/constants';

interface PriorityData {
  slug: string;
  rank: number;
  name: string;
  status: string;
  effort: string;
  complexity: string;
  completeness: { score: number; total: number; missing: string[] };
  reportingData: ReportingData | null;
}

interface DepartmentViewProps {
  orgSlug: string;
  deptSlug: string;
  deptName: string;
  palette: ColorPalette;
  priorities: PriorityData[];
}

export default function DepartmentView({
  orgSlug,
  deptSlug,
  deptName,
  palette,
  priorities,
}: DepartmentViewProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedPriority = selectedSlug ? priorities.find((p) => p.slug === selectedSlug) : null;

  const sidebarItems: PrioritySidebarItem[] = priorities.map((p) => ({
    slug: p.slug,
    rank: p.rank,
    name: p.name,
    status: p.status,
    effort: p.effort,
    complexity: p.complexity,
    completeness: p.completeness,
    isPlaceholder: p.reportingData?.is_placeholder ?? false,
  }));

  function handleSelect(slug: string) {
    setSelectedSlug((prev) => (prev === slug ? null : slug));
  }

  // Aggregate stats
  const total = priorities.length;
  const inProgress = priorities.filter((p) => p.status?.toLowerCase() === 'in progress').length;
  const completed = priorities.filter((p) => ['completed', 'done'].includes(p.status?.toLowerCase())).length;
  const notStarted = total - inProgress - completed;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <Link href={`/org/${orgSlug}/dashboard`} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
          &larr; All Departments
        </Link>
        <h1 className="text-2xl font-bold mt-1" style={{ color: palette.primary }}>{deptName}</h1>
        <p className="text-sm text-slate-500 mt-1">{total} priorities</p>
      </div>

      {/* Mobile pill row */}
      <div className="md:hidden mb-4">
        <PrioritySidebar priorities={sidebarItems} selectedSlug={selectedSlug} onSelect={handleSelect} palette={palette} />
      </div>

      {/* Two-panel */}
      <div className="flex gap-6">
        {/* Left sidebar — desktop */}
        <div className="hidden md:block w-[260px] shrink-0 max-h-[calc(100vh-200px)] overflow-y-auto">
          <PrioritySidebar priorities={sidebarItems} selectedSlug={selectedSlug} onSelect={handleSelect} palette={palette} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {selectedPriority ? (
            <PrioritySummaryContent priority={selectedPriority} orgSlug={orgSlug} deptSlug={deptSlug} palette={palette} />
          ) : (
            <DepartmentOverviewContent
              deptName={deptName}
              total={total}
              inProgress={inProgress}
              completed={completed}
              notStarted={notStarted}
              palette={palette}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Department overview (no priority selected) ----------

function DepartmentOverviewContent({
  deptName,
  total,
  inProgress,
  completed,
  notStarted,
  palette,
}: {
  deptName: string;
  total: number;
  inProgress: number;
  completed: number;
  notStarted: number;
  palette: ColorPalette;
}) {
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statusChart = {
    id: 'dept-overview-status',
    title: 'Status Breakdown',
    type: 'doughnut' as const,
    data: {
      labels: ['Completed', 'In Progress', 'Not Started'],
      datasets: [{ label: 'Status', data: [completed, inProgress, notStarted] }],
    },
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Priorities" value={String(total)} subtitle={`In ${deptName}`} accentColor={palette.primary} />
        <StatCard label="In Progress" value={String(inProgress)} subtitle={`Of ${total} priorities`} accentColor={palette.primary} />
        <StatCard label="Completed" value={String(completed)} subtitle={`${progressPercent}% complete`} accentColor={palette.primary} />
        <StatCard label="Not Started" value={String(notStarted)} subtitle="Awaiting action" accentColor={palette.primary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <DashboardChart chart={statusChart} palette={palette} />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Department Summary</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {deptName} has {total} automation priorities.
          {inProgress > 0 && ` ${inProgress} are in progress.`}
          {completed > 0 && ` ${completed} have been completed (${progressPercent}%).`}
          {notStarted > 0 && ` ${notStarted} are awaiting action.`}
        </p>
      </div>
    </>
  );
}

// ---------- Priority inline summary ----------

function PrioritySummaryContent({
  priority,
  orgSlug,
  deptSlug,
  palette,
}: {
  priority: PriorityData;
  orgSlug: string;
  deptSlug: string;
  palette: ColorPalette;
}) {
  const rpt = priority.reportingData;

  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          #{priority.rank} {priority.name}
          {rpt?.is_placeholder && (
            <span className="ml-2 inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
              Sample Data
            </span>
          )}
        </h2>
      </div>

      {rpt ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {rpt.stat_cards.map((sc) => (
              <StatCard key={sc.label} label={sc.label} value={sc.value} subtitle={sc.subtitle} accentColor={palette.primary} />
            ))}
          </div>

          {/* First 2 charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {rpt.charts.slice(0, 2).map((chart) => (
              <DashboardChart key={chart.id} chart={chart} palette={palette} />
            ))}
          </div>

          {/* Summary snippet */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">AI Summary</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {rpt.summary.length > 300 ? rpt.summary.slice(0, 300) + '...' : rpt.summary}
            </p>
          </div>
        </>
      ) : (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-8 text-center text-sm text-slate-500 mb-6">
          No reporting data available for this priority yet.
        </div>
      )}

      {/* CTA */}
      <div className="text-center">
        <Link
          href={`/org/${orgSlug}/dashboard/${deptSlug}/${priority.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: palette.primary }}
        >
          View Full Report &rarr;
        </Link>
      </div>
    </>
  );
}
