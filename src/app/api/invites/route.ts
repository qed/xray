import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserRole } from '@/lib/db';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orgId, email, role, maxUses } = await req.json();
  if (!orgId || !email || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!['admin', 'member'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const userRole = await getUserRole(orgId, user.id);
  if (!userRole || !['owner', 'admin'].includes(userRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const code = Math.random().toString(36).substring(2, 10);

  // Create invite row
  const { error: insertError } = await supabase.from('invites').insert({
    org_id: orgId,
    code,
    email,
    role,
    max_uses: maxUses ? parseInt(maxUses, 10) : 1,
    created_by: user.id,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Send magic link via admin client
  const admin = createAdminClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${code}`;

  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo,
  });

  if (inviteError) {
    // Invite row created but email failed, still usable via manual link
    return NextResponse.json({ code, emailSent: false, error: inviteError.message });
  }

  return NextResponse.json({ code, emailSent: true });
}
