import { getCompanyOverview, getTimeSavingsRollup, getStrategicBlockers } from '@/lib/aggregator';
import { getMilestones } from '@/lib/parser';
import ScoreCard from '@/components/ScoreCard';
import DepartmentCard from '@/components/DepartmentCard';
import MilestoneChart from '@/components/MilestoneChart';
import TimeSavingsRollup from '@/components/TimeSavingsRollup';
import StrategicBlockers from '@/components/StrategicBlockers';

export default function DashboardPage() {
  const overview = getCompanyOverview();
  const milestones = getMilestones();
  const timeSavings = getTimeSavingsRollup();
  const blockers = getStrategicBlockers();

  const chartData = milestones.map((m) => ({
    name: m.name,
    value: overview.byMilestoneStage[m.id] ?? 0,
  }));

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Company-wide automation progress at a glance
        </p>
      </div>

      {/* Score Cards */}
      <ScoreCard
        totalOpportunities={overview.totalOpportunities}
        byMilestoneStage={overview.byMilestoneStage}
        totalCompleted={overview.totalCompleted}
        milestones={milestones}
      />

      {/* Weekly Time Savings */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Weekly Time Savings</h2>
        <TimeSavingsRollup {...timeSavings} />
      </div>

      {/* Strategic Blockers */}
      {blockers.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Strategic Blockers</h2>
          <StrategicBlockers blockers={blockers} />
        </div>
      )}

      {/* Milestone Chart + Department Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Milestone Distribution
          </h2>
          <MilestoneChart data={chartData} />
        </div>

        {/* Department Cards */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Departments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {overview.departments.map((dept) => (
              <DepartmentCard key={dept.slug} department={dept} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
