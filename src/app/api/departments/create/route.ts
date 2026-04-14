import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/db';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orgId, name } = await request.json();

  if (!orgId || !name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Any org member can create — the RPC validates org membership
  const role = await getUserRole(orgId, user.id);
  if (!role) {
    return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
  }

  const { data, error } = await supabase.rpc('create_department_shell', {
    p_name: name.trim(),
    p_org_id: orgId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ departmentId: data });
}
