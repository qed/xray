'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from './ConfirmDialog';
import { emailMatches } from '@/lib/admin/confirm-match';

interface Props {
  userId: string;
  email: string;
  open: boolean;
  onClose: () => void;
}

export default function DeleteUserDialog({ userId, email, open, onClose }: Props) {
  const router = useRouter();
  const [typed, setTyped] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = emailMatches(typed, email) && !submitting;

  async function handleDelete() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Delete failed (${res.status})`);
        setSubmitting(false);
        return;
      }
      router.push('/admin/users');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
      setSubmitting(false);
    }
  }

  return (
    <ConfirmDialog open={open} title="Delete user" onClose={submitting ? () => {} : onClose}>
      <p className="text-sm text-slate-600">
        This permanently removes <span className="font-mono text-slate-900">{email}</span> from
        auth. Their org memberships and department links are removed; their authored content
        (notes, invites, uploads) stays but loses attribution.
      </p>
      <label className="block mt-4 text-xs font-medium text-slate-600">
        Type the user&apos;s email to confirm
      </label>
      <input
        type="text"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder={email}
        className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-red-500 focus:outline-none"
        autoFocus
      />
      <label className="block mt-3 text-xs font-medium text-slate-600">
        Reason (optional, logged)
      </label>
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none"
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
          onClick={handleDelete}
          disabled={!canDelete}
          className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-40"
        >
          {submitting ? 'Deleting…' : 'Delete user'}
        </button>
      </div>
    </ConfirmDialog>
  );
}
