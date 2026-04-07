import { createAdminClient } from '@/lib/supabase/admin';

export type ApplyExtractionMode = 'create' | 'overwrite' | 'append';

export interface ApplyExtractionResult {
  department_id: string;
  mode: string;
}

/**
 * Thin wrapper around the `apply_extraction` Postgres function.
 * Callable without role checks — used by both the approve route and auto-save flow.
 */
export async function applyExtraction(
  orgId: string,
  extractedData: Record<string, unknown>,
  conversationId: string,
  mode: ApplyExtractionMode
): Promise<ApplyExtractionResult> {
  const admin = createAdminClient();

  const { data, error } = await admin.rpc('apply_extraction', {
    p_org_id: orgId,
    p_extracted_data: extractedData,
    p_conversation_id: conversationId,
    p_mode: mode,
  });

  if (error) {
    throw new Error(`apply_extraction failed: ${error.message}`);
  }

  return data as ApplyExtractionResult;
}
