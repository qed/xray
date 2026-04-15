import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPlatformAdmin } from '@/lib/admin/is-platform-admin';

export async function PATCH(
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
  const newEmail = typeof body.email === 'string' ? body.email.trim() : '';
  if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: before } = await admin.auth.admin.getUserById(targetId);
  if (!before?.user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const oldEmail = before.user.email ?? null;

  if (oldEmail?.toLowerCase() === newEmail.toLowerCase()) {
    return NextResponse.json({ ok: true, noop: true });
  }

  const { error: auditErr } = await admin.rpc('log_admin_action', {
    p_operator_id: user.id,
    p_action: 'edit_user_email',
    p_target_user_id: targetId,
    p_target_org_id: null,
    p_before: { email: oldEmail },
    p_after: { email: newEmail },
    p_reason: null,
  });
  if (auditErr) {
    return NextResponse.json({ error: `Audit failed: ${auditErr.message}` }, { status: 500 });
  }

  const { error: updErr } = await admin.auth.admin.updateUserById(targetId, { email: newEmail });
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
