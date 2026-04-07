import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { applyExtraction, ApplyExtractionMode } from '@/lib/apply-extraction';

/**
 * Slugify a department name the same way the Postgres function does:
 * lowercase, strip non-alphanumeric (except spaces/hyphens), collapse
 * spaces to single hyphens, trim leading/trailing hyphens.
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { orgId, extractedData, conversationId, departmentName, mode } = body as {
    orgId: string;
    extractedData?: Record<string, unknown>;
    conversationId?: string;
    departmentName: string;
    mode?: ApplyExtractionMode;
  };

  if (!orgId || !departmentName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const admin = createAdminClient();

  // ── Check-only mode (no mode provided) ──────────────────────────────
  if (!mode) {
    const slug = slugify(departmentName);
    const { data: existing } = await admin
      .from('departments')
      .select('id')
      .eq('org_id', orgId)
      .eq('slug', slug)
      .maybeSingle();

    return NextResponse.json({
      exists: !!existing,
      departmentId: existing?.id ?? undefined,
    });
  }

  // ── Save mode (create | overwrite) ──────────────────────────────────
  if (!extractedData || !conversationId) {
    return NextResponse.json(
      { error: 'extractedData and conversationId are required when mode is set' },
      { status: 400 },
    );
  }

  try {
    const result = await applyExtraction(orgId, extractedData, conversationId, mode);
    return NextResponse.json({ success: true, departmentId: result.department_id });
  } catch (err) {
    console.error('intake/complete error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
