'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DepartmentSidebar, { type DepartmentSidebarItem } from '@/components/dashboard/DepartmentSidebar';
import type { ColorPalette } from '@/lib/constants';

interface Department {
  id: string;
  slug: string;
  name: string;
  joined: boolean;
  totalPriorities: number;
  completed: number;
  inProgress: number;
  progressPercent: number;
  palette: ColorPalette;
}

interface Props {
  orgId: string;
  orgSlug: string;
  orgName: string;
  role: string;
  sidebarItems: DepartmentSidebarItem[];
  departments: Department[];
}

export default function DepartmentManager({ orgId, orgSlug, orgName, role, sidebarItems, departments }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [creating, setCreating] = useState(false);

  // Sidebar selection (view-only, mirrors dashboard behavior)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const joinedCount = departments.filter((d) => d.joined).length;

  async function handleJoin(deptId: string) {
    setLoading(deptId);
    setError('');
    const res = await fetch('/api/departments/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, departmentIds: [deptId], selfSelect: true }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to join');
    }
    setLoading(null);
    router.refresh();
  }

  async function handleLeave(deptId: string) {
    setLoading(deptId);
    setError('');
    const res = await fetch('/api/departments/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, departmentId: deptId }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to leave');
    }
    setLoading(null);
    router.refresh();
  }

  async function handleCreate() {
    const trimmed = newDeptName.trim();
    if (!trimmed) { setError('Department name cannot be empty'); return; }
    setCreating(true);
    setError('');
    const res = await fetch('/api/departments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, name: trimmed }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to create department');
      setCreating(false);
      return;
    }
    setNewDeptName('');
    setShowCreateForm(false);
    setCreating(false);
    router.refresh();
  }

  // Filter departments for right panel based on sidebar selection
  const visibleDepts = selectedSlug
    ? departments.filter((d) => d.slug === selectedSlug)
    : departments;

  return (
    <div>
      {/* Page header — matches dashboard style */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Departments</h1>
        <p className="text-sm text-slate-500 mt-1">
          {orgName} &middot; {departments.length} Departments &middot; {joinedCount} Joined
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {/* Mobile pill row */}
      <div className="md:hidden mb-4">
        <DepartmentSidebar
          departments={sidebarItems}
          selectedSlug={selectedSlug}
          onSelect={(slug) => setSelectedSlug((prev) => prev === slug ? null : slug)}
        />
      </div>

      {/* Two-panel layout — matches dashboard */}
      <div className="flex gap-6">
        {/* Left sidebar — desktop only */}
        <div className="hidden md:block w-[260px] shrink-0">
          <DepartmentSidebar
            departments={sidebarItems}
            selectedSlug={selectedSlug}
            onSelect={(slug) => setSelectedSlug((prev) => prev === slug ? null : slug)}
          />
        </div>

        {/* Right panel — department membership */}
        <div className="flex-1 min-w-0 space-y-3">
          {visibleDepts.map((dept) => (
            <div
              key={dept.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-white transition-colors"
              style={{ borderLeftWidth: 3, borderLeftColor: dept.palette.primary }}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">{dept.name}</div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-slate-500">{dept.totalPriorities} priorities</span>
                  {dept.inProgress > 0 && (
                    <span className="text-xs font-medium" style={{ color: dept.palette.primary }}>
                      {dept.inProgress} active
                    </span>
                  )}
                  {dept.completed > 0 && (
                    <span className="text-xs text-emerald-600">{dept.completed} done</span>
                  )}
                  {dept.totalPriorities > 0 && (
                    <span className="text-xs text-slate-400">{dept.progressPercent}%</span>
                  )}
                </div>
              </div>

              {dept.joined ? (
                <button
                  onClick={() => handleLeave(dept.id)}
                  disabled={loading === dept.id}
                  className="shrink-0 ml-3 px-3 py-1.5 rounded-lg border-2 border-emerald-500 bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  {loading === dept.id ? 'Leaving...' : 'Joined ✓'}
                </button>
              ) : (
                <button
                  onClick={() => handleJoin(dept.id)}
                  disabled={loading === dept.id}
                  className="shrink-0 ml-3 px-3 py-1.5 rounded-lg border-2 border-slate-200 text-slate-500 text-xs font-medium hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors disabled:opacity-40"
                >
                  {loading === dept.id ? 'Joining...' : 'Join'}
                </button>
              )}
            </div>
          ))}

          {/* Create new department */}
          {!selectedSlug && (
            <>
              {showCreateForm ? (
                <div className="p-4 rounded-lg border-2 border-dashed border-slate-300 bg-white space-y-3">
                  <input
                    type="text"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    placeholder="Department name"
                    autoFocus
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCreate}
                      disabled={creating}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
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
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 w-full p-4 rounded-lg border-2 border-dashed border-slate-300 bg-white hover:border-slate-400 transition-colors"
                >
                  <div className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-500">Create new department</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
