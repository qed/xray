'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useState } from 'react';

export interface AuditRow {
  id: string;
  action: string;
  operator_id: string | null;
  operator_email: string | null;
  target_user_id: string | null;
  target_email: string | null;
  target_org_id: string | null;
  before: unknown;
  after: unknown;
  reason: string | null;
  created_at: string;
}

interface Props {
  rows: AuditRow[];
  actions: string[];
  initialAction: string;
  nextCursor: string | null;
  currentQuery: Record<string, string | undefined>;
}

function fmt(iso: string): string {
  return new Date(iso).toISOString().replace('T', ' ').slice(0, 19) + 'Z';
}

export default function AuditLogTable({
  rows,
  actions,
  initialAction,
  nextCursor,
  currentQuery,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState<string | null>(null);

  function setAction(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set('action', value); else next.delete('action');
    next.delete('before'); // reset pagination on filter change
    const qs = next.toString();
    router.push(qs ? `/admin/audit?${qs}` : '/admin/audit');
  }

  function nextPageHref(): string | null {
    if (!nextCursor) return null;
    const next = new URLSearchParams(searchParams.toString());
    next.set('before', nextCursor);
    return `/admin/audit?${next.toString()}`;
  }

  const next = nextPageHref();
  const hasFilters = Boolean(
    currentQuery.action || currentQuery.operator || currentQuery.target || currentQuery.before
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <select
          value={initialAction}
          onChange={(e) => setAction(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        {hasFilters && (
          <Link
            href="/admin/audit"
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Clear filters
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-2 font-medium">When</th>
              <th className="text-left px-4 py-2 font-medium">Action</th>
              <th className="text-left px-4 py-2 font-medium">Operator</th>
              <th className="text-left px-4 py-2 font-medium">Target</th>
              <th className="text-left px-4 py-2 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No audit entries yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <Fragment key={r.id}>
                <tr
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                >
                  <td className="px-4 py-2 text-xs font-mono text-slate-600">{fmt(r.created_at)}</td>
                  <td className="px-4 py-2">
                    <span className="font-mono text-xs text-slate-900">{r.action}</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-700">
                    {r.operator_email ?? <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-700">
                    {r.target_email ?? <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {r.reason ?? <span className="text-slate-400">—</span>}
                  </td>
                </tr>
                {expanded === r.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-slate-500 uppercase tracking-wide mb-1">Before</div>
                          <pre className="p-2 rounded bg-white border border-slate-200 overflow-auto max-h-64 font-mono text-[11px]">
                            {r.before ? JSON.stringify(r.before, null, 2) : '—'}
                          </pre>
                        </div>
                        <div>
                          <div className="text-slate-500 uppercase tracking-wide mb-1">After</div>
                          <pre className="p-2 rounded bg-white border border-slate-200 overflow-auto max-h-64 font-mono text-[11px]">
                            {r.after ? JSON.stringify(r.after, null, 2) : '—'}
                          </pre>
                        </div>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-500 font-mono">
                        id={r.id} · operator_id={r.operator_id ?? '—'} · target_user_id={r.target_user_id ?? '—'}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {next && (
        <div className="flex justify-center">
          <Link
            href={next}
            className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Older entries →
          </Link>
        </div>
      )}
    </div>
  );
}
