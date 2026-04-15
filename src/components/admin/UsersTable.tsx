'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface AdminUserMembership {
  org_id: string;
  org_slug: string;
  org_name: string;
  role: string;
  departments: string[];
}

export interface AdminUserRow {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  memberships: AdminUserMembership[];
}

interface OrgOption {
  slug: string;
  name: string;
}

interface Props {
  rows: AdminUserRow[];
  orgs: OrgOption[];
  initialQ: string;
  initialOrg: string;
  initialStranded: boolean;
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

export default function UsersTable({ rows, orgs, initialQ, initialOrg, initialStranded }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQ);
  const [org, setOrg] = useState(initialOrg);
  const [stranded, setStranded] = useState(initialStranded);

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams.toString());
      if (q) next.set('q', q); else next.delete('q');
      if (org) next.set('org', org); else next.delete('org');
      if (stranded) next.set('stranded', '1'); else next.delete('stranded');
      const qs = next.toString();
      router.replace(qs ? `/admin/users?${qs}` : '/admin/users');
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, org, stranded]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by email, name, or ID"
          className="flex-1 min-w-64 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none"
        />
        <select
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All orgs</option>
          {orgs.map((o) => (
            <option key={o.slug} value={o.slug}>{o.name}</option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={stranded}
            onChange={(e) => setStranded(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Stranded only
        </label>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Email</th>
              <th className="text-left px-4 py-2 font-medium">Memberships</th>
              <th className="text-left px-4 py-2 font-medium">Created</th>
              <th className="text-left px-4 py-2 font-medium">Last sign-in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No users match the current filters.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => router.push(`/admin/users/${r.id}`)}
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${r.id}`}
                    className="text-slate-900 font-medium hover:text-emerald-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {r.email || '(no email)'}
                  </Link>
                  {r.display_name && (
                    <div className="text-xs text-slate-500">{r.display_name}</div>
                  )}
                  <div className="text-xs text-slate-400 font-mono">{r.id.slice(0, 8)}</div>
                </td>
                <td className="px-4 py-3">
                  {r.memberships.length === 0 ? (
                    <span className="text-xs text-slate-400">Stranded</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {r.memberships.map((m) => (
                        <div key={m.org_id} className="text-xs">
                          <span className="font-medium text-slate-700">{m.org_name}</span>
                          <span className="text-slate-400"> · {m.role}</span>
                          {m.departments.length > 0 && (
                            <span className="text-slate-400"> · {m.departments.join(', ')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600 text-xs">{fmtDate(r.created_at)}</td>
                <td className="px-4 py-3 text-slate-600 text-xs">{fmtDate(r.last_sign_in_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
