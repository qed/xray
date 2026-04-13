'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DepartmentOption {
  id: string;
  name: string;
}

interface Props {
  orgId: string;
  orgSlug: string;
  departments: DepartmentOption[];
  role: string;
}

export default function DepartmentPicker({ orgId, orgSlug, departments, role }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    if (selected.length === 0) return;
    setSaving(true);
    setError('');

    const res = await fetch('/api/departments/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgId,
        departmentIds: selected,
        selfSelect: true,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to save');
      setSaving(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Team</h1>
        <p className="text-slate-500 mt-1">
          Select the department{departments.length > 1 ? 's' : ''} you belong to.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map((dept) => (
            <button
              key={dept.id}
              type="button"
              onClick={() => toggle(dept.id)}
              className={`text-left p-4 rounded-lg border-2 transition-colors ${
                selected.includes(dept.id)
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                  selected.includes(dept.id)
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-slate-300'
                }`}>
                  {selected.includes(dept.id) && (
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSave}
          disabled={selected.length === 0 || saving}
          className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
        >
          {saving ? 'Saving...' : `Continue with ${selected.length || 'no'} department${selected.length !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
}
