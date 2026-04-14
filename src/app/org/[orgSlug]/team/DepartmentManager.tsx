'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Department {
  id: string;
  name: string;
  joined: boolean;
}

interface Props {
  orgId: string;
  orgSlug: string;
  role: string;
  allDepartments: Department[];
}

export default function DepartmentManager({ orgId, orgSlug, role, allDepartments }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [creating, setCreating] = useState(false);

  const joined = allDepartments.filter((d) => d.joined);
  const available = allDepartments.filter((d) => !d.joined);

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Departments</h1>
        <p className="text-slate-500 mt-1">
          Manage which departments you belong to.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Joined departments */}
      {joined.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Your departments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {joined.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between p-4 rounded-lg border-2 border-emerald-500 bg-emerald-50">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{dept.name}</span>
                </div>
                <button
                  onClick={() => handleLeave(dept.id)}
                  disabled={loading === dept.id}
                  className="text-xs text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  {loading === dept.id ? 'Leaving...' : 'Leave'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available departments to join */}
      {available.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Available departments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {available.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between p-4 rounded-lg border-2 border-slate-200 bg-white">
                <span className="text-sm font-medium text-slate-900">{dept.name}</span>
                <button
                  onClick={() => handleJoin(dept.id)}
                  disabled={loading === dept.id}
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                >
                  {loading === dept.id ? 'Joining...' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create new department */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Create department</h2>
        {showCreateForm ? (
          <div className="p-4 rounded-lg border-2 border-dashed border-slate-300 bg-white space-y-3 max-w-md">
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
            className="flex items-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 bg-white hover:border-slate-400 transition-colors"
          >
            <div className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-500">Create new department</span>
          </button>
        )}
      </div>
    </div>
  );
}
