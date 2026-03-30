import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AuthForm from '@/components/AuthForm';

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/orgs');

  const params = await searchParams;
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Create Account</h1>
        <AuthForm mode="signup" inviteCode={params.invite} />
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link href={params.invite ? `/login?invite=${params.invite}` : '/login'} className="text-emerald-600 font-medium hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
