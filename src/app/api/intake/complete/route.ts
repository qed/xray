import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { applyExtraction, ApplyExtractionMode } from '@/lib/apply-extraction';
import { generatePlaceholderReporting } from '@/lib/reporting';
import type { DbPriority } from '@/lib/types';

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
  const { orgId, extractedData, conversationId, departmentName, mode, departmentId } = body as {
    orgId: string;
    extractedData?: Record<string, unknown>;
    conversationId?: string;
    departmentName: string;
    mode?: ApplyExtractionMode;
    departmentId?: string;
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
    // For append mode with an explicit departmentId (e.g., file-import where the LLM
    // determines the target department), link the conversation first so apply_extraction
    // can read department_id from it.
    if (mode === 'append' && departmentId && conversationId) {
      await admin
        .from('conversations')
        .update({ department_id: departmentId })
        .eq('id', conversationId);
    }

    const result = await applyExtraction(orgId, extractedData, conversationId, mode);
    const deptId = result.department_id;

    // Post-process: fill in slugs and reporting_data for new priorities
    if (deptId) {
      await backfillSlugsAndReporting(admin, deptId);
      await backfillDepartmentColorIndex(admin, orgId, deptId);
    }

    return NextResponse.json({ success: true, departmentId: deptId });
  } catch (err) {
    console.error('intake/complete error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ---------- Post-processing helpers ----------

/**
 * Fill in slug and reporting_data for any priorities in this department
 * that are missing them (i.e., just created by apply_extraction).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function backfillSlugsAndReporting(admin: any, departmentId: string) {
  // Get priorities missing slug or reporting_data
  const { data: priorities } = await admin
    .from('priorities')
    .select('*')
    .eq('department_id', departmentId)
    .order('rank');

  if (!priorities?.length) return;

  // Collect existing slugs for collision detection
  const existingSlugs = new Set(
    priorities.filter((p: DbPriority) => p.slug).map((p: DbPriority) => p.slug)
  );

  for (const p of priorities as DbPriority[]) {
    const updates: Record<string, unknown> = {};

    // Generate slug if missing
    if (!p.slug) {
      let baseSlug = slugify(p.name).slice(0, 80);
      let candidate = baseSlug;
      let counter = 1;
      while (existingSlugs.has(candidate)) {
        counter++;
        candidate = `${baseSlug}-${counter}`;
      }
      existingSlugs.add(candidate);
      updates.slug = candidate;
    }

    // Generate reporting_data if missing
    if (!p.reporting_data) {
      const priorityWithSlug = { ...p, slug: (updates.slug as string) ?? p.slug };
      updates.reporting_data = generatePlaceholderReporting(priorityWithSlug);
    }

    if (Object.keys(updates).length > 0) {
      await admin
        .from('priorities')
        .update(updates)
        .eq('id', p.id);
    }
  }
}

/**
 * Assign a color_index to a department if it doesn't have one yet.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function backfillDepartmentColorIndex(admin: any, orgId: string, departmentId: string) {
  const { data: dept } = await admin
    .from('departments')
    .select('color_index')
    .eq('id', departmentId)
    .single();

  if (dept?.color_index != null) return;

  // Find the next available color_index for this org
  const { data: existingDepts } = await admin
    .from('departments')
    .select('color_index')
    .eq('org_id', orgId)
    .not('color_index', 'is', null)
    .order('color_index', { ascending: false })
    .limit(1);

  const nextIndex = existingDepts?.length ? (existingDepts[0].color_index + 1) : 0;

  await admin
    .from('departments')
    .update({ color_index: nextIndex })
    .eq('id', departmentId);
}
