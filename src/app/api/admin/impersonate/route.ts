import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPlatformAdmin } from '@/lib/admin/is-platform-admin';
import {
  IMPERSONATION_COOKIE,
  IMPERSONATION_TTL_SECONDS,
  buildPayload,
  encodeImpersonationCookie,
} from '@/lib/admin/impersonation';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse(null, { status: 404 });

  const allowed = await isPlatformAdmin(user.id, user.email);
  if (!allowed) return new NextResponse(null, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const targetUserId: string = typeof body.targetUserId === 'string' ? body.targetUserId : '';
  const reason: string = typeof body.reason === 'string' ? body.reason.trim() : '';

  if (!targetUserId) {
    return NextResponse.json({ error: 'targetUserId required' }, { status: 400 });
  }
  if (reason.length < 8) {
    return NextResponse.json(
      { error: 'Reason is required (min 8 characters).' },
      { status: 400 }
    );
  }
  if (user.id === targetUserId) {
    return NextResponse.json({ error: 'Cannot impersonate yourself.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: targetRes, error: targetErr } = await admin.auth.admin.getUserById(targetUserId);
  if (targetErr || !targetRes?.user) {
    return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
  }

  // Find target's first org membership for redirect landing.
  const { data: membership } = await admin
    .from('org_members')
    .select('organizations!inner(slug)')
    .eq('user_id', targetUserId)
    .limit(1)
    .maybeSingle();
  const landingSlug = (membership as any)?.organizations?.slug ?? null;
  const landing = landingSlug ? `/org/${landingSlug}` : '/orgs';

  const { error: auditErr } = await admin.rpc('log_admin_action', {
    p_operator_id: user.id,
    p_action: 'impersonate.start',
    p_target_user_id: targetUserId,
    p_target_org_id: null,
    p_before: null,
    p_after: { landing },
    p_reason: reason,
  });
  if (auditErr) {
    return NextResponse.json(
      { error: `Audit log write failed: ${auditErr.message}` },
      { status: 500 }
    );
  }

  const payload = buildPayload(user.id, targetUserId, reason);
  const cookieValue = encodeImpersonationCookie(payload);

  const res = NextResponse.json({ ok: true, landing });
  res.cookies.set(IMPERSONATION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: IMPERSONATION_TTL_SECONDS,
  });
  return res;
}
