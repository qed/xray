'use client';

import { useState } from 'react';
import type { ProjectBrief } from '@/lib/types';

interface Props {
  briefs: ProjectBrief[];
  orgName: string;
}

export default function BriefsView({ briefs, orgName }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(briefs[0]?.id || null);

  if (briefs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Briefs</h1>
          <p className="text-slate-500 mt-1">{orgName}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-sm">No project briefs yet. Briefs are created automatically when intake extractions are approved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Project Briefs</h1>
        <p className="text-slate-500 mt-1">{orgName} — {briefs.length} department{briefs.length !== 1 ? 's' : ''} assessed</p>
      </div>

      <div className="space-y-4">
        {briefs.map((brief) => {
          const expanded = expandedId === brief.id;
          const profile = brief.profile_snapshot;
          const priorities = brief.priorities_snapshot;

          return (
            <div key={brief.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div
                className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                onClick={() => setExpandedId(expanded ? null : brief.id)}
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{brief.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(brief.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {' · '}{brief.team_count} team member{brief.team_count !== 1 ? 's' : ''}
                    {' · '}{priorities.length} priorities
                  </p>
                </div>
                <span className={`text-xs transition-transform ${expanded ? 'rotate-90' : ''}`}>&#9654;</span>
              </div>

              {/* Expanded */}
              {expanded && (
                <div className="border-t border-slate-100 px-5 py-5 bg-slate-50/50 space-y-5">
                  {/* Mission & Scope */}
                  {profile.mission && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Mission</h4>
                      <p className="text-sm text-slate-700">{profile.mission}</p>
                    </div>
                  )}
                  {profile.scope && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Scope</h4>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{profile.scope}</p>
                    </div>
                  )}

                  {/* Tools */}
                  {profile.tools?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Tools</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.tools.map((t, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-slate-200 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risks */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {profile.painPoints?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Pain Points</h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {profile.painPoints.map((p, i) => (
                            <li key={i} className="flex gap-1.5">
                              <span className="text-amber-500 shrink-0">•</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {profile.singlePointsOfFailure?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-red-500 uppercase mb-1">Single Points of Failure</h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {profile.singlePointsOfFailure.map((s, i) => (
                            <li key={i} className="flex gap-1.5">
                              <span className="text-red-500 shrink-0">•</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {profile.tribalKnowledgeRisks?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Tribal Knowledge Risks</h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {profile.tribalKnowledgeRisks.map((t, i) => (
                            <li key={i} className="flex gap-1.5">
                              <span className="text-slate-400 shrink-0">•</span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Priorities */}
                  {priorities.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">
                        AI & Automation Priorities ({priorities.length})
                      </h4>
                      <div className="space-y-2">
                        {priorities.map((p, i) => (
                          <div key={i} className="bg-white border border-slate-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                                {p.rank}
                              </span>
                              <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                              <span className="text-xs text-emerald-600 ml-auto">{p.estimatedTimeSavings}</span>
                            </div>
                            <p className="text-xs text-slate-600 ml-8">{p.whatToAutomate}</p>
                            <div className="flex gap-3 mt-1.5 ml-8">
                              <span className="text-[10px] text-slate-400">Effort: {p.effort || '—'}</span>
                              <span className="text-[10px] text-slate-400">Complexity: {p.complexity || '—'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
