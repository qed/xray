'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  targetEmail: string;
  expiresAt: number; // ms epoch
}

function fmtCountdown(ms: number): string {
  if (ms <= 0) return '0:00';
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ImpersonationBanner({ targetEmail, expiresAt }: Props) {
  const router = useRouter();
  const [remainingMs, setRemainingMs] = useState(expiresAt - Date.now());
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setRemainingMs(expiresAt - Date.now()), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  async function endSession() {
    setEnding(true);
    const res = await fetch('/api/admin/impersonate/end', { method: 'POST' });
    const body = await res.json().catch(() => ({}));
    router.push(body.redirect ?? '/admin/users');
    router.refresh();
  }

  return (
    <div className="sticky top-0 z-50 bg-amber-500 text-slate-900 border-b-2 border-amber-700 shadow">
      <div className="max-w-screen-2xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-900 text-amber-50 text-xs font-bold uppercase tracking-wide">
            Impersonating
          </span>
          <span className="font-medium">{targetEmail}</span>
          <span className="text-xs text-amber-900">· session ends in {fmtCountdown(remainingMs)}</span>
        </div>
        <button
          onClick={endSession}
          disabled={ending}
          className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40"
        >
          {ending ? 'Ending…' : 'End impersonation'}
        </button>
      </div>
    </div>
  );
}
