import UploadForm from '@/components/UploadForm';
import { getDepartmentSlugs, parseProfile } from '@/lib/parser';

export const dynamic = 'force-dynamic';

export default function UploadPage() {
  const slugs = getDepartmentSlugs();
  const departments = slugs.map((slug) => {
    try {
      const profile = parseProfile(slug);
      return { slug, name: profile.name };
    } catch {
      return { slug, name: slug };
    }
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Upload
        </h1>
        <p className="text-slate-500 mt-1">
          Add or update department X-Ray data
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-2xl">
        <UploadForm departments={departments} />
      </div>
    </div>
  );
}
