import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import ImpersonationBanner from '@/components/admin/ImpersonationBanner';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  IMPERSONATION_COOKIE,
  decodeImpersonationCookie,
  isExpired,
} from '@/lib/admin/impersonation';

export const metadata: Metadata = {
  title: 'X-Ray',
  description: 'See everything. Automate what matters.',
};

async function getImpersonationContext() {
  const jar = await cookies();
  const raw = jar.get(IMPERSONATION_COOKIE)?.value ?? null;
  const payload = decodeImpersonationCookie(raw);
  if (!payload || isExpired(payload)) return null;
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.getUserById(payload.targetUserId);
    const email = data?.user?.email ?? '(unknown)';
    return { email, expiresAt: payload.expiresAt };
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const impersonation = await getImpersonationContext();
  return (
    <html lang="en">
      <body className="antialiased">
        {impersonation && (
          <ImpersonationBanner
            targetEmail={impersonation.email}
            expiresAt={impersonation.expiresAt}
          />
        )}
        {children}
      </body>
    </html>
  );
}
