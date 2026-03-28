import { notFound } from 'next/navigation';
import { getOrgBySlug, getDepartments } from '@/lib/db';
import UploadForm from '@/components/UploadForm';

export default async function UploadPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const depts = await getDepartments(org.id);
  const departments = depts.map((d) => ({ slug: d.slug, name: d.name }));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Upload</h1>
        <p className="text-slate-500 mt-1">Add or update department X-Ray data</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-2xl">
        <UploadForm departments={departments} orgId={org.id} orgSlug={orgSlug} />
      </div>
    </div>
  );
}
