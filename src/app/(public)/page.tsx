import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/orgs');
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="text-white font-bold text-xl tracking-tight">X-Ray</div>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Sign Up</Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white tracking-tight">X-Ray</h1>
          <p className="mt-4 text-xl text-slate-400">See everything. Automate what matters.</p>
        </div>
      </div>
    </div>
  );
}
