import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/db';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orgId, departmentId } = await request.json();

  if (!orgId || !departmentId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Verify org membership
  const role = await getUserRole(orgId, user.id);
  if (!role) {
    return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
  }

  // RLS md_delete_self policy allows users to delete their own member_departments rows
  const { error } = await supabase
    .from('member_departments')
    .delete()
    .eq('user_id', user.id)
    .eq('department_id', departmentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
