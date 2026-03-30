'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrgCardProps {
  name: string;
  slug: string;
  role: string;
  departmentCount: number;
  priorityCount: number;
  inviteCode: string | null;
}

const roleBadge: Record<string, string> = {
  owner: 'bg-emerald-100 text-emerald-700',
  admin: 'bg-blue-100 text-blue-700',
  member: 'bg-slate-100 text-slate-600',
};

export default function OrgCard({ name, slug, role, departmentCount, priorityCount, inviteCode }: OrgCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      onClick={() => router.push(`/org/${slug}/priorities`)}
      className="bg-white border border-slate-200 rounded-xl p-5 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-semibold text-slate-900">{name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge[role] ?? roleBadge.member}`}>
          {role}
        </span>
      </div>

      <div className="flex gap-4 mb-3">
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-slate-900">{departmentCount}</span> department{departmentCount !== 1 ? 's' : ''}
        </div>
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-slate-900">{priorityCount}</span> priorit{priorityCount !== 1 ? 'ies' : 'y'}
        </div>
      </div>

      {inviteCode && (
        <div className="flex items-center gap-1.5 px-2.5 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
          <span className="text-[11px] text-slate-500">Invite code:</span>
          <code className="text-sm font-semibold text-emerald-700 tracking-wide">{inviteCode}</code>
          <button
            type="button"
            onClick={handleCopy}
            className={`ml-auto px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-500 border-slate-300 hover:border-emerald-400 hover:text-emerald-600'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
