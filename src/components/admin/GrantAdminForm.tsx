'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GrantAdminForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    });
    setBusy(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Grant failed');
      return;
    }
    const body = await res.json();
    setMessage(body.noop ? 'Already an admin.' : 'Admin access granted.');
    setEmail('');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2 rounded-lg border border-dashed border-slate-300 bg-white p-3">
      <div className="flex-1">
        <label className="block text-xs text-slate-500 mb-1">Grant admin to email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={busy || !email.trim()}
        className="px-3 py-1.5 text-sm rounded-md bg-slate-800 text-white disabled:opacity-40"
      >
        {busy ? 'Granting…' : 'Grant'}
      </button>
      {error && <div className="ml-2 text-xs text-red-600">{error}</div>}
      {message && <div className="ml-2 text-xs text-emerald-700">{message}</div>}
    </form>
  );
}
