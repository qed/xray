import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string; invite?: string }> }) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Log In</h1>
        <AuthForm mode="login" inviteCode={params.invite} />
        <p className="text-center text-sm text-slate-500 mt-4">
          Don&apos;t have an account?{' '}
          <Link href={params.invite ? `/signup?invite=${params.invite}` : '/signup'} className="text-emerald-600 font-medium hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
