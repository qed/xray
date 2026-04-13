'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  proposedIds: string[];
}

export default function ApprovalBanner({ proposedIds }: Props) {
  const router = useRouter();
  const [approving, setApproving] = useState(false);

  if (proposedIds.length === 0) return null;

  async function approveAll() {
    setApproving(true);
    // Approve all proposed → approved (API auto-transitions to not_started)
    await Promise.all(
      proposedIds.map((id) =>
        fetch(`/api/priorities/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' }),
        })
      )
    );
    setApproving(false);
    router.refresh();
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-purple-900">
          {proposedIds.length} priorit{proposedIds.length === 1 ? 'y needs' : 'ies need'} your review
        </p>
        <p className="text-xs text-purple-600 mt-0.5">
          AI-extracted priorities waiting for your approval.
        </p>
      </div>
      <button
        onClick={approveAll}
        disabled={approving}
        className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-40 shrink-0"
      >
        {approving ? 'Approving...' : 'Approve All'}
      </button>
    </div>
  );
}
