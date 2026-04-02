'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { buildGapFillContext } from '@/lib/prompts';

interface GapFillChatProps {
  orgId: string;
  departmentName: string;
  priorityName: string;
  priorityId: string;
  existingData: Record<string, string>;
  missingFields: string[];
  existingConversationId?: string;
  existingMessages?: { role: 'user' | 'assistant'; content: string }[];
  orgSlug: string;
}

export default function GapFillChat({
  orgId,
  departmentName,
  priorityName,
  priorityId,
  existingData,
  missingFields,
  existingConversationId,
  existingMessages,
  orgSlug,
}: GapFillChatProps) {
  const router = useRouter();
  const [extracted, setExtracted] = useState(false);

  const contextSummary = buildGapFillContext(
    departmentName,
    priorityName,
    priorityId,
    existingData,
    missingFields,
  );

  const fieldLabels: Record<string, string> = {
    what_to_automate: 'what to automate',
    current_state: 'current state',
    why_it_matters: 'why it matters',
    estimated_time_savings: 'time savings',
    effort: 'effort level',
    complexity: 'complexity',
    dependencies: 'dependencies',
    suggested_approach: 'approach',
    success_criteria: 'success criteria',
  };

  const missingLabels = missingFields.map((f) => fieldLabels[f] || f).join(', ');

  return (
    <div className="flex flex-col h-full">
      {extracted && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-800">
                Gaps filled. Data extracted and ready for review.
              </span>
            </div>
            <button
              onClick={() => router.push(`/org/${orgSlug}/unfiled`)}
              className="text-sm text-emerald-700 hover:text-emerald-900 font-medium"
            >
              Back to Missing Gaps
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <ChatInterface
          orgId={orgId}
          mode="gap-fill"
          context={{ summary: contextSummary }}
          existingConversationId={existingConversationId}
          existingMessages={existingMessages}
          greeting={`I need to fill in some details about "${priorityName}" in ${departmentName}. Specifically: ${missingLabels}. Just tell me what you know and I'll capture it.`}
          onExtraction={() => {
            setExtracted(true);
          }}
        />
      </div>
    </div>
  );
}
