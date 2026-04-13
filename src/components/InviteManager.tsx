'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Invite {
  id: string;
  code: string;
  email: string | null;
  role: 'owner' | 'admin' | 'member';
  use_count: number;
  max_uses: number | null;
  expires_at: string | null;
}

interface DepartmentOption {
  id: string;
  name: string;
}

interface InviteManagerProps {
  invites: Invite[];
  orgId: string;
  departments?: DepartmentOption[];
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Executive',
  member: 'Team Member',
};

export default function InviteManager({ invites, orgId, departments = [] }: InviteManagerProps) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);
  const [result, setResult] = useState<{ code: string; emailSent: boolean } | null>(null);
  const [error, setError] = useState('');

  function toggleDepartment(deptId: string) {
    setSelectedDeptIds((prev) =>
      prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]
    );
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError('');
    setResult(null);

    const res = await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgId,
        email,
        role,
        departmentIds: selectedDeptIds.length > 0 ? selectedDeptIds : undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to send invite');
    } else {
      setResult({ code: data.code, emailSent: data.emailSent });
      setEmail('');
      setSelectedDeptIds([]);
    }

    setSending(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={sendInvite} className="space-y-3">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="member">Team Member</option>
              <option value="admin">Executive</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40"
          >
            {sending ? 'Sending...' : 'Send Invite'}
          </button>
        </div>

        {departments.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Pre-assign departments <span className="text-slate-400">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <label
                  key={dept.id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer border transition-colors ${
                    selectedDeptIds.includes(dept.id)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDeptIds.includes(dept.id)}
                    onChange={() => toggleDepartment(dept.id)}
                    className="sr-only"
                  />
                  {selectedDeptIds.includes(dept.id) && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  {dept.name}
                </label>
              ))}
            </div>
          </div>
        )}
      </form>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {result && (
        <div className="text-sm bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          {result.emailSent
            ? 'Magic link sent! They\'ll get an email to join.'
            : `Invite created (code: ${result.code}) but email delivery failed. Share the link manually.`}
        </div>
      )}

      {invites.length > 0 && (
        <div className="space-y-2">
          {invites.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-bold text-slate-900">{inv.code}</p>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600">
                    {ROLE_LABELS[inv.role] ?? inv.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {inv.email && <span>{inv.email} · </span>}
                  Used {inv.use_count}{inv.max_uses ? `/${inv.max_uses}` : ''} times
                  {inv.expires_at ? ` · Expires ${new Date(inv.expires_at).toLocaleDateString()}` : ''}
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/invite/${inv.code}`)}
                className="text-xs text-emerald-600 hover:text-emerald-800"
              >
                Copy Link
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
