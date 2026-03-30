import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import UserMenu from '@/components/UserMenu';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/orgs" className="text-white font-bold text-lg tracking-tight">
            X-Ray
          </Link>
          <UserMenu email={user.email ?? ''} />
        </div>
      </nav>
      <main className="max-w-screen-2xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
