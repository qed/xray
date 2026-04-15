import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPlatformAdmin } from '@/lib/admin/is-platform-admin';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse(null, { status: 404 });

  const allowed = await isPlatformAdmin(user.id, user.email);
  if (!allowed) return new NextResponse(null, { status: 404 });

  if (user.id === targetId) {
    return NextResponse.json(
      { error: 'An operator cannot delete themselves. Ask another admin.' },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const reason: string | null = typeof body.reason === 'string' && body.reason.trim()
    ? body.reason.trim()
    : null;

  const admin = createAdminClient();

  // Snapshot target for audit "before"
  const { data: targetRes } = await admin.auth.admin.getUserById(targetId);
  if (!targetRes?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const before = {
    id: targetRes.user.id,
    email: targetRes.user.email,
    created_at: targetRes.user.created_at,
    user_metadata: targetRes.user.user_metadata,
  };

  // Write audit row first so failures after this point are still traceable.
  const { error: auditErr } = await admin.rpc('log_admin_action', {
    p_operator_id: user.id,
    p_action: 'delete_user',
    p_target_user_id: targetId,
    p_target_org_id: null,
    p_before: before,
    p_after: null,
    p_reason: reason,
  });
  if (auditErr) {
    return NextResponse.json(
      { error: `Audit log write failed: ${auditErr.message}` },
      { status: 500 }
    );
  }

  const { error: deleteErr } = await admin.auth.admin.deleteUser(targetId);
  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
