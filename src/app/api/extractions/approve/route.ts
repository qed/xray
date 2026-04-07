import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserRole } from '@/lib/db';
import { applyExtraction } from '@/lib/apply-extraction';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { extractionId, orgId, mode } = await req.json();
  if (!extractionId || !orgId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const role = await getUserRole(orgId, user.id);
  if (role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const admin = createAdminClient();

  // Load extraction
  const { data: extraction, error: fetchError } = await admin
    .from('extractions')
    .select('*, conversation:conversations(*)')
    .eq('id', extractionId)
    .single();

  if (fetchError || !extraction) {
    return NextResponse.json({ error: 'Extraction not found' }, { status: 404 });
  }

  const data = extraction.extracted_data;

  try {
    if (mode === 'intake' && data.profile) {
      // Delegate all department/priority/team-member/milestone/brief creation
      // to the apply_extraction Postgres function via RPC
      await applyExtraction(orgId, data, extraction.conversation_id, 'create');

    } else if (mode === 'gap-fill' && data.fields) {
      // Field-level updates on an existing priority — not handled by the
      // Postgres function, so we keep this logic here
      const priorityId = data.priorityId;
      if (!priorityId) throw new Error('No priorityId in extraction');

      const updates: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data.fields)) {
        if (value) updates[key] = value;
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await admin
          .from('priorities')
          .update(updates)
          .eq('id', priorityId);

        if (updateError) throw updateError;
      }
    }

    // Mark extraction as approved
    await admin
      .from('extractions')
      .update({ status: 'approved', reviewed_by: user.id })
      .eq('id', extractionId);

    // Mark conversation as approved
    await admin
      .from('conversations')
      .update({ status: 'approved' })
      .eq('id', extraction.conversation_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
