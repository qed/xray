'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATUS_TRANSITIONS, type PriorityStatus } from '@/lib/constants';

const STATUS_LABELS: Record<string, string> = {
  complete: 'Completed',
  in_progress: 'In Progress',
  proposed: 'Proposed',
  not_started: 'Not Started',
  rejected: 'Rejected',
  approved: 'Approved',
};

const ADVANCE_LABELS: Record<string, string> = {
  approved: 'Approve',
  rejected: 'Reject',
  in_progress: 'Start',
  complete: 'Complete',
  not_started: 'Begin',
};

const STATUS_COLORS: Record<string, string> = {
  complete: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  proposed: 'bg-purple-100 text-purple-700 border-purple-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

const DEFAULT_STATUS_COLOR = 'bg-slate-100 text-slate-500 border-slate-200';

interface StatusToggleProps {
  priorityId: string;
  initialStatus: string;
}

export default function StatusToggle({ priorityId, initialStatus }: StatusToggleProps) {
  const router = useRouter();
  const [localStatus, setLocalStatus] = useState(initialStatus);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const nextStatuses = STATUS_TRANSITIONS[localStatus as PriorityStatus] ?? [];

  async function handleAdvance(nextStatus: string) {
    setUpdating(true);
    setError('');
    const prevStatus = localStatus;
    // Optimistic update — approved auto-transitions to not_started at API layer
    const effectiveStatus = nextStatus === 'approved' ? 'not_started' : nextStatus;
    setLocalStatus(effectiveStatus);
    try {
      const res = await fetch(`/api/priorities/${priorityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        setLocalStatus(prevStatus);
        setError(data.error || 'Failed to update status');
      } else {
        router.refresh();
      }
    } catch {
      setLocalStatus(prevStatus);
      setError('Network error — please try again');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md border ${STATUS_COLORS[localStatus] ?? DEFAULT_STATUS_COLOR}`}>
          {STATUS_LABELS[localStatus] ?? localStatus}
        </span>
        {nextStatuses.map((next) => (
          <button
            key={next}
            onClick={() => handleAdvance(next)}
            disabled={updating}
            className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md border font-medium transition-colors disabled:opacity-40 ${
              next === 'rejected'
                ? 'border-red-200 text-red-600 hover:bg-red-50'
                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {updating ? 'Updating...' : (ADVANCE_LABELS[next] ?? next)} →
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
