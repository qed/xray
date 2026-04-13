'use client';

import { useState, useEffect } from 'react';
import type { DbDepartment, DbPriority } from '@/lib/types';
import ApprovalBanner from './ApprovalBanner';
import PriorityRow from './PriorityRow';

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

      {/* Approval banner */}
      <ApprovalBanner
        proposedIds={priorities.filter((p) => p.status === 'proposed').map((p) => p.id)}
      />

      {/* Priorities */}
      {visiblePriorities.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            AI & Automation Priorities
            <span className="text-sm font-normal text-slate-400 ml-2">{visiblePriorities.length} total</span>
          </h2>
          <div className="space-y-3">
            {visiblePriorities.map((p) => (
              <PriorityRow key={p.id} priority={p} role={role} />
            ))}
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
