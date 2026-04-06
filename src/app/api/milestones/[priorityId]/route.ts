import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ priorityId: string }> }
) {
  const { priorityId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify priority exists and user is owner
  const { data: priority } = await supabase
    .from('priorities')
    .select('id, department:departments(org_id)')
    .eq('id', priorityId)
    .single();

  if (!priority) {
    return NextResponse.json({ error: 'Priority not found' }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orgId = (priority as any).department?.org_id;
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership || membership.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { stage, notes } = await request.json();

  if (typeof stage !== 'number' || stage < 0 || stage > 3) {
    return NextResponse.json({ error: 'Invalid stage (must be 0-3)' }, { status: 400 });
  }

  const { error } = await supabase
    .from('milestones')
    .update({
      stage,
      notes: notes ?? '',
      updated_at: new Date().toISOString(),
    })
    .eq('priority_id', priorityId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
