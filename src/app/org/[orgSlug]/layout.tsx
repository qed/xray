import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getUnfiledRankedOpportunities, getUserDepartments } from '@/lib/db';
import UserMenu from '@/components/UserMenu';
import { PriorityModalProvider } from '@/components/PriorityModalContext';
import { RoleProvider } from '@/components/RoleContext';
import { isPlatformAdmin } from '@/lib/admin/is-platform-admin';

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) redirect('/join');

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  const isAdmin = await isPlatformAdmin(user.id, user.email);

  const unfiled = await getUnfiledRankedOpportunities(org.id);
  const unfiledCount = unfiled.length;

  // Members who haven't joined a department yet see a stripped nav — only
  // "My Team" is useful until they join. Owners/admins always see full nav.
  const memberDepts = role === 'member' ? await getUserDepartments(user.id, org.id) : [];
  const isGatedMember = role === 'member' && memberDepts.length === 0;

  const base = `/org/${orgSlug}`;

  const allNavLinks = [
    { href: `${base}/dashboard`, label: 'Dashboard', badge: unfiledCount > 0 ? unfiledCount : undefined, roles: ['owner', 'admin', 'member'] },
    { href: `${base}/team`, label: 'Team', roles: ['owner', 'admin', 'member'] },
    { href: `${base}/intake`, label: 'Intake', roles: ['owner', 'admin', 'member'] },
    { href: `${base}/tracker`, label: 'Tracker', roles: ['owner'] },
    { href: `${base}/risks`, label: 'Risks', roles: ['owner'] },
    { href: `${base}/dependencies`, label: 'Dependencies', roles: ['owner'] },
    { href: `${base}/tools`, label: 'Tools', roles: ['owner'] },
    { href: `${base}/briefs`, label: 'Briefs', roles: ['owner', 'admin'] },
  ];

  // Gated members (no joined departments) only see the Team link so they
  // can get to the CTA and join one. Everyone else sees the full
  // role-filtered nav.
  const navLinks = isGatedMember
    ? allNavLinks.filter((link) => link.href === `${base}/team`)
    : allNavLinks.filter((link) => link.roles.includes(role));

  return (
    <RoleProvider role={role as 'owner' | 'admin' | 'member'}>
    <PriorityModalProvider>
      <div className="min-h-screen bg-white">
        <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
          <div className="max-w-screen-2xl mx-auto px-4 flex items-center h-14 gap-6">
            <Link href="/orgs" className="text-white font-bold text-lg tracking-tight shrink-0">
              X-Ray
            </Link>
            <Link href="/orgs" className="text-sm font-semibold text-white hover:text-emerald-300 transition-colors">
              {org.name}
            </Link>

            <div className="flex-1 flex items-center gap-1 overflow-x-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap"
                >
                  {link.label}
                  {link.badge !== undefined && (
                    <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <UserMenu email={user.email ?? ''} orgSlug={orgSlug} role={role} isAdmin={isAdmin} />
          </div>
        </nav>

        <main className="max-w-screen-2xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </PriorityModalProvider>
    </RoleProvider>
  );
}
