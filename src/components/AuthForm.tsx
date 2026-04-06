'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AuthFormProps {
  mode: 'login' | 'signup';
  inviteCode?: string;
}

export default function AuthForm({ mode, inviteCode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === 'signup') {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) { setError(signUpError.message); setLoading(false); return; }

        // If email confirmation is required, session will be null
        if (!signUpData.session) {
          window.location.href = '/signup-success';
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) { setError(signInError.message); setLoading(false); return; }
      }

      if (inviteCode) {
        // Join the org directly on the client to avoid server cookie timing issues
        const { data: invite } = await supabase.from('invites').select('*').eq('code', inviteCode.trim().toLowerCase()).single();
        if (invite) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: existing } = await supabase.from('org_members').select('id').eq('org_id', invite.org_id).eq('user_id', user.id).single();
            if (!existing) {
              await supabase.from('org_members').insert({ org_id: invite.org_id, user_id: user.id, role: invite.role ?? 'member' });
              await supabase.from('invites').update({ use_count: invite.use_count + 1 }).eq('id', invite.id);
            }
          }
        }
      }

      // Redirect to first org's priorities page, or /orgs if no memberships
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: memberships } = await supabase
          .from('org_members')
          .select('org_id, organizations(slug)')
          .eq('user_id', currentUser.id)
          .limit(1);
        if (memberships?.length && memberships[0].organizations) {
          const org = memberships[0].organizations as unknown as { slug: string };
          window.location.href = `/org/${org.slug}/priorities`;
          return;
        }
      }
      window.location.href = '/orgs';
    } catch (err) {
      setError(`Unexpected error: ${err}`);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="you@company.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="At least 6 characters" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40">
        {loading ? 'Loading...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
      </button>
    </form>
  );
}
