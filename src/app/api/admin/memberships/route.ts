import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPlatformAdmin } from '@/lib/admin/is-platform-admin';

type Role = 'owner' | 'admin' | 'member';
const ROLES: Role[] = ['owner', 'admin', 'member'];

async function guard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new NextResponse(null, { status: 404 }) };
  if (!(await isPlatformAdmin(user.id, user.email))) {
    return { error: new NextResponse(null, { status: 404 }) };
  }
  return { user };
}

// Add membership: body = { user_id, org_id, role, department_ids? }
export async function POST(req: NextRequest) {
  const g = await guard();
  if ('error' in g) return g.error;

  const body = await req.json().catch(() => ({}));
  const { user_id, org_id, role, department_ids } = body as {
    user_id?: string;
    org_id?: string;
    role?: Role;
    department_ids?: string[];
  };
  if (!user_id || !org_id || !role || !ROLES.includes(role)) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotent: if already a member, return existing
  const { data: existing } = await admin
    .from('org_members')
    .select('id, role')
    .eq('org_id', org_id)
    .eq('user_id', user_id)
    .maybeSingle();

  let membershipId: string;
  if (existing) {
    membershipId = existing.id;
  } else {
    const { data: inserted, error: insErr } = await admin
      .from('org_members')
      .insert({ org_id, user_id, role })
      .select('id')
      .single();
    if (insErr || !inserted) {
      return NextResponse.json({ error: insErr?.message ?? 'Insert failed' }, { status: 500 });
    }
    membershipId = inserted.id;

    await admin.rpc('log_admin_action', {
      p_operator_id: g.user.id,
      p_action: 'add_membership',
      p_target_user_id: user_id,
      p_target_org_id: org_id,
      p_before: null,
      p_after: { role },
      p_reason: null,
    });
  }

  if (Array.isArray(department_ids) && department_ids.length > 0) {
    const rows = department_ids.map((dept_id) => ({
      user_id,
      department_id: dept_id,
      created_by: g.user.id,
    }));
    await admin.from('member_departments').upsert(rows, {
      onConflict: 'user_id,department_id',
      ignoreDuplicates: true,
    });
  }

  return NextResponse.json({ ok: true, membership_id: membershipId });
}

// Remove membership: body = { membership_id }
export async function DELETE(req: NextRequest) {
  const g = await guard();
  if ('error' in g) return g.error;

  const body = await req.json().catch(() => ({}));
  const membership_id = typeof body.membership_id === 'string' ? body.membership_id : '';
  if (!membership_id) {
    return NextResponse.json({ error: 'Missing membership_id' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: row } = await admin
    .from('org_members')
    .select('id, user_id, org_id, role')
    .eq('id', membership_id)
    .maybeSingle();
  if (!row) return NextResponse.json({ error: 'Membership not found' }, { status: 404 });

  await admin.rpc('log_admin_action', {
    p_operator_id: g.user.id,
    p_action: 'remove_membership',
    p_target_user_id: row.user_id,
    p_target_org_id: row.org_id,
    p_before: { role: row.role },
    p_after: null,
    p_reason: null,
  });

  const { error: delErr } = await admin.from('org_members').delete().eq('id', membership_id);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

// Change role: body = { membership_id, role }
export async function PATCH(req: NextRequest) {
  const g = await guard();
  if ('error' in g) return g.error;

  const body = await req.json().catch(() => ({}));
  const membership_id = typeof body.membership_id === 'string' ? body.membership_id : '';
  const role = body.role as Role | undefined;
  if (!membership_id || !role || !ROLES.includes(role)) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: row } = await admin
    .from('org_members')
    .select('id, user_id, org_id, role')
    .eq('id', membership_id)
    .maybeSingle();
  if (!row) return NextResponse.json({ error: 'Membership not found' }, { status: 404 });

  if (row.role === role) return NextResponse.json({ ok: true, noop: true });

  await admin.rpc('log_admin_action', {
    p_operator_id: g.user.id,
    p_action: 'change_membership_role',
    p_target_user_id: row.user_id,
    p_target_org_id: row.org_id,
    p_before: { role: row.role },
    p_after: { role },
    p_reason: null,
  });

  const { error: updErr } = await admin
    .from('org_members')
    .update({ role })
    .eq('id', membership_id);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
