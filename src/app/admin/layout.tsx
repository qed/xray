import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isPlatformAdmin } from '@/lib/admin/is-platform-admin';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const allowed = await isPlatformAdmin(user.id, user.email);
  if (!allowed) {
    // Defense-in-depth; proxy already 404s. Return 404-equivalent via notFound-alike route.
    redirect('/orgs');
  }

  return (
    <>
      <style>{`body { background: #f8fafc !important; }`}</style>
      <div className="min-h-screen">
        <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
          <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/admin/users" className="text-white font-bold text-lg tracking-tight">
                X-Ray <span className="text-emerald-400 font-normal text-sm">· Admin</span>
              </Link>
              <AdminNav />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400">{user.email}</span>
              <Link
                href="/orgs"
                className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
              >
                Exit admin
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-screen-2xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </>
  );
}
