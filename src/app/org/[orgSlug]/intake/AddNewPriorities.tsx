'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { buildNewPrioritiesContext } from '@/lib/prompts';
import { createClient } from '@/lib/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AddNewPrioritiesProps {
  departmentId: string;
  orgId: string;
  orgSlug: string;
}

interface DepartmentProfile {
  name: string;
  mission?: string;
  scope?: string;
  teamMembers: { name: string; title: string; responsibilities?: string }[];
  tools: { name: string }[];
  painPoints?: string[];
}

interface ExistingPriority {
  name: string;
  rank?: number;
  estimatedTimeSavings?: string;
  whatToAutomate?: string;
}

interface ExistingConversation {
  id: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
}

interface AddedPrioritySummary {
  count: number;
  names: string[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AddNewPriorities({ departmentId, orgId, orgSlug }: AddNewPrioritiesProps) {
  const router = useRouter();

  // Data loading
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState('');
  const [departmentProfile, setDepartmentProfile] = useState<DepartmentProfile | null>(null);
  const [existingPriorities, setExistingPriorities] = useState<ExistingPriority[]>([]);

  // Conversation state
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [existingMessages, setExistingMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[] | undefined
  >(undefined);
  const [isResuming, setIsResuming] = useState(false);
  const resumeHandled = useRef(false);

  // Completion state
  const [showCompletion, setShowCompletion] = useState(false);
  const [addedPriority, setAddedPriority] = useState<AddedPrioritySummary | null>(null);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Key to force ChatInterface remount on "Add Another"
  const [chatKey, setChatKey] = useState(0);

  /* ---------------------------------------------------------------- */
  /*  Load department data + check for existing conversation           */
  /* ---------------------------------------------------------------- */

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Fetch org name, department, team members, priorities in parallel
      const [orgRes, deptRes, teamRes, prioRes, convoRes] = await Promise.all([
        supabase.from('organizations').select('name').eq('id', orgId).single(),
        supabase.from('departments').select('*').eq('id', departmentId).single(),
        supabase.from('team_members').select('name, title, responsibilities').eq('department_id', departmentId),
        supabase
          .from('priorities')
          .select('name, rank, estimated_time_savings, what_to_automate')
          .eq('department_id', departmentId)
          .order('rank'),
        supabase
          .from('conversations')
          .select('id, messages')
          .eq('org_id', orgId)
          .eq('department_id', departmentId)
          .eq('mode', 'new-priorities')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (orgRes.error) throw orgRes.error;
      if (deptRes.error) throw deptRes.error;

      const dept = deptRes.data;
      setOrgName(orgRes.data.name);

      setDepartmentProfile({
        name: dept.name,
        mission: dept.mission || undefined,
        scope: dept.scope || undefined,
        teamMembers: (teamRes.data || []).map((m: { name: string; title: string; responsibilities?: string }) => ({
          name: m.name,
          title: m.title,
          responsibilities: m.responsibilities || undefined,
        })),
        tools: (dept.tools || []).map((t: string) => ({ name: t })),
        painPoints: dept.pain_points || undefined,
      });

      setExistingPriorities(
        (prioRes.data || []).map((p: { name: string; rank: number; estimated_time_savings: string; what_to_automate: string }) => ({
          name: p.name,
          rank: p.rank,
          estimatedTimeSavings: p.estimated_time_savings || undefined,
          whatToAutomate: p.what_to_automate || undefined,
        })),
      );

      // Check for existing active conversation to resume
      if (convoRes.data) {
        const conv = convoRes.data as ExistingConversation;
        setConversationId(conv.id);
        if (Array.isArray(conv.messages) && conv.messages.length > 0) {
          setExistingMessages(conv.messages);
        }
        setIsResuming(true);
      }
    } catch (err) {
      console.error('Failed to load department data:', err);
      setError('Failed to load department data. Please try again.');
    }

    setLoading(false);
  }, [departmentId, orgId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------------------------------------------------------------- */
  /*  Build context for ChatInterface                                  */
  /* ---------------------------------------------------------------- */

  const contextSummary = departmentProfile
    ? buildNewPrioritiesContext(
        orgName,
        departmentProfile.name,
        {
          mission: departmentProfile.mission,
          scope: departmentProfile.scope,
          teamMembers: departmentProfile.teamMembers,
          tools: departmentProfile.tools,
          painPoints: departmentProfile.painPoints,
        },
        existingPriorities,
      )
    : '';

  /* ---------------------------------------------------------------- */
  /*  Handle extraction                                                */
  /* ---------------------------------------------------------------- */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExtraction = useCallback(
    async (data: any, convId: string) => {
      setApplying(true);
      setError(null);

      try {
        // The new-priorities prompt produces { newPriorities: [...] }
        // The apply_extraction SQL function expects { priorities: [...] }
        const newPriorities = (data.newPriorities as Array<Record<string, unknown>>) || [];
        const transformedData = {
          priorities: newPriorities,
        };

        const res = await fetch('/api/intake/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orgId,
            extractedData: transformedData,
            conversationId: convId,
            departmentName: departmentProfile?.name || '',
            mode: 'append',
          }),
        });

        if (!res.ok) {
          const errBody = await res.json();
          throw new Error(errBody.error || `Failed: ${res.status}`);
        }

        // Build summary of what was added
        const names = newPriorities.map((p) => (p.name as string) || 'Untitled');
        setAddedPriority({
          count: names.length,
          names,
        });
        setShowCompletion(true);
      } catch (err) {
        console.error('Failed to apply extraction:', err);
        setError(err instanceof Error ? err.message : 'Failed to save priorities.');
      }

      setApplying(false);
    },
    [orgId, departmentProfile],
  );

  /* ---------------------------------------------------------------- */
  /*  Resume: clear loading indicator on first assistant message        */
  /* ---------------------------------------------------------------- */

  const handleFirstAssistantMessage = useCallback(() => {
    if (isResuming && !resumeHandled.current) {
      resumeHandled.current = true;
      setIsResuming(false);
    }
  }, [isResuming]);

  /* ---------------------------------------------------------------- */
  /*  "Add Another" — reset chat, reload data                          */
  /* ---------------------------------------------------------------- */

  const handleAddAnother = useCallback(() => {
    setShowCompletion(false);
    setAddedPriority(null);
    setConversationId(undefined);
    setExistingMessages(undefined);
    setIsResuming(false);
    resumeHandled.current = false;
    setChatKey((k) => k + 1);

    // Reload data so context includes the just-added priority
    loadData();
  }, [loadData]);

  /* ---------------------------------------------------------------- */
  /*  Render: loading                                                  */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading department data...</span>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render: error                                                    */
  /* ---------------------------------------------------------------- */

  if (error && !departmentProfile) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <button
            onClick={loadData}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render: completion screen                                        */
  /* ---------------------------------------------------------------- */

  if (showCompletion && addedPriority) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="max-w-md w-full mx-auto text-center px-6">
          {/* Success icon */}
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            {addedPriority.count === 1
              ? 'New Priority Added'
              : `${addedPriority.count} New Priorities Added`}
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Successfully added to {departmentProfile?.name}.
          </p>

          {/* Priority names list */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-6 text-left">
            <ul className="space-y-2">
              {addedPriority.names.map((name, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleAddAnother}
              className="px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Add Another AI Priority
            </button>
            <button
              onClick={() => router.push(`/org/${orgSlug}/priorities`)}
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              Back to AI Priorities
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render: chat interface                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="flex flex-col h-full">
      {/* Resume loading indicator */}
      {isResuming && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border-b border-amber-100 text-amber-700">
          <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium">Claude is reviewing your previous conversation...</span>
        </div>
      )}

      {/* Applying indicator */}
      {applying && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border-b border-emerald-100 text-emerald-700">
          <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium">Saving new priorities...</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border-b border-red-100 text-red-700">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 min-h-0">
        <ChatInterface
          key={chatKey}
          orgId={orgId}
          mode="new-priorities"
          context={{ summary: contextSummary }}
          existingConversationId={conversationId}
          existingMessages={existingMessages}
          onExtraction={handleExtraction}
          onFirstAssistantMessage={handleFirstAssistantMessage}
          greeting={
            departmentProfile
              ? `Let's find new automation and AI opportunities for ${departmentProfile.name}. I've reviewed the department profile and ${existingPriorities.length} existing priorities — I'll help identify what's new or missing.`
              : 'Let\'s discover new AI priorities for your department.'
          }
        />
      </div>
    </div>
  );
}
