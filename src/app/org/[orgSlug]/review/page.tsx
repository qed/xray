import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole } from '@/lib/db';
import { createAdminClient } from '@/lib/supabase/admin';
import ExtractionReview from './ExtractionReview';

export default async function ReviewPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) redirect('/join');

  const role = await getUserRole(org.id, user.id);
  if (role !== 'owner') redirect(`/org/${orgSlug}/priorities`);

  // Load pending extractions with their conversations
  const admin = createAdminClient();
  const { data: extractions } = await admin
    .from('extractions')
    .select('*, conversation:conversations(*)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  // Filter to this org's extractions
  const orgExtractions = (extractions || []).filter(
    (e: { conversation: { org_id: string } }) => e.conversation?.org_id === org.id
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Review Extractions</h1>
        <p className="text-slate-500 mt-1">
          {orgExtractions.length === 0
            ? 'No pending extractions to review'
            : `${orgExtractions.length} extraction${orgExtractions.length !== 1 ? 's' : ''} awaiting approval`}
        </p>
      </div>

      {orgExtractions.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-500">When team members complete AI intake interviews, their extracted data will appear here for your review.</p>
        </div>
      ) : (
        <ExtractionReview extractions={orgExtractions} orgId={org.id} orgSlug={orgSlug} />
      )}
    </div>
  );
}
