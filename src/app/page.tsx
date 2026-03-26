import { getCompanyOverview } from '@/lib/aggregator';
import { getMilestones } from '@/lib/parser';
import ScoreCard from '@/components/ScoreCard';
import DepartmentCard from '@/components/DepartmentCard';
import TopWinsTable from '@/components/TopWinsTable';
import MilestoneChart from '@/components/MilestoneChart';

export default function Home() {
  const overview = getCompanyOverview();
  const milestones = getMilestones();

  const chartData = milestones.map((m) => ({
    name: m.name,
    value: overview.byMilestoneStage[m.id] ?? 0,
  }));

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Company Overview
        </h1>
        <p className="text-slate-400 mt-1">
          Automation opportunities across all departments
        </p>
      </div>

      {/* Score Cards */}
      <ScoreCard
        totalOpportunities={overview.totalOpportunities}
        byMilestoneStage={overview.byMilestoneStage}
        totalCompleted={overview.totalCompleted}
        milestones={milestones}
      />

      {/* Milestone Chart + Department Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Milestone Distribution
          </h2>
          <MilestoneChart data={chartData} />
        </div>

        {/* Department Cards */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">
            Departments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {overview.departments.map((dept) => (
              <DepartmentCard key={dept.slug} department={dept} />
            ))}
          </div>
        </div>
      </div>

      {/* Top Wins Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Top Opportunities
        </h2>
        <TopWinsTable wins={overview.topWins} />
      </div>
    </div>
  );
}
