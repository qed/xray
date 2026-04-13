'use client';

import { useState, useEffect } from 'react';
import type { DbDepartment, DbPriority } from '@/lib/types';

interface DeptData {
  department: DbDepartment;
  priorities: (DbPriority & { milestone_stage: number })[];
  teamMembers: { id: string; name: string; title: string; responsibilities: string }[];
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    proposed: number;
    progressPercent: number;
  };
}

interface Props {
  departments: DeptData[];
  orgSlug: string;
  role: string;
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  proposed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Needs Review' },
  not_started: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Not Started' },
  in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Progress' },
  complete: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completed' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
};

export default function TeamView({ departments, orgSlug, role }: Props) {
  const storageKey = `team_dept_${orgSlug}`;
  const [activeIdx, setActiveIdx] = useState(0);

  // Restore last-viewed department from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const idx = departments.findIndex((d) => d.department.id === stored);
      if (idx >= 0) setActiveIdx(idx);
    }
  }, [departments, storageKey]);

  function switchDept(idx: number) {
    setActiveIdx(idx);
    localStorage.setItem(storageKey, departments[idx].department.id);
  }

  const active = departments[activeIdx];
  if (!active) return null;

  const { department, priorities, teamMembers, stats } = active;

  // Filter out rejected for the default list
  const visiblePriorities = priorities.filter((p) => p.status !== 'rejected');

  return (
    <div className="space-y-8">
      {/* Department tabs (multi-department) */}
      {departments.length > 1 && (
        <div className="flex gap-1 border-b border-slate-200">
          {departments.map((d, idx) => (
            <button
              key={d.department.id}
              onClick={() => switchDept(idx)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                idx === activeIdx
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {d.department.name}
              {d.stats.proposed > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                  {d.stats.proposed}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{department.name}</h1>
        {department.mission && <p className="text-slate-500 mt-1">{department.mission}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-1">Total Priorities</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
          <p className="text-xs text-slate-500 mt-1">Completed</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
          <p className="text-xs text-slate-500 mt-1">In Progress</p>
        </div>
        {stats.proposed > 0 ? (
          <div className="bg-white border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.proposed}</p>
            <p className="text-xs text-slate-500 mt-1">Needs Review</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">{stats.notStarted}</p>
            <p className="text-xs text-slate-500 mt-1">Not Started</p>
          </div>
        )}
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
      {visiblePriorities.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            AI & Automation Priorities
            <span className="text-sm font-normal text-slate-400 ml-2">{visiblePriorities.length} total</span>
          </h2>
          <div className="space-y-3">
            {visiblePriorities.map((p) => {
              const badge = STATUS_BADGE[p.status] ?? STATUS_BADGE.not_started;
              return (
                <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {p.rank}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                        {p.what_to_automate && (
                          <p className="text-xs text-slate-500 mt-0.5">{p.what_to_automate}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-emerald-600">{p.estimated_time_savings}</p>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400">Effort: {p.effort || '—'}</span>
                        <span className="text-[10px] text-slate-400">Complexity: {p.complexity || '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 ml-9">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-sm">No priorities yet for this department.</p>
        </div>
      )}
    </div>
  );
}
