'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATUS_TRANSITIONS, type PriorityStatus } from '@/lib/constants';
import type { DbPriority } from '@/lib/types';
import PriorityNotes from './PriorityNotes';

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  proposed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Needs Review' },
  not_started: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Not Started' },
  in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Progress' },
  complete: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completed' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
};

const STATUS_LABELS: Record<string, string> = {
  approved: 'Approve',
  rejected: 'Reject',
  not_started: 'Not Started',
  in_progress: 'In Progress',
  complete: 'Complete',
};

interface Props {
  priority: DbPriority & { milestone_stage: number };
  role: string;
}

export default function PriorityRow({ priority, role }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({
    name: priority.name,
    what_to_automate: priority.what_to_automate,
    current_state: priority.current_state,
    why_it_matters: priority.why_it_matters,
    estimated_time_savings: priority.estimated_time_savings,
    suggested_approach: priority.suggested_approach,
    success_criteria: priority.success_criteria,
  });

  const status = priority.status as PriorityStatus;
  const badge = STATUS_BADGE[status] ?? STATUS_BADGE.not_started;
  const transitions = STATUS_TRANSITIONS[status] ?? [];

  async function updateStatus(newStatus: string) {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/priorities/${priority.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to update');
    }
    setSaving(false);
    router.refresh();
  }

  async function saveEdits() {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/priorities/${priority.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to save');
    } else {
      setEditing(false);
    }
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl">
      {/* Collapsed row */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
              {priority.rank}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{priority.name}</p>
              {priority.what_to_automate && (
                <p className="text-xs text-slate-500 mt-0.5">{priority.what_to_automate}</p>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-emerald-600">{priority.estimated_time_savings}</p>
            <div className="flex gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400">Effort: {priority.effort || '—'}</span>
              <span className="text-[10px] text-slate-400">Complexity: {priority.complexity || '—'}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 ml-9 flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
          {error && <p className="text-xs text-red-600">{error}</p>}

          {/* Status actions */}
          {status === 'proposed' ? (
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus('approved')}
                disabled={saving}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-40"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus('rejected')}
                disabled={saving}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-40"
              >
                Reject
              </button>
            </div>
          ) : transitions.length > 0 ? (
            <div className="flex gap-2">
              {transitions.map((t) => (
                <button
                  key={t}
                  onClick={() => updateStatus(t)}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium hover:bg-slate-900 disabled:opacity-40"
                >
                  {STATUS_LABELS[t] ?? t}
                </button>
              ))}
            </div>
          ) : null}

          {/* Editable fields */}
          {editing ? (
            <div className="space-y-3">
              {(['name', 'what_to_automate', 'current_state', 'why_it_matters', 'estimated_time_savings', 'suggested_approach', 'success_criteria'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    {field.replace(/_/g, ' ')}
                  </label>
                  <textarea
                    value={draft[field]}
                    onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                    rows={field === 'name' ? 1 : 3}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  onClick={saveEdits}
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-40"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {priority.current_state && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Current State</p>
                  <p className="text-xs text-slate-700">{priority.current_state}</p>
                </div>
              )}
              {priority.why_it_matters && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Why It Matters</p>
                  <p className="text-xs text-slate-700">{priority.why_it_matters}</p>
                </div>
              )}
              {priority.suggested_approach && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Suggested Approach</p>
                  <p className="text-xs text-slate-700">{priority.suggested_approach}</p>
                </div>
              )}
              {priority.success_criteria && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Success Criteria</p>
                  <p className="text-xs text-slate-700">{priority.success_criteria}</p>
                </div>
              )}
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-emerald-600 font-medium hover:text-emerald-800"
              >
                Edit fields
              </button>
            </div>
          )}

          {/* Notes */}
          <PriorityNotes priorityId={priority.id} />
        </div>
      )}
    </div>
  );
}
