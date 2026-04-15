import { createAdminClient } from '@/lib/supabase/admin';
import { filterUsers } from '@/lib/admin/filter-users';
import UsersTable, { type AdminUserRow } from '@/components/admin/UsersTable';

type Search = {
  q?: string;
  org?: string;
  stranded?: string;
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const q = params.q?.trim().toLowerCase() ?? '';
  const orgFilter = params.org?.trim() ?? '';
  const strandedOnly = params.stranded === '1';

  const admin = createAdminClient();

  const { data: listRes, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) {
    return <div className="text-sm text-red-600">Failed to load users: {listErr.message}</div>;
  }
  const users = listRes?.users ?? [];

  const [
    { data: memberRows },
    { data: deptRows },
    { data: orgs },
  ] = await Promise.all([
    admin
      .from('org_members')
      .select('user_id, role, organizations!inner(id, slug, name)'),
    admin
      .from('member_departments')
      .select('user_id, departments!inner(id, name, org_id)'),
    admin
      .from('organizations')
      .select('slug, name')
      .order('name'),
  ]);

  const membershipsByUser = new Map<string, AdminUserRow['memberships']>();
  for (const m of memberRows ?? []) {
    const org = (m as any).organizations;
    if (!org) continue;
    const list = membershipsByUser.get(m.user_id) ?? [];
    list.push({
      org_id: org.id,
      org_slug: org.slug,
      org_name: org.name,
      role: m.role,
      departments: [],
    });
    membershipsByUser.set(m.user_id, list);
  }
  for (const d of deptRows ?? []) {
    const dept = (d as any).departments;
    if (!dept) continue;
    const list = membershipsByUser.get(d.user_id) ?? [];
    const membership = list.find((x) => x.org_id === dept.org_id);
    if (membership) membership.departments.push(dept.name);
  }

  const rows: AdminUserRow[] = users.map((u) => ({
    id: u.id,
    email: u.email ?? '',
    display_name: (u.user_metadata as any)?.display_name ?? null,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    memberships: membershipsByUser.get(u.id) ?? [],
  }));

  const filtered = filterUsers(rows, { q, org: orgFilter, stranded: strandedOnly });

  filtered.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
        <p className="text-sm text-slate-500 mt-1">
          {filtered.length} of {rows.length} users
        </p>
      </div>
      <UsersTable
        rows={filtered}
        orgs={(orgs ?? []).map((o) => ({ slug: o.slug, name: o.name }))}
        initialQ={q}
        initialOrg={orgFilter}
        initialStranded={strandedOnly}
      />
    </div>
  );
}
