'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Invite {
  id: string;
  code: string;
  use_count: number;
  max_uses: number | null;
  expires_at: string | null;
}

interface InviteManagerProps {
  invites: Invite[];
  orgId: string;
}

export default function InviteManager({ invites, orgId }: InviteManagerProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [maxUses, setMaxUses] = useState('');

  async function createInvite(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await supabase.from('invites').insert({
      org_id: orgId,
      code,
      max_uses: maxUses ? parseInt(maxUses, 10) : null,
      created_by: user.id,
    });

    setMaxUses('');
    setCreating(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={createInvite} className="flex gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Max Uses (optional)</label>
          <input
            type="number"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            className="w-24 border border-slate-300 rounded-lg px-2 py-1.5 text-sm"
            placeholder="---"
            min="1"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40"
        >
          {creating ? 'Creating...' : 'Create Invite Code'}
        </button>
      </form>

      {invites.length > 0 && (
        <div className="space-y-2">
          {invites.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-mono font-bold text-slate-900">{inv.code}</p>
                <p className="text-xs text-slate-500">
                  Used {inv.use_count}{inv.max_uses ? `/${inv.max_uses}` : ''} times
                  {inv.expires_at ? ` · Expires ${new Date(inv.expires_at).toLocaleDateString()}` : ''}
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(inv.code)}
                className="text-xs text-emerald-600 hover:text-emerald-800"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
