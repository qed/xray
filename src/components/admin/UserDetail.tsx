'use client';

import { useState } from 'react';
import DeleteUserDialog from './DeleteUserDialog';
import ImpersonateDialog from './ImpersonateDialog';

interface UserInfo {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

interface Membership {
  membership_id: string;
  role: string;
  org_id: string;
  org_slug: string;
  org_name: string;
  departments: string[];
}

interface AuditEntry {
  id: string;
  action: string;
  operator_id: string | null;
  created_at: string;
  reason: string | null;
}

interface Props {
  user: UserInfo;
  memberships: Membership[];
  audit: AuditEntry[];
}

function fmt(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

export default function UserDetail({ user, memberships, audit }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [impersonateOpen, setImpersonateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {user.email || '(no email)'}
          </h1>
          {user.display_name && (
            <div className="text-sm text-slate-500 mt-0.5">{user.display_name}</div>
          )}
          <div className="text-xs text-slate-400 font-mono mt-1">{user.id}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setImpersonateOpen(true)}
            className="px-3 py-1.5 text-sm rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700"
          >
            Impersonate
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
          >
            Delete user
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">Created</div>
          <div className="text-sm text-slate-800 mt-0.5">{fmt(user.created_at)}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">Last sign-in</div>
          <div className="text-sm text-slate-800 mt-0.5">{fmt(user.last_sign_in_at)}</div>
        </div>
      </div>

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
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{m.org_name}</div>
                    <div className="text-xs text-slate-500 font-mono">{m.org_slug}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {m.role}
                  </span>
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
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
          Recent audit activity
        </h2>
        {audit.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-400 text-center">
            No audit log entries for this user
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
            {audit.map((a) => (
              <div key={a.id} className="px-4 py-2 text-sm flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-slate-700">{a.action}</span>
                  {a.reason && <span className="ml-2 text-xs text-slate-500">· {a.reason}</span>}
                </div>
                <span className="text-xs text-slate-400">{fmt(a.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <DeleteUserDialog
        userId={user.id}
        email={user.email}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
      <ImpersonateDialog
        userId={user.id}
        email={user.email}
        open={impersonateOpen}
        onClose={() => setImpersonateOpen(false)}
      />
    </div>
  );
}
