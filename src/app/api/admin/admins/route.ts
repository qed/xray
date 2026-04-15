import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPlatformAdmin } from '@/lib/admin/is-platform-admin';

async function guard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new NextResponse(null, { status: 404 }) };
  if (!(await isPlatformAdmin(user.id, user.email))) {
    return { error: new NextResponse(null, { status: 404 }) };
  }
  return { user };
}

// Grant: body = { email }
export async function POST(req: NextRequest) {
  const g = await guard();
  if ('error' in g) return g.error;

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

  const admin = createAdminClient();

  // Find user by email via listUsers (no direct getUserByEmail in admin API)
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 });
  const target = list?.users?.find((u) => u.email?.toLowerCase() === email);
  if (!target) {
    return NextResponse.json({ error: 'No user found with that email' }, { status: 404 });
  }

  const { data: existing } = await admin
    .from('platform_admins')
    .select('user_id')
    .eq('user_id', target.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true, noop: true });
  }

  await admin.rpc('log_admin_action', {
    p_operator_id: g.user.id,
    p_action: 'grant_admin',
    p_target_user_id: target.id,
    p_target_org_id: null,
    p_before: null,
    p_after: { email: target.email },
    p_reason: null,
  });

  const { error: insErr } = await admin
    .from('platform_admins')
    .insert({ user_id: target.id, granted_by: g.user.id });
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, user_id: target.id });
}

// Revoke: body = { user_id }
export async function DELETE(req: NextRequest) {
  const g = await guard();
  if ('error' in g) return g.error;

  const body = await req.json().catch(() => ({}));
  const user_id = typeof body.user_id === 'string' ? body.user_id : '';
  if (!user_id) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });

  if (user_id === g.user.id) {
    return NextResponse.json({ error: 'Cannot revoke your own access' }, { status: 400 });
  }

  const admin = createAdminClient();

  await admin.rpc('log_admin_action', {
    p_operator_id: g.user.id,
    p_action: 'revoke_admin',
    p_target_user_id: user_id,
    p_target_org_id: null,
    p_before: null,
    p_after: null,
    p_reason: null,
  });

  const { error: delErr } = await admin
    .from('platform_admins')
    .delete()
    .eq('user_id', user_id);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
