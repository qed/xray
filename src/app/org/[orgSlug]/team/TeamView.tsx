'use client';

import type { RankedOpportunity } from '@/lib/types';

interface Props {
  department: {
    id: string;
    name: string;
    mission: string;
    scope: string;
    tools: string[];
    single_points_of_failure: string[];
    pain_points: string[];
  };
  priorities: RankedOpportunity[];
  teamMembers: { id: string; name: string; title: string; responsibilities: string }[];
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    progressPercent: number;
  };
}

export default function TeamView({ department, priorities, teamMembers, stats }: Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{department.name}</h1>
        {department.mission && <p className="text-slate-500 mt-1">{department.mission}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.progressPercent}%</p>
          <p className="text-xs text-slate-500 mt-1">Readiness</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
          <p className="text-xs text-slate-500 mt-1">Completed</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
          <p className="text-xs text-slate-500 mt-1">In Progress</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-400">{stats.notStarted}</p>
          <p className="text-xs text-slate-500 mt-1">Not Started</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${stats.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Team members */}
      {teamMembers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Team Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teamMembers.map((tm) => (
              <div key={tm.id} className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-900">{tm.name}</p>
                <p className="text-xs text-slate-500">{tm.title}</p>
                {tm.responsibilities && (
                  <p className="text-xs text-slate-400 mt-1">{tm.responsibilities}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priorities */}
      {priorities.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            AI & Automation Priorities
            <span className="text-sm font-normal text-slate-400 ml-2">{priorities.length} total</span>
          </h2>
          <div className="space-y-3">
            {priorities.map((opp) => (
              <div key={opp.id} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {opp.rank}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{opp.name}</p>
                      {opp.whatToAutomate && (
                        <p className="text-xs text-slate-500 mt-0.5">{opp.whatToAutomate}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-emerald-600">{opp.estimatedTimeSavings}</p>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">Effort: {opp.effort || '—'}</span>
                      <span className="text-[10px] text-slate-400">Complexity: {opp.complexity || '—'}</span>
                    </div>
                  </div>
                </div>
                {/* Status badge */}
                <div className="mt-2 ml-9">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    opp.milestoneStage >= 3
                      ? 'bg-emerald-100 text-emerald-700'
                      : opp.milestoneStage > 0
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {opp.milestoneStage >= 3 ? 'Completed' : opp.milestoneStage > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
