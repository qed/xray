import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/db';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orgId, userId, departmentIds, selfSelect } = await request.json();

  if (!orgId || !departmentIds || !Array.isArray(departmentIds) || departmentIds.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (selfSelect) {
    // Member self-selects departments (trust-based)
    const { data, error } = await supabase.rpc('self_select_departments', {
      p_department_ids: departmentIds,
      p_org_id: orgId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ inserted: data });
  }

  // Admin/owner assigns departments to a target user
  if (!userId) {
    return NextResponse.json({ error: 'userId is required for admin assignment' }, { status: 400 });
  }

  const role = await getUserRole(orgId, user.id);
  if (!role || !['owner', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase.rpc('assign_member_departments', {
    p_user_id: userId,
    p_department_ids: departmentIds,
    p_org_id: orgId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ inserted: data });
}
