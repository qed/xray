'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function UserMenu({ email, orgSlug, role }: { email: string; orgSlug: string; role: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center hover:bg-emerald-500 transition-colors">
        {email[0]?.toUpperCase() ?? '?'}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 min-w-48">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">{email}</p>
            <p className="text-xs text-slate-500 capitalize">{role}</p>
          </div>
          {(role === 'owner' || role === 'admin') && (
            <Link href={`/org/${orgSlug}/settings`} onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Settings</Link>
          )}
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Log Out</button>
        </div>
      )}
    </div>
  );
}
