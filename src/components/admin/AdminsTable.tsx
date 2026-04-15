'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminRow {
  user_id: string | null;
  email: string;
  source: 'env' | 'db' | 'both';
  granted_at: string | null;
  is_self: boolean;
}

interface Props {
  rows: AdminRow[];
}

export default function AdminsTable({ rows }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function revoke(row: AdminRow) {
    if (!row.user_id) return;
    if (row.is_self) return;
    if (!confirm(`Revoke admin access for ${row.email}?`)) return;
    setBusy(row.user_id);
    setError(null);
    const res = await fetch('/api/admin/admins', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: row.user_id }),
    });
    setBusy(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Revoke failed');
      return;
    }
    router.refresh();
  }

  return (
    <div>
      {error && <div className="mb-2 text-xs text-red-600">{error}</div>}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Source</th>
              <th className="px-4 py-2 text-left">Granted</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr key={`${r.user_id ?? 'env'}-${i}`}>
                <td className="px-4 py-2">
                  <div className="font-medium text-slate-900">{r.email}</div>
                  {r.user_id && <div className="text-xs text-slate-400 font-mono">{r.user_id}</div>}
                  {r.is_self && <div className="text-xs text-emerald-600">(you)</div>}
                </td>
                <td className="px-4 py-2">
                  {r.source === 'env' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800">env</span>
                  )}
                  {r.source === 'db' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">db</span>
                  )}
                  {r.source === 'both' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800">env + db</span>
                  )}
                </td>
                <td className="px-4 py-2 text-xs text-slate-500">
                  {r.granted_at ? new Date(r.granted_at).toISOString().slice(0, 10) : '—'}
                </td>
                <td className="px-4 py-2 text-right">
                  {r.source === 'env' && !r.user_id ? (
                    <span className="text-xs text-slate-400">env only</span>
                  ) : r.is_self ? (
                    <span className="text-xs text-slate-400">—</span>
                  ) : (
                    <button
                      onClick={() => revoke(r)}
                      disabled={busy === r.user_id}
                      className="px-2 py-1 text-xs rounded-md border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-40"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-400">
                  No admins yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
