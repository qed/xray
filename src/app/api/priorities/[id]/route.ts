import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserRole, isUserLinkedToDepartment } from '@/lib/db';
import { STATUS_TRANSITIONS, type PriorityStatus } from '@/lib/constants';

const ALLOWED_FIELDS = new Set([
  'name', 'effort', 'complexity',
  'what_to_automate', 'current_state', 'why_it_matters',
  'estimated_time_savings', 'suggested_approach', 'success_criteria',
  'dependencies', 'status',
]);

const VALID_STATUSES = new Set<string>([
  'proposed', 'approved', 'rejected', 'not_started', 'in_progress', 'complete',
]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify priority exists and get its department/org
  const { data: priority } = await supabase
    .from('priorities')
    .select('id, status, department_id, department:departments(org_id)')
    .eq('id', id)
    .single();

  if (!priority) {
    return NextResponse.json({ error: 'Priority not found' }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orgId = (priority as any).department?.org_id;
  const role = await getUserRole(orgId, user.id);

  if (!role) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Owner can edit anything. Members/admins must be linked to the department.
  if (role !== 'owner') {
    const linked = await isUserLinkedToDepartment(user.id, priority.department_id);
    if (!linked) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Reject edits to rejected priorities (except status changes by owner)
  const currentStatus = priority.status as PriorityStatus;
  if (currentStatus === 'rejected' && role !== 'owner') {
    return NextResponse.json({ error: 'Cannot edit rejected priorities' }, { status: 403 });
  }

  // Parse and validate update body
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (ALLOWED_FIELDS.has(key)) {
      updates[key] = value;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  // Validate status transitions
  if ('status' in updates) {
    const newStatus = updates.status as string;
    if (!VALID_STATUSES.has(newStatus)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const allowed = STATUS_TRANSITIONS[currentStatus] ?? [];
    if (!allowed.includes(newStatus as PriorityStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from '${currentStatus}' to '${newStatus}'` },
        { status: 400 }
      );
    }

    // approved is a transient gate → auto-transition to not_started
    if (newStatus === 'approved') {
      updates.status = 'not_started';
    }
  }

  const { error } = await supabase
    .from('priorities')
    .update(updates)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
