'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface DepartmentOption {
  id: string;
  name: string;
}

interface Props {
  departments: DeptData[];
  orgSlug: string;
  orgId: string;
  role: string;
  unjoinedDepartments: DepartmentOption[];
}

export default function TeamView({ departments, orgSlug, orgId, role, unjoinedDepartments }: Props) {
  const router = useRouter();
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

  const [leaving, setLeaving] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState<string | null>(null);
  const [showJoin, setShowJoin] = useState(false);
  const [joinSelected, setJoinSelected] = useState<string[]>([]);
  const [joining, setJoining] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState('');

  function switchDept(idx: number) {
    setActiveIdx(idx);
    localStorage.setItem(storageKey, departments[idx].department.id);
  }

  async function handleLeave(deptId: string) {
    setLeaving(deptId);
    setActionError('');
    const res = await fetch('/api/departments/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, departmentId: deptId }),
    });
    if (!res.ok) {
      const data = await res.json();
      setActionError(data.error || 'Failed to leave department');
      setLeaving(null);
      return;
    }
    setConfirmLeave(null);
    setLeaving(null);
    router.refresh();
  }

  async function handleJoin() {
    if (joinSelected.length === 0) return;
    setJoining(true);
    setActionError('');
    const res = await fetch('/api/departments/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, departmentIds: joinSelected, selfSelect: true }),
    });
    if (!res.ok) {
      const data = await res.json();
      setActionError(data.error || 'Failed to join');
      setJoining(false);
      return;
    }
    setJoinSelected([]);
    setShowJoin(false);
    router.refresh();
  }

  async function handleCreateDept() {
    const trimmed = newDeptName.trim();
    if (!trimmed) { setActionError('Department name cannot be empty'); return; }
    setCreating(true);
    setActionError('');
    const res = await fetch('/api/departments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, name: trimmed }),
    });
    if (!res.ok) {
      const data = await res.json();
      setActionError(data.error || 'Failed to create department');
      setCreating(false);
      return;
    }
    setNewDeptName('');
    setShowCreateForm(false);
    router.refresh();
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

      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{department.name}</h1>
          {department.mission && <p className="text-slate-500 mt-1">{department.mission}</p>}
        </div>
        {confirmLeave === department.id ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Leave {department.name}?</span>
            <button
              onClick={() => handleLeave(department.id)}
              disabled={leaving === department.id}
              className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-40 transition-colors"
            >
              {leaving === department.id ? 'Leaving...' : 'Confirm'}
            </button>
            <button
              onClick={() => setConfirmLeave(null)}
              className="px-3 py-1 rounded-lg text-slate-500 text-xs font-medium hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setConfirmLeave(department.id); setActionError(''); }}
            className="px-3 py-1.5 rounded-lg text-slate-400 text-xs font-medium hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            Leave
          </button>
        )}
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

      {/* Join additional departments */}
      <div className="border-t border-slate-200 pt-6">
        {showJoin ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Join a department</h2>
              <button
                onClick={() => { setShowJoin(false); setJoinSelected([]); setShowCreateForm(false); setActionError(''); }}
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>

            {unjoinedDepartments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unjoinedDepartments.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setJoinSelected((prev) =>
                      prev.includes(dept.id) ? prev.filter((x) => x !== dept.id) : [...prev, dept.id]
                    )}
                    className={`text-left p-4 rounded-lg border-2 transition-colors ${
                      joinSelected.includes(dept.id)
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        joinSelected.includes(dept.id)
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-slate-300'
                      }`}>
                        {joinSelected.includes(dept.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{dept.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Create new department option */}
            {showCreateForm ? (
              <div className="p-4 rounded-lg border-2 border-dashed border-slate-300 bg-white space-y-3">
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateDept()}
                  placeholder="Department name"
                  autoFocus
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCreateDept}
                    disabled={creating}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                  >
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    onClick={() => { setShowCreateForm(false); setNewDeptName(''); }}
                    className="px-3 py-1.5 rounded-lg text-slate-500 text-xs font-medium hover:text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="text-left p-4 rounded-lg border-2 border-dashed border-slate-300 bg-white hover:border-slate-400 transition-colors w-full"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-500">Create new department</span>
                </div>
              </button>
            )}

            {joinSelected.length > 0 && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
              >
                {joining ? 'Joining...' : `Join ${joinSelected.length} department${joinSelected.length !== 1 ? 's' : ''}`}
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => { setShowJoin(true); setActionError(''); }}
            className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
          >
            + Join another department
          </button>
        )}
      </div>
    </div>
  );
}
