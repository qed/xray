import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import {
  IMPERSONATION_COOKIE,
  decodeImpersonationCookie,
  isExpired,
  type ImpersonationPayload,
} from './impersonation';

/**
 * Returns the active impersonation payload if a valid, unexpired cookie is present.
 * Otherwise returns null.
 */
export async function getActiveImpersonation(): Promise<ImpersonationPayload | null> {
  const jar = await cookies();
  const raw = jar.get(IMPERSONATION_COOKIE)?.value ?? null;
  const payload = decodeImpersonationCookie(raw);
  if (!payload || isExpired(payload)) return null;
  return payload;
}

/**
 * Effective user ID for read queries:
 *   - during impersonation: the target
 *   - otherwise: the currently authenticated user (operator / normal user)
 *   - if no session at all: null
 *
 * Writes should continue to use the authenticated operator's ID so the audit
 * trail remains clean. This helper is for reads only.
 */
export async function getEffectiveUserId(): Promise<string | null> {
  const imp = await getActiveImpersonation();
  if (imp) return imp.targetUserId;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}
