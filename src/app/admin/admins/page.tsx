import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { envBootstrapEmails } from '@/lib/admin/env-admins';
import AdminsTable from '@/components/admin/AdminsTable';
import GrantAdminForm from '@/components/admin/GrantAdminForm';

interface AdminRow {
  user_id: string | null;
  email: string;
  source: 'env' | 'db' | 'both';
  granted_at: string | null;
  is_self: boolean;
}

export default async function AdminsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const selfId = user?.id ?? null;

  const admin = createAdminClient();
  const [
    { data: dbAdmins },
    { data: list },
  ] = await Promise.all([
    admin
      .from('platform_admins')
      .select('user_id, granted_at')
      .order('granted_at', { ascending: false }),
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
  ]);

  const emailById = new Map<string, string>();
  for (const u of list?.users ?? []) {
    if (u.id && u.email) emailById.set(u.id, u.email);
  }

  const dbIds = new Set<string>();
  const rows: AdminRow[] = [];

  for (const row of dbAdmins ?? []) {
    dbIds.add(row.user_id);
    const email = emailById.get(row.user_id) ?? '(unknown)';
    const isEnv = envBootstrapEmails().includes(email.toLowerCase());
    rows.push({
      user_id: row.user_id,
      email,
      source: isEnv ? 'both' : 'db',
      granted_at: row.granted_at,
      is_self: row.user_id === selfId,
    });
  }

  // Env admins that are NOT also in DB
  for (const email of envBootstrapEmails()) {
    const matched = Array.from(emailById.entries()).find(([, e]) => e.toLowerCase() === email);
    const userId = matched?.[0] ?? null;
    if (userId && dbIds.has(userId)) continue; // already represented as 'both'
    rows.push({
      user_id: userId,
      email,
      source: 'env',
      granted_at: null,
      is_self: userId === selfId,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Platform admins</h1>
        <p className="text-sm text-slate-500">
          Env admins come from <code className="text-xs">SUPERADMIN_EMAILS</code> and cannot be revoked from the UI.
        </p>
      </div>
      <GrantAdminForm />
      <AdminsTable rows={rows} />
    </div>
  );
}
