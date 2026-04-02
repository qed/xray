'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Extraction {
  id: string;
  extracted_data: {
    profile?: {
      name: string;
      mission: string;
      scope: string;
      teamMembers: { name: string; title: string; responsibilities: string }[];
      tools: string[];
      singlePointsOfFailure: string[];
      painPoints: string[];
      tribalKnowledgeRisks: string[];
    };
    priorities?: {
      rank: number;
      name: string;
      whatToAutomate: string;
      currentState: string;
      whyItMatters: string;
      estimatedTimeSavings: string;
      effort: string;
      complexity: string;
      dependencies: string[];
      suggestedApproach: string;
      successCriteria: string;
    }[];
    priorityId?: string;
    fields?: Record<string, string | string[]>;
  };
  conversation: {
    id: string;
    mode: string;
    user_id: string;
    created_at: string;
  };
  created_at: string;
}

interface Props {
  extractions: Extraction[];
  orgId: string;
  orgSlug: string;
}

export default function ExtractionReview({ extractions, orgId, orgSlug }: Props) {
  const router = useRouter();
  const [approving, setApproving] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(extractions[0]?.id || null);

  async function handleApprove(extraction: Extraction) {
    setApproving(extraction.id);

    const res = await fetch('/api/extractions/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        extractionId: extraction.id,
        orgId,
        mode: extraction.conversation.mode,
      }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(`Failed to approve: ${data.error}`);
    }

    setApproving(null);
  }

  return (
    <div className="space-y-4">
      {extractions.map((ext) => {
        const data = ext.extracted_data;
        const isIntake = ext.conversation.mode === 'intake';
        const expanded = expandedId === ext.id;

        return (
          <div key={ext.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              onClick={() => setExpandedId(expanded ? null : ext.id)}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isIntake ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {isIntake ? 'INTAKE' : 'GAP FILL'}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {isIntake ? data.profile?.name || 'New Department' : `Priority: ${data.priorityId?.slice(0, 8)}`}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(ext.created_at).toLocaleString()}
                  {isIntake && data.priorities && ` · ${data.priorities.length} priorities identified`}
                  {!isIntake && data.fields && ` · ${Object.keys(data.fields).length} fields filled`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleApprove(ext); }}
                  disabled={approving === ext.id}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40"
                >
                  {approving === ext.id ? 'Approving...' : 'Approve'}
                </button>
                <span className={`text-xs transition-transform ${expanded ? 'rotate-90' : ''}`}>&#9654;</span>
              </div>
            </div>

            {/* Expanded content */}
            {expanded && (
              <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
                {isIntake && data.profile && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Mission</h4>
                      <p className="text-sm text-slate-700">{data.profile.mission}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Scope</h4>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{data.profile.scope}</p>
                    </div>
                    {data.profile.teamMembers?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">
                          Team ({data.profile.teamMembers.length})
                        </h4>
                        <div className="space-y-1">
                          {data.profile.teamMembers.map((tm, i) => (
                            <div key={i} className="text-sm text-slate-700">
                              <span className="font-medium">{tm.name}</span> — {tm.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {data.profile.tools?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Tools</h4>
                        <div className="flex flex-wrap gap-1">
                          {data.profile.tools.map((t, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-slate-200 rounded-full">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {data.priorities && data.priorities.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">
                          Priorities ({data.priorities.length})
                        </h4>
                        <div className="space-y-2">
                          {data.priorities.map((p, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                                  {p.rank}
                                </span>
                                <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                                <span className="text-xs text-slate-400 ml-auto">{p.estimatedTimeSavings}</span>
                              </div>
                              <p className="text-xs text-slate-600">{p.whatToAutomate}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!isIntake && data.fields && (
                  <div className="space-y-3">
                    {Object.entries(data.fields).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-sm text-slate-700">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
