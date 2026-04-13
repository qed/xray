'use client';

import { useState } from 'react';
import Link from 'next/link';
import DepartmentSidebar, { type DepartmentSidebarItem } from './DepartmentSidebar';
import StatCard from './StatCard';
import DashboardChart from './DashboardChart';
import type { DepartmentSummary } from '@/lib/types';
import type { ColorPalette } from '@/lib/constants';

interface DepartmentWithPalette extends DepartmentSummary {
  palette: ColorPalette;
}

interface CompanyDashboardProps {
  orgSlug: string;
  orgName: string;
  departments: DepartmentWithPalette[];
  totalPriorities: number;
  totalInProgress: number;
  totalCompleted: number;
  totalHoursPerWeek: number;
  quantifiableCount: number;
}

export default function CompanyDashboard({
  orgSlug,
  orgName,
  departments,
  totalPriorities,
  totalInProgress,
  totalCompleted,
  totalHoursPerWeek,
  quantifiableCount,
}: CompanyDashboardProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedDept = selectedSlug ? departments.find((d) => d.slug === selectedSlug) : null;

  const sidebarItems: DepartmentSidebarItem[] = departments.map((d) => ({
    slug: d.slug,
    name: d.name,
    priorityCount: d.totalPriorities,
    activeCount: d.inProgress,
    palette: d.palette,
  }));

  function handleSelect(slug: string) {
    setSelectedSlug((prev) => (prev === slug ? null : slug));
  }

  const accentColor = selectedDept?.palette.primary ?? '#1a1a2e';

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          {orgName} &middot; {departments.length} Departments &middot; {totalPriorities} Priorities
        </p>
      </div>

      {/* Mobile pill row */}
      <div className="md:hidden mb-4">
        <DepartmentSidebar departments={sidebarItems} selectedSlug={selectedSlug} onSelect={handleSelect} />
      </div>

      {/* Two-panel command center */}
      <div className="flex gap-6">
        {/* Left sidebar — desktop only */}
        <div className="hidden md:block w-[260px] shrink-0">
          <DepartmentSidebar departments={sidebarItems} selectedSlug={selectedSlug} onSelect={handleSelect} />
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {selectedDept ? (
            <DeptSummaryContent dept={selectedDept} orgSlug={orgSlug} />
          ) : (
            <CompanyOverviewContent
              totalPriorities={totalPriorities}
              totalInProgress={totalInProgress}
              totalCompleted={totalCompleted}
              totalHoursPerWeek={totalHoursPerWeek}
              quantifiableCount={quantifiableCount}
              departments={departments}
              accentColor={accentColor}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Company aggregate overview ----------

function CompanyOverviewContent({
  totalPriorities,
  totalInProgress,
  totalCompleted,
  totalHoursPerWeek,
  quantifiableCount,
  departments,
  accentColor,
}: {
  totalPriorities: number;
  totalInProgress: number;
  totalCompleted: number;
  totalHoursPerWeek: number;
  quantifiableCount: number;
  departments: DepartmentWithPalette[];
  accentColor: string;
}) {
  // Build department bar chart data
  const deptBarChart = {
    id: 'company-dept-bar',
    title: 'Priorities by Department',
    type: 'horizontal-bar' as const,
    data: {
      labels: departments.map((d) => d.name),
      datasets: [{ label: 'Priorities', data: departments.map((d) => d.totalPriorities) }],
    },
  };

  // Build status doughnut
  const statusDoughnut = {
    id: 'company-status-doughnut',
    title: 'Status Breakdown',
    type: 'doughnut' as const,
    data: {
      labels: ['Completed', 'In Progress', 'Not Started'],
      datasets: [{
        label: 'Status',
        data: [
          totalCompleted,
          totalInProgress,
          totalPriorities - totalCompleted - totalInProgress,
        ],
      }],
    },
  };

  const palette: ColorPalette = { primary: accentColor, secondary: '#4A4A6A', tertiary: '#8888AA', light: 'rgba(26,26,46,0.1)', border: accentColor };

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Priorities" value={String(totalPriorities)} subtitle={`Across ${departments.length} departments`} accentColor={accentColor} />
        <StatCard label="Est. Weekly Hours Saved" value={`~${Math.round(totalHoursPerWeek * 10) / 10} hrs`} subtitle={`From ${quantifiableCount} quantifiable priorities`} accentColor={accentColor} />
        <StatCard label="In Progress" value={String(totalInProgress)} subtitle={`Of ${totalPriorities} total`} accentColor={accentColor} />
        <StatCard label="Completed" value={String(totalCompleted)} subtitle="Automation priorities" accentColor={accentColor} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <DashboardChart chart={deptBarChart} palette={palette} height={Math.max(200, departments.length * 32)} />
        <DashboardChart chart={statusDoughnut} palette={palette} />
      </div>

      {/* Company summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Company Overview</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {departments.length} departments with {totalPriorities} automation priorities identified.
          {totalInProgress > 0 && ` ${totalInProgress} are actively in progress.`}
          {totalCompleted > 0 && ` ${totalCompleted} have been completed.`}
          {totalHoursPerWeek > 0 && ` Estimated ${Math.round(totalHoursPerWeek * 10) / 10} hours per week in potential time savings from ${quantifiableCount} quantifiable priorities.`}
        </p>
      </div>
    </>
  );
}

// ---------- Department inline summary ----------

function DeptSummaryContent({ dept, orgSlug }: { dept: DepartmentWithPalette; orgSlug: string }) {
  const palette = dept.palette;
  const notStarted = dept.totalPriorities - dept.completed - dept.inProgress;
  const hours = '—'; // We don't have per-dept hours in DepartmentSummary, show placeholder

  // Status doughnut for department
  const statusChart = {
    id: `dept-${dept.slug}-status`,
    title: 'Status Breakdown',
    type: 'doughnut' as const,
    data: {
      labels: ['Completed', 'In Progress', 'Not Started'],
      datasets: [{ label: 'Status', data: [dept.completed, dept.inProgress, notStarted] }],
    },
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-bold" style={{ color: palette.primary }}>{dept.name}</h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Priorities" value={String(dept.totalPriorities)} subtitle={`In ${dept.name}`} accentColor={palette.primary} />
        <StatCard label="In Progress" value={String(dept.inProgress)} subtitle={`Of ${dept.totalPriorities} priorities`} accentColor={palette.primary} />
        <StatCard label="Completed" value={String(dept.completed)} subtitle={`${dept.progressPercent}% complete`} accentColor={palette.primary} />
        <StatCard label="Not Started" value={String(notStarted)} subtitle="Awaiting action" accentColor={palette.primary} />
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <DashboardChart chart={statusChart} palette={palette} />
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Department Summary</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {dept.name} has {dept.totalPriorities} automation priorities.
          {dept.inProgress > 0 && ` ${dept.inProgress} are in progress.`}
          {dept.completed > 0 && ` ${dept.completed} have been completed (${dept.progressPercent}%).`}
          {notStarted > 0 && ` ${notStarted} are awaiting action.`}
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href={`/org/${orgSlug}/dashboard/${dept.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: palette.primary }}
        >
          View Department Dashboard &rarr;
        </Link>
      </div>
    </>
  );
}
