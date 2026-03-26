import type { AutomationPriority, MilestoneConfig, MilestoneStatus } from '@/lib/types';

interface MilestonePipelineProps {
  priorities: AutomationPriority[];
  statuses: Record<string, MilestoneStatus>;
  milestones: MilestoneConfig[];
  departmentSlug: string;
}

export default function MilestonePipeline({
  priorities,
  statuses,
  milestones,
  departmentSlug,
}: MilestonePipelineProps) {
  // Group priorities by milestone stage
  const stageMap: Record<number, AutomationPriority[]> = {};
  for (const m of milestones) {
    stageMap[m.id] = [];
  }

  for (const priority of priorities) {
    const statusKey = `${departmentSlug}/priority-${priority.rank}`;
    const status = statuses[statusKey];
    const stage = status?.milestone ?? 0;
    if (!stageMap[stage]) {
      stageMap[stage] = [];
    }
    stageMap[stage].push(priority);
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-0 min-w-[600px]">
        {milestones.map((milestone, idx) => {
          const stagePriorities = stageMap[milestone.id] ?? [];
          const isActive = stagePriorities.length > 0;
          const isLast = idx === milestones.length - 1;

          return (
            <div key={milestone.id} className="flex-1 flex flex-col items-center">
              {/* Stage header */}
              <div className="text-center mb-3">
                <div
                  className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                    isActive ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  M{milestone.id}
                </div>
                <div
                  className={`text-xs ${isActive ? 'text-slate-600' : 'text-slate-400'}`}
                >
                  {milestone.name}
                </div>
              </div>

              {/* Pipeline connector + dot */}
              <div className="flex items-center w-full">
                {idx > 0 && (
                  <div className="flex-1 h-0.5 bg-slate-300" />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-600'
                      : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {stagePriorities.length}
                </div>
                {!isLast && (
                  <div className="flex-1 h-0.5 bg-slate-300" />
                )}
              </div>

              {/* Priority names */}
              <div className="mt-3 text-center space-y-1 min-h-[40px]">
                {stagePriorities.map((p) => (
                  <div
                    key={p.rank}
                    className="text-xs text-slate-500 truncate max-w-[140px] mx-auto"
                    title={p.name}
                  >
                    #{p.rank} {p.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
