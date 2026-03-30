'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MILESTONE_STAGES } from '@/lib/constants';
import type {
  RankedOpportunity,
  DepartmentSummary,
  TimeSavingsRollup as TimeSavingsRollupType,
  StrategicBlocker,
} from '@/lib/types';
import ScoreCard from './ScoreCard';
import DepartmentCard from './DepartmentCard';
import MilestoneChart from './MilestoneChart';
import TimeSavingsRollup from './TimeSavingsRollup';
import StrategicBlockers from './StrategicBlockers';

interface Props {
  allOpportunities: RankedOpportunity[];
  departments: DepartmentSummary[];
  timeSavings: TimeSavingsRollupType;
  blockers: StrategicBlocker[];
  orgSlug: string;
}

const milestones = MILESTONE_STAGES.map((m) => ({ id: m.stage, name: m.name }));

export default function DashboardContent({
  allOpportunities,
  departments,
  timeSavings,
  blockers,
  orgSlug,
}: Props) {
  const [selectedDept, setSelectedDept] = useState('__all__');

  const filteredOpps = useMemo(() => {
    if (selectedDept === '__all__') return allOpportunities;
    return allOpportunities.filter((o) => o.departmentSlug === selectedDept);
  }, [selectedDept, allOpportunities]);

  // Readiness breakdown
  const readyCount = filteredOpps.filter(
    (o) => o.completeness.score === o.completeness.total
  ).length;
  const missingCount = filteredOpps.length - readyCount;

  // Score card data
  const byMilestoneStage = useMemo(() => {
    const stages: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
    for (const opp of filteredOpps) {
      stages[opp.milestoneStage] = (stages[opp.milestoneStage] ?? 0) + 1;
    }
    return stages;
  }, [filteredOpps]);

  const totalCompleted = filteredOpps.filter((o) => o.milestoneStage === 3).length;

  // Milestone chart
  const chartData = milestones.map((m) => ({
    name: m.name,
    value: byMilestoneStage[m.id] ?? 0,
  }));

  // Time savings
  const filteredTimeSavings = useMemo((): TimeSavingsRollupType => {
    if (selectedDept === '__all__') return timeSavings;
    const deptData = timeSavings.byDepartment.filter((d) => d.slug === selectedDept);
    const totalPotential = deptData.reduce((s, d) => s + d.potentialHoursPerWeek, 0);
    const totalRealized = deptData.reduce((s, d) => s + d.realizedHoursPerWeek, 0);
    return {
      totalPotentialHoursPerWeek: totalPotential,
      realizedHoursPerWeek: totalRealized,
      remainingHoursPerWeek: totalPotential - totalRealized,
      byDepartment: deptData,
    };
  }, [selectedDept, timeSavings]);

  // Blockers
  const filteredBlockers = useMemo(() => {
    if (selectedDept === '__all__') return blockers;
    const deptName = departments.find((d) => d.slug === selectedDept)?.name;
    if (!deptName) return [];
    return blockers.filter((b) => b.departments.includes(deptName));
  }, [selectedDept, blockers, departments]);

  // Departments
  const filteredDepartments = useMemo(() => {
    if (selectedDept === '__all__') return departments;
    return departments.filter((d) => d.slug === selectedDept);
  }, [selectedDept, departments]);

  const selectedName =
    selectedDept === '__all__'
      ? 'Company-wide'
      : departments.find((d) => d.slug === selectedDept)?.name ?? '';

  return (
    <div className="space-y-10">
      {/* Header with dropdown */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">{selectedName} automation progress at a glance</p>
        </div>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="__all__">All Departments</option>
          {departments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Readiness Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2">
          <span className="text-3xl font-bold text-emerald-600">{readyCount}</span>
          <span className="text-sm text-emerald-700">Ready</span>
        </div>
        <Link
          href={`/org/${orgSlug}/unfiled`}
          className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-amber-400 transition-colors"
        >
          <span className="text-3xl font-bold text-amber-600">{missingCount}</span>
          <span className="text-sm text-amber-700">Missing Data</span>
        </Link>
      </div>

      {/* Score cards */}
      <ScoreCard
        totalOpportunities={filteredOpps.length}
        byMilestoneStage={byMilestoneStage}
        totalCompleted={totalCompleted}
        milestones={milestones}
      />

      {/* Time savings */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Weekly Time Savings</h2>
        <TimeSavingsRollup {...filteredTimeSavings} />
      </div>

      {/* Strategic blockers */}
      {filteredBlockers.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Strategic Blockers</h2>
          <StrategicBlockers blockers={filteredBlockers} />
        </div>
      )}

      {/* Milestone chart + departments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Milestone Distribution</h2>
          <MilestoneChart data={chartData} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Departments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDepartments.map((dept) => (
              <DepartmentCard key={dept.slug} department={dept} orgSlug={orgSlug} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
