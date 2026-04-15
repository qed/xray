import { createAdminClient } from '@/lib/supabase/admin';
import AuditLogTable, { type AuditRow } from '@/components/admin/AuditLogTable';

type Search = {
  action?: string;
  operator?: string;
  target?: string;
  before?: string; // ISO cursor: show rows with created_at < before
};

const PAGE_SIZE = 50;

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from('admin_audit_log')
    .select('id, operator_id, target_user_id, target_org_id, action, before, after, reason, created_at')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  if (params.action) query = query.eq('action', params.action);
  if (params.operator) query = query.eq('operator_id', params.operator);
  if (params.target) query = query.eq('target_user_id', params.target);
  if (params.before) query = query.lt('created_at', params.before);

  const { data, error } = await query;
  if (error) {
    return <div className="text-sm text-red-600">Failed to load audit log: {error.message}</div>;
  }

  // Hydrate operator + target emails via listUsers (cheap vs building a user lookup endpoint).
  const { data: usersRes } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailById = new Map<string, string>();
  for (const u of usersRes?.users ?? []) {
    if (u.email) emailById.set(u.id, u.email);
  }

  const rows: AuditRow[] = (data ?? []).map((r: any) => ({
    id: r.id,
    action: r.action,
    operator_id: r.operator_id,
    operator_email: emailById.get(r.operator_id) ?? null,
    target_user_id: r.target_user_id,
    target_email: r.target_user_id ? emailById.get(r.target_user_id) ?? null : null,
    target_org_id: r.target_org_id,
    before: r.before,
    after: r.after,
    reason: r.reason,
    created_at: r.created_at,
  }));

  // Get distinct action types from this page for the filter dropdown.
  const { data: actionsRes } = await admin
    .from('admin_audit_log')
    .select('action')
    .limit(500);
  const actions = Array.from(new Set((actionsRes ?? []).map((r: any) => r.action))).sort();

  const nextCursor = rows.length === PAGE_SIZE ? rows[rows.length - 1].created_at : null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Audit log</h1>
        <p className="text-sm text-slate-500 mt-1">
          {rows.length} entries{params.action ? ` · action=${params.action}` : ''}
        </p>
      </div>
      <AuditLogTable
        rows={rows}
        actions={actions}
        initialAction={params.action ?? ''}
        nextCursor={nextCursor}
        currentQuery={params}
      />
    </div>
  );
}
