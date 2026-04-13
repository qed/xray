'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function JoinPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [mode, setMode] = useState<'join' | 'create'>('join');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: invite } = await supabase.from('invites').select('*').eq('code', inviteCode.trim().toLowerCase()).single();
      if (!invite) { setError('Invalid invite code'); setLoading(false); return; }
      if (invite.expires_at && new Date(invite.expires_at) < new Date()) { setError('This invite code has expired'); setLoading(false); return; }
      if (invite.max_uses && invite.use_count >= invite.max_uses) { setError('This invite code has reached its maximum uses'); setLoading(false); return; }

      await supabase.from('org_members').insert({ org_id: invite.org_id, user_id: user.id, role: invite.role ?? 'member' });
      await supabase.from('invites').update({ use_count: invite.use_count + 1 }).eq('id', invite.id);

      router.push('/orgs');
      router.refresh();
    } catch { setError('Failed to join organization'); setLoading(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const slug = orgName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
      const { error: rpcError } = await supabase.rpc('create_organization', { p_name: orgName, p_slug: slug });
      if (rpcError) { setError(rpcError.message.includes('duplicate') ? 'An organization with this name already exists' : rpcError.message); setLoading(false); return; }

      router.push(`/org/${slug}/dashboard`);
      router.refresh();
    } catch { setError('Failed to create organization'); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Join an Organization</h1>
        <div className="flex rounded-lg border border-slate-300 overflow-hidden w-full mb-6">
          <button type="button" onClick={() => setMode('join')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${mode === 'join' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
            Enter Invite Code
          </button>
          <button type="button" onClick={() => setMode('create')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${mode === 'create' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
            Create Organization
          </button>
        </div>
        {mode === 'join' ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invite Code</label>
              <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="abcd1234" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40">
              {loading ? 'Joining...' : 'Join'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
              <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="My Company" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40">
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
