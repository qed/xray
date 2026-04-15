import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import UserDetail from '@/components/admin/UserDetail';

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: userRes, error: userErr } = await admin.auth.admin.getUserById(id);
  if (userErr || !userRes?.user) notFound();

  const target = userRes.user;

  const [
    { data: memberRows },
    { data: deptRows },
    { data: auditRows },
    { data: orgRows },
  ] = await Promise.all([
    admin
      .from('org_members')
      .select('id, role, organizations!inner(id, slug, name)')
      .eq('user_id', id),
    admin
      .from('member_departments')
      .select('id, departments!inner(id, name, org_id)')
      .eq('user_id', id),
    admin
      .from('admin_audit_log')
      .select('id, action, operator_id, created_at, reason, before, after')
      .eq('target_user_id', id)
      .order('created_at', { ascending: false })
      .limit(10),
    admin
      .from('organizations')
      .select('id, slug, name')
      .order('name'),
  ]);

  const memberships = (memberRows ?? []).map((m: any) => ({
    membership_id: m.id,
    role: m.role as string,
    org_id: m.organizations.id as string,
    org_slug: m.organizations.slug as string,
    org_name: m.organizations.name as string,
    departments: (deptRows ?? [])
      .filter((d: any) => d.departments?.org_id === m.organizations.id)
      .map((d: any) => d.departments.name as string),
  }));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users" className="text-xs text-slate-500 hover:text-slate-800">
          ← Back to users
        </Link>
      </div>
      <UserDetail
        user={{
          id: target.id,
          email: target.email ?? '',
          display_name: (target.user_metadata as any)?.display_name ?? null,
          created_at: target.created_at,
          last_sign_in_at: target.last_sign_in_at ?? null,
        }}
        memberships={memberships}
        audit={(auditRows ?? []).map((a: any) => ({
          id: a.id,
          action: a.action,
          operator_id: a.operator_id,
          created_at: a.created_at,
          reason: a.reason,
        }))}
        orgs={(orgRows ?? []).map((o: any) => ({ id: o.id, slug: o.slug, name: o.name }))}
      />
    </div>
  );
}
