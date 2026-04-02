'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { buildIntakeContext } from '@/lib/prompts';

interface IntakeChatProps {
  orgId: string;
  orgName: string;
  existingConversationId?: string;
  existingMessages?: { role: 'user' | 'assistant'; content: string }[];
  isExtracted?: boolean;
}

export default function IntakeChat({
  orgId,
  orgName,
  existingConversationId,
  existingMessages,
  isExtracted,
}: IntakeChatProps) {
  const [extracted, setExtracted] = useState(isExtracted || false);
  const [extractionData, setExtractionData] = useState<Record<string, unknown> | null>(null);

  const contextSummary = buildIntakeContext(orgName);

  return (
    <div className="flex flex-col h-full">
      {extracted && extractionData && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-800">
                Interview complete. Data extracted and ready for review.
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <ChatInterface
          orgId={orgId}
          mode="intake"
          context={{ summary: contextSummary }}
          existingConversationId={existingConversationId}
          existingMessages={existingMessages}
          greeting={`I'll be mapping your department at ${orgName} to identify automation and AI opportunities. This conversation usually takes about 15-20 minutes. Just tell me about your role and department, and I'll guide you through the rest.`}
          onExtraction={(data) => {
            setExtracted(true);
            setExtractionData(data as Record<string, unknown>);
          }}
        />
      </div>
    </div>
  );
}
