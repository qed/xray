'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from './ConfirmDialog';

interface Props {
  userId: string;
  email: string;
  open: boolean;
  onClose: () => void;
}

export default function ImpersonateDialog({ userId, email, open, onClose }: Props) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = reason.trim().length >= 8 && !submitting;

  async function handleStart() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, reason: reason.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? `Failed (${res.status})`);
        setSubmitting(false);
        return;
      }
      router.push(body.landing ?? '/orgs');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
      setSubmitting(false);
    }
  }

  return (
    <ConfirmDialog open={open} title="Impersonate user" onClose={submitting ? () => {} : onClose}>
      <p className="text-sm text-slate-600">
        Start a 30-minute read-only session as{' '}
        <span className="font-mono text-slate-900">{email}</span>. A banner will show on
        every page until you end it. The reason is logged to the audit trail.
      </p>
      <label className="block mt-4 text-xs font-medium text-slate-600">
        Reason (min 8 characters)
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reproducing the department-missing bug they reported"
        rows={3}
        className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none"
        autoFocus
      />
      {error && (
        <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 font-mono">
          {error}
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onClose}
          disabled={submitting}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          onClick={handleStart}
          disabled={!canSubmit}
          className="px-3 py-1.5 text-sm rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-40"
        >
          {submitting ? 'Starting…' : 'Start impersonation'}
        </button>
      </div>
    </ConfirmDialog>
  );
}
