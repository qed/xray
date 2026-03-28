'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Member {
  id: string;
  user_id: string;
  role: string;
  email: string;
}

interface MemberListProps {
  members: Member[];
  currentUserId: string;
  currentUserRole: string;
  orgId: string;
}

export default function MemberList({ members, currentUserId, currentUserRole }: MemberListProps) {
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);

  async function removeMember(memberId: string) {
    setRemoving(memberId);
    const supabase = createClient();
    await supabase.from('org_members').delete().eq('id', memberId);
    router.refresh();
    setRemoving(null);
  }

  return (
    <div className="space-y-2">
      {members.map((m) => (
        <div key={m.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-900">{m.email}</p>
            <p className="text-xs text-slate-500 capitalize">{m.role}</p>
          </div>
          {currentUserRole === 'owner' && m.user_id !== currentUserId && m.role !== 'owner' && (
            <button
              onClick={() => removeMember(m.id)}
              disabled={removing === m.id}
              className="text-xs text-red-600 hover:text-red-800"
            >
              {removing === m.id ? 'Removing...' : 'Remove'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
