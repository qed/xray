import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPlatformAdmin } from '@/lib/admin/is-platform-admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse(null, { status: 404 });
  if (!(await isPlatformAdmin(user.id, user.email))) {
    return new NextResponse(null, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const linkType = body.type === 'recovery' ? 'recovery' : 'invite';

  const admin = createAdminClient();
  const { data: targetRes } = await admin.auth.admin.getUserById(targetId);
  if (!targetRes?.user?.email) {
    return NextResponse.json({ error: 'User has no email' }, { status: 404 });
  }
  const email = targetRes.user.email;

  const { error: auditErr } = await admin.rpc('log_admin_action', {
    p_operator_id: user.id,
    p_action: linkType === 'recovery' ? 'resend_password_reset' : 'resend_invite',
    p_target_user_id: targetId,
    p_target_org_id: null,
    p_before: null,
    p_after: { email, type: linkType },
    p_reason: null,
  });
  if (auditErr) {
    return NextResponse.json({ error: `Audit failed: ${auditErr.message}` }, { status: 500 });
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: linkType,
    email,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    action_link: data?.properties?.action_link ?? null,
  });
}
