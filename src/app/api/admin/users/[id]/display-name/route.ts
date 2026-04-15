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
  const raw = typeof body.display_name === 'string' ? body.display_name.trim() : '';
  const newName: string | null = raw.length === 0 ? null : raw.slice(0, 120);

  const admin = createAdminClient();
  const { data: before } = await admin.auth.admin.getUserById(targetId);
  if (!before?.user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const existingMeta = (before.user.user_metadata ?? {}) as Record<string, unknown>;
  const oldName = (existingMeta.display_name as string | undefined) ?? null;

  if (oldName === newName) return NextResponse.json({ ok: true, noop: true });

  const { error: auditErr } = await admin.rpc('log_admin_action', {
    p_operator_id: user.id,
    p_action: 'edit_user_display_name',
    p_target_user_id: targetId,
    p_target_org_id: null,
    p_before: { display_name: oldName },
    p_after: { display_name: newName },
    p_reason: null,
  });
  if (auditErr) {
    return NextResponse.json({ error: `Audit failed: ${auditErr.message}` }, { status: 500 });
  }

  const { error: updErr } = await admin.auth.admin.updateUserById(targetId, {
    user_metadata: { ...existingMeta, display_name: newName },
  });
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
