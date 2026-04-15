import { createAdminClient } from '@/lib/supabase/admin';

function envBootstrapEmails(): string[] {
  const raw = process.env.SUPERADMIN_EMAILS ?? '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isEnvBootstrapAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return envBootstrapEmails().includes(email.trim().toLowerCase());
}

export async function isPlatformAdmin(
  userId: string | null | undefined,
  email: string | null | undefined
): Promise<boolean> {
  if (!userId) return false;
  if (isEnvBootstrapAdmin(email)) return true;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('platform_admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      console.error('[isPlatformAdmin] platform_admins lookup failed', error);
      return false;
    }
    return Boolean(data);
  } catch (err) {
    console.error('[isPlatformAdmin] unexpected error', err);
    return false;
  }
}
