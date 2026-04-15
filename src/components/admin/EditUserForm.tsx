'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  userId: string;
  email: string;
  displayName: string | null;
}

export default function EditUserForm({ userId, email, displayName }: Props) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState(email);
  const [newName, setNewName] = useState(displayName ?? '');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    if (newEmail.trim() === email) return;
    if (!confirm(`Change email to ${newEmail}? Supabase will send a confirmation email to the new address.`)) return;
    setBusy('email');
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/admin/users/${userId}/email`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail.trim() }),
    });
    setBusy(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Update failed');
      return;
    }
    setMessage('Confirmation email sent to new address.');
    router.refresh();
  }

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    if ((newName.trim() || null) === (displayName ?? null)) return;
    setBusy('name');
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/admin/users/${userId}/display-name`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: newName }),
    });
    setBusy(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Update failed');
      return;
    }
    setMessage('Display name updated.');
    router.refresh();
  }

  async function resend(type: 'invite' | 'recovery') {
    setBusy(type);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/admin/users/${userId}/resend-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    setBusy(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Failed to send');
      return;
    }
    setMessage(type === 'invite' ? 'Invite link generated and emailed.' : 'Password reset link generated and emailed.');
    router.refresh();
  }

  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
        Edit
      </h2>
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        <form onSubmit={saveEmail} className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={busy === 'email' || newEmail.trim() === email}
            className="px-3 py-1.5 text-sm rounded-md bg-slate-800 text-white disabled:opacity-40"
          >
            {busy === 'email' ? 'Saving…' : 'Save email'}
          </button>
        </form>

        <form onSubmit={saveName} className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">Display name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="(none)"
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={busy === 'name' || (newName.trim() || null) === (displayName ?? null)}
            className="px-3 py-1.5 text-sm rounded-md bg-slate-800 text-white disabled:opacity-40"
          >
            {busy === 'name' ? 'Saving…' : 'Save name'}
          </button>
        </form>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => resend('invite')}
            disabled={busy !== null}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            {busy === 'invite' ? 'Sending…' : 'Resend invite'}
          </button>
          <button
            onClick={() => resend('recovery')}
            disabled={busy !== null}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            {busy === 'recovery' ? 'Sending…' : 'Send password reset'}
          </button>
        </div>

        {message && <div className="text-xs text-emerald-700">{message}</div>}
        {error && <div className="text-xs text-red-600">{error}</div>}
      </div>
    </section>
  );
}
