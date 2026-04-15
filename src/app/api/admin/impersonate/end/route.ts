import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPlatformAdmin } from '@/lib/admin/is-platform-admin';
import {
  IMPERSONATION_COOKIE,
  decodeImpersonationCookie,
} from '@/lib/admin/impersonation';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse(null, { status: 404 });

  const allowed = await isPlatformAdmin(user.id, user.email);
  if (!allowed) return new NextResponse(null, { status: 404 });

  const raw = req.cookies.get(IMPERSONATION_COOKIE)?.value ?? null;
  const payload = decodeImpersonationCookie(raw);

  if (payload && payload.operatorId === user.id) {
    const admin = createAdminClient();
    await admin.rpc('log_admin_action', {
      p_operator_id: user.id,
      p_action: 'impersonate.end',
      p_target_user_id: payload.targetUserId,
      p_target_org_id: null,
      p_before: null,
      p_after: null,
      p_reason: null,
    });
  }

  const targetId = payload?.targetUserId;
  const redirect = targetId ? `/admin/users/${targetId}` : '/admin/users';

  const res = NextResponse.json({ ok: true, redirect });
  res.cookies.set(IMPERSONATION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
