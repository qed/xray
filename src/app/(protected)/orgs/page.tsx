import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserOrgs, getOrgStats, getFirstInviteCode } from '@/lib/db';
import OrgCard from '@/components/OrgCard';

export default async function OrgsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const memberships = await getUserOrgs(user.id);

  const orgs = await Promise.all(
    memberships.map(async (m) => {
      const [stats, inviteCode] = await Promise.all([
        getOrgStats(m.organization.id),
        getFirstInviteCode(m.organization.id),
      ]);
      return {
        name: m.organization.name,
        slug: m.organization.slug,
        role: m.role,
        departmentCount: stats.departmentCount,
        priorityCount: stats.priorityCount,
        inviteCode,
      };
    })
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Your Organizations</h1>
      <p className="text-slate-500 text-sm mb-6">Select an organization to view its priorities and data.</p>

      {orgs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 mb-4">You are not a member of any organization yet.</p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Join or Create an Organization
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgs.map((org) => (
              <OrgCard key={org.slug} {...org} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/join" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
              + Join another organization
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
