'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import PhaseProgressBar from '@/components/PhaseProgressBar';
import ChatInterface from '@/components/ChatInterface';
import OverwriteDialog from '@/components/OverwriteDialog';
import CompletionScreen from './CompletionScreen';
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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedDepartmentId, setSavedDepartmentId] = useState<string | null>(null);
  const [overwriteDialog, setOverwriteDialog] = useState<{
    departmentName: string;
    extractedData: Record<string, unknown>;
    conversationId: string;
  } | null>(null);
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

  // ── Completion helpers ──────────────────────────────────────────────

  /** Call the /api/intake/complete endpoint */
  const callComplete = useCallback(
    async (
      payload: Record<string, unknown>,
    ): Promise<{ success?: boolean; exists?: boolean; departmentId?: string; error?: string }> => {
      const res = await fetch('/api/intake/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    [],
  );

  /** Persist extraction data with the given mode */
  const saveExtraction = useCallback(
    async (
      extractedData: Record<string, unknown>,
      convId: string,
      mode: 'create' | 'overwrite',
    ) => {
      setSaving(true);
      setSaveError(null);
      try {
        const deptName =
          (extractedData.profile as Record<string, unknown> | undefined)?.name as string | undefined;
        const result = await callComplete({
          orgId,
          extractedData,
          conversationId: convId,
          departmentName: deptName ?? 'Unknown',
          mode,
        });

        if (result.success && result.departmentId) {
          setSavedDepartmentId(result.departmentId);
          setIsComplete(true);
        } else {
          setSaveError(result.error ?? 'Unknown error while saving.');
        }
      } catch (err) {
        setSaveError(String(err));
      } finally {
        setSaving(false);
      }
    },
    [callComplete, orgId],
  );

  // Handle extraction completion
  const handleExtraction = useCallback(
    async (data: unknown, convId: string) => {
      const extractedData = data as Record<string, unknown>;
      const deptName =
        (extractedData.profile as Record<string, unknown> | undefined)?.name as string | undefined;

      if (!deptName) {
        // No department name — just create directly
        await saveExtraction(extractedData, convId, 'create');
        return;
      }

      // Check if department already exists
      try {
        const check = await callComplete({
          orgId,
          departmentName: deptName,
        });

        if (check.exists) {
          // Show overwrite dialog
          setOverwriteDialog({
            departmentName: deptName,
            extractedData,
            conversationId: convId,
          });
        } else {
          // No conflict — create directly
          await saveExtraction(extractedData, convId, 'create');
        }
      } catch (err) {
        setSaveError(String(err));
      }
    },
    [callComplete, orgId, saveExtraction],
  );

  /** Check if a department name exists (used by OverwriteDialog rename validation) */
  const checkDeptExists = useCallback(
    async (name: string): Promise<boolean> => {
      const result = await callComplete({ orgId, departmentName: name });
      return !!result.exists;
    },
    [callComplete, orgId],
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

  // ── Show CompletionScreen when interview is done and data is saved ──
  if (isComplete && savedDepartmentId) {
    return <CompletionScreen departmentId={savedDepartmentId} orgSlug={orgSlug} />;
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

      {/* Saving indicator */}
      {saving && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border-b border-blue-100 text-blue-700">
          <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium">Saving department data...</span>
        </div>
      )}

      {/* Error banner with retry */}
      {saveError && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-100 text-red-700">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Save failed: {saveError}</span>
          </div>
          <button
            onClick={() => setSaveError(null)}
            className="text-sm font-medium text-red-800 underline hover:no-underline"
          >
            Dismiss
          </button>
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
          greeting="Ready to start your Department X-Ray — a structured deep-dive covering team structure, workflows, tools, pain points, and automation priorities."
          autoSendMessage={!existingMessages?.length ? 'Start the department X-Ray interview.' : undefined}
        />
      </div>

      {/* Overwrite / rename dialog */}
      {overwriteDialog && (
        <OverwriteDialog
          departmentName={overwriteDialog.departmentName}
          checkExists={checkDeptExists}
          onOverwrite={async () => {
            setOverwriteDialog(null);
            await saveExtraction(
              overwriteDialog.extractedData,
              overwriteDialog.conversationId,
              'overwrite',
            );
          }}
          onRename={async (newName: string) => {
            setOverwriteDialog(null);
            // Patch the department name in extracted data
            const patched = { ...overwriteDialog.extractedData };
            if (patched.profile && typeof patched.profile === 'object') {
              patched.profile = { ...(patched.profile as Record<string, unknown>), name: newName };
            }
            await saveExtraction(patched, overwriteDialog.conversationId, 'create');
          }}
          onCancel={() => setOverwriteDialog(null)}
        />
      )}
    </div>
  );
}
