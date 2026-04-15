'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'owner' | 'admin' | 'member';

interface Membership {
  membership_id: string;
  role: string;
  org_id: string;
  org_slug: string;
  org_name: string;
  departments: string[];
}

interface OrgOption {
  id: string;
  slug: string;
  name: string;
}

interface Props {
  userId: string;
  memberships: Membership[];
  orgs: OrgOption[];
}

export default function MembershipEditor({ userId, memberships, orgs }: Props) {
  const router = useRouter();
  const [addOrg, setAddOrg] = useState('');
  const [addRole, setAddRole] = useState<Role>('member');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function changeRole(membership_id: string, role: Role, currentRole: string) {
    if (role === currentRole) return;
    if (!confirm(`Change role from ${currentRole} to ${role}?`)) return;
    setBusy(membership_id);
    setError(null);
    const res = await fetch('/api/admin/memberships', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membership_id, role }),
    });
    setBusy(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Failed');
      return;
    }
    router.refresh();
  }

  async function remove(membership_id: string, orgName: string) {
    if (!confirm(`Remove user from ${orgName}? This also removes their department assignments.`)) return;
    setBusy(membership_id);
    setError(null);
    const res = await fetch('/api/admin/memberships', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membership_id }),
    });
    setBusy(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Failed');
      return;
    }
    router.refresh();
  }

  async function addMembership(e: React.FormEvent) {
    e.preventDefault();
    if (!addOrg) return;
    setBusy('add');
    setError(null);
    const res = await fetch('/api/admin/memberships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, org_id: addOrg, role: addRole }),
    });
    setBusy(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Failed');
      return;
    }
    setAddOrg('');
    setAddRole('member');
    router.refresh();
  }

  const existingOrgIds = new Set(memberships.map((m) => m.org_id));
  const availableOrgs = orgs.filter((o) => !existingOrgIds.has(o.id));

  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
        Memberships
      </h2>
      {memberships.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-400 text-center">
          No org memberships
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
          {memberships.map((m) => (
            <div key={m.membership_id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{m.org_name}</div>
                  <div className="text-xs text-slate-500 font-mono">{m.org_slug}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.membership_id, e.target.value as Role, m.role)}
                    disabled={busy === m.membership_id}
                    className="text-xs rounded-md border border-slate-300 px-2 py-1"
                  >
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                  </select>
                  <button
                    onClick={() => remove(m.membership_id, m.org_name)}
                    disabled={busy === m.membership_id}
                    className="px-2 py-1 text-xs rounded-md border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
              {m.departments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.departments.map((d) => (
                    <span
                      key={d}
                      className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {availableOrgs.length > 0 && (
        <form onSubmit={addMembership} className="mt-3 flex items-end gap-2 rounded-lg border border-dashed border-slate-300 bg-white p-3">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">Add to org</label>
            <select
              value={addOrg}
              onChange={(e) => setAddOrg(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            >
              <option value="">Select org…</option>
              {availableOrgs.map((o) => (
                <option key={o.id} value={o.id}>{o.name} ({o.slug})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Role</label>
            <select
              value={addRole}
              onChange={(e) => setAddRole(e.target.value as Role)}
              className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            >
              <option value="member">member</option>
              <option value="admin">admin</option>
              <option value="owner">owner</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={busy === 'add' || !addOrg}
            className="px-3 py-1.5 text-sm rounded-md bg-slate-800 text-white disabled:opacity-40"
          >
            {busy === 'add' ? 'Adding…' : 'Add'}
          </button>
        </form>
      )}

      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
    </section>
  );
}
