'use client';

import type {
  DepartmentSummary,
  TimeSavingsRollup as TimeSavingsRollupType,
  RankedOpportunity,
  StaffingOverview,
} from '@/lib/types';
import DepartmentCard from './DepartmentCard';
import TimeSavingsRollup from './TimeSavingsRollup';
import PdfDownloadButton from './PdfDownloadButton';

interface Props {
  departments: DepartmentSummary[];
  timeSavings: TimeSavingsRollupType;
  allOpportunities: RankedOpportunity[];
  staffing: StaffingOverview[];
  orgSlug: string;
  orgName: string;
}

export default function ExecutiveDashboard({
  departments,
  timeSavings,
  allOpportunities,
  staffing,
  orgSlug,
  orgName,
}: Props) {
  const totalOpps = allOpportunities.length;
  const potentialHours = Math.round(timeSavings.totalPotentialHoursPerWeek);
  const deptsWithProgress = departments.filter((d) => d.progressPercent > 0).length;

  // Sort departments by readiness (highest progress first)
  const sortedDepts = [...departments].sort((a, b) => b.progressPercent - a.progressPercent);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{orgName}</h1>
          <p className="text-slate-500 mt-1">AI & Automation Readiness Overview</p>
        </div>
        <PdfDownloadButton
          orgName={orgName}
          departments={departments}
          timeSavings={timeSavings}
          allOpportunities={allOpportunities}
          staffing={staffing}
        />
      </div>

      {/* Readiness overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-slate-900">{totalOpps}</p>
          <p className="text-sm text-slate-500 mt-1">Total Opportunities</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-emerald-600">{potentialHours} hrs/wk</p>
          <p className="text-sm text-slate-500 mt-1">Potential Savings</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-slate-900">
            {deptsWithProgress}/{departments.length}
          </p>
          <p className="text-sm text-slate-500 mt-1">Departments Active</p>
        </div>
      </div>

      {/* Departments sorted by readiness */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Departments
          <span className="text-sm font-normal text-slate-400 ml-2">sorted by readiness</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDepts.map((dept) => (
            <DepartmentCard key={dept.slug} department={dept} orgSlug={orgSlug} />
          ))}
        </div>
      </div>

      {/* Weekly time savings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Weekly Time Savings</h2>
        <TimeSavingsRollup {...timeSavings} />
      </div>
    </div>
  );
}
