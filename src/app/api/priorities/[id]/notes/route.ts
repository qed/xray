import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserRole, isUserLinkedToDepartment } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: priorityId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify priority exists and user has access
  const { data: priority } = await supabase
    .from('priorities')
    .select('id, department_id, department:departments(org_id)')
    .eq('id', priorityId)
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

  if (role !== 'owner') {
    const linked = await isUserLinkedToDepartment(user.id, priority.department_id);
    if (!linked) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const { data: notes } = await supabase
    .from('priority_notes')
    .select('*')
    .eq('priority_id', priorityId)
    .order('created_at', { ascending: false });

  return NextResponse.json({ notes: notes ?? [] });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: priorityId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content } = await request.json();
  if (!content || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  // Verify priority exists and user has access
  const { data: priority } = await supabase
    .from('priorities')
    .select('id, department_id, department:departments(org_id)')
    .eq('id', priorityId)
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

  if (role !== 'owner') {
    const linked = await isUserLinkedToDepartment(user.id, priority.department_id);
    if (!linked) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const { data: note, error } = await supabase
    .from('priority_notes')
    .insert({
      priority_id: priorityId,
      user_id: user.id,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ note }, { status: 201 });
}
