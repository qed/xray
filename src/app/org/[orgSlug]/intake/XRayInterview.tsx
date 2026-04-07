'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import PhaseProgressBar from '@/components/PhaseProgressBar';
import ChatInterface from '@/components/ChatInterface';
import { PHASE_TOPICS } from '@/lib/phase-config';
import { createClient } from '@/lib/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface XRayInterviewProps {
  departmentId: string | null;
  orgId: string;
  orgSlug: string;
}

interface ExistingConversation {
  id: string;
  context: Record<string, unknown> | null;
  messages: { role: 'user' | 'assistant'; content: string }[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function XRayInterview({ departmentId, orgId, orgSlug }: XRayInterviewProps) {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [subProgress, setSubProgress] = useState({ current: 0, total: PHASE_TOPICS[1] || 5 });
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [existingMessages, setExistingMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[] | undefined
  >(undefined);
  const [isResuming, setIsResuming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const resumeHandled = useRef(false);

  // Load existing conversation on mount
  useEffect(() => {
    let cancelled = false;

    async function loadExistingConversation() {
      if (!departmentId) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('conversations')
          .select('id, context, messages')
          .eq('org_id', orgId)
          .eq('department_id', departmentId)
          .eq('mode', 'intake')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error('Error loading conversation:', error);
          setLoading(false);
          return;
        }

        if (data) {
          const conv = data as ExistingConversation;
          setConversationId(conv.id);

          // Restore phase from context JSONB
          const ctx = conv.context;
          if (ctx && typeof ctx === 'object') {
            const phase = typeof ctx.currentPhase === 'number' ? ctx.currentPhase : 1;
            const sub =
              ctx.subProgress &&
              typeof ctx.subProgress === 'object' &&
              typeof (ctx.subProgress as Record<string, unknown>).current === 'number'
                ? (ctx.subProgress as { current: number; total: number })
                : { current: 0, total: PHASE_TOPICS[phase] || 5 };
            setCurrentPhase(phase);
            setSubProgress(sub);
          }

          // Load existing messages
          if (Array.isArray(conv.messages) && conv.messages.length > 0) {
            setExistingMessages(conv.messages);
          }

          setIsResuming(true);
        }
      } catch (err) {
        console.error('Failed to load conversation:', err);
      }

      if (!cancelled) {
        setLoading(false);
      }
    }

    loadExistingConversation();
    return () => {
      cancelled = true;
    };
  }, [departmentId, orgId]);

  // Handle phase changes from ChatInterface SSE events
  const handlePhaseChange = useCallback(
    (phase: number, sub: { current: number; total: number }) => {
      setCurrentPhase(phase);
      setSubProgress(sub);
    },
    [],
  );

  // Handle topic changes from ChatInterface SSE events
  const handleTopicChange = useCallback(
    (_phase: number, sub: { current: number; total: number }) => {
      setSubProgress(sub);
    },
    [],
  );

  // Handle extraction completion
  const handleExtraction = useCallback(
    (data: unknown, convId: string) => {
      setIsComplete(true);
      // Future: parent will show OverwriteDialog
      console.log('Extraction received:', { data, convId });
    },
    [],
  );

  // Clear resuming state when first assistant message arrives
  const handleFirstAssistantMessage = useCallback(() => {
    if (isResuming && !resumeHandled.current) {
      resumeHandled.current = true;
      setIsResuming(false);
    }
  }, [isResuming]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm">Loading interview...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Phase progress bar docked at top */}
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <PhaseProgressBar
          currentPhase={currentPhase}
          subProgress={subProgress}
        />
      </div>

      {/* Resume loading indicator */}
      {isResuming && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border-b border-amber-100 text-amber-700">
          <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium">Claude is reviewing your progress...</span>
        </div>
      )}

      {/* Completion banner */}
      {isComplete && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border-b border-emerald-100 text-emerald-700">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">
            Interview complete! Data has been extracted.
          </span>
        </div>
      )}

      {/* Chat interface */}
      <div className="flex-1 min-h-0">
        <ChatInterface
          orgId={orgId}
          mode="intake"
          existingConversationId={conversationId}
          existingMessages={existingMessages}
          onExtraction={handleExtraction}
          onPhaseChange={handlePhaseChange}
          onTopicChange={handleTopicChange}
          onFirstAssistantMessage={handleFirstAssistantMessage}
          greeting={
            departmentId
              ? 'Let\'s continue mapping out your department. Pick up where you left off or provide any new details.'
              : 'Let\'s get to know your department. I\'ll walk you through 8 phases covering everything from team structure to automation priorities.'
          }
        />
      </div>
    </div>
  );
}
