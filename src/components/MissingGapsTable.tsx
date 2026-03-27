'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { RankedOpportunity } from '@/lib/types';
import { usePriorityModal } from './PriorityModalContext';

interface MissingGapsTableProps {
  opportunities: RankedOpportunity[];
}

function buildPrompt(opp: RankedOpportunity): string {
  const rawText = !opp.parsedTimeSavings.valid ? opp.parsedTimeSavings.rawText : '';
  const deps = opp.dependencies.length > 0 ? opp.dependencies.join(', ') : 'None listed';
  return `I need help estimating the time savings for an automation priority so I can add it to our tracking system. I'll give you all the context we have, then you ask me questions to fill in the gaps.

## Priority Details

- **Department:** ${opp.departmentName}
- **Priority #${opp.rank}:** ${opp.name}
- **Impact:** ${opp.impact} | **Complexity:** ${opp.complexity} | **Effort:** ${opp.effort}

## What To Automate
${opp.whatToAutomate}

## Current State
${opp.currentState}

## Why It Matters
${opp.whyItMatters}
${opp.suggestedApproach ? `
## Suggested Approach
${opp.suggestedApproach}
` : ''}
## Success Criteria
${opp.successCriteria}

## Dependencies
${deps}

## Current Time Estimate
${rawText ? `"${rawText}" (not in a valid hours/week format)` : 'No time estimate provided yet.'}

---

Based on all the above context, ask me questions ONE AT A TIME to understand:
1. What specific tasks are involved in this process today and how many people do them
2. How often these tasks are performed (daily, weekly, monthly)
3. How long each occurrence takes manually
4. What percentage of the work could realistically be automated

Use the context above to make your questions specific — don't ask me things that are already answered above. After gathering enough information, calculate the estimated hours saved per week and generate a corrected markdown snippet for this priority's "Estimated Time Savings" field in the format: **Estimated Time Savings:** X-Y hours/week

Only output the corrected line at the end, so I can update the markdown file.`;
}

function InstructionPanel({ opp }: { opp: RankedOpportunity }) {
  const [copied, setCopied] = useState(false);
  const [guideOpen, setGuideOpen] = useState(true);
  const prompt = buildPrompt(opp);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="px-4 py-4 bg-white border-t border-slate-100 space-y-4">
      {/* How to use guide */}
      <div>
        <button
          type="button"
          onClick={() => setGuideOpen(!guideOpen)}
          className="text-sm font-medium text-slate-700 flex items-center gap-1"
        >
          <span className={`transition-transform ${guideOpen ? 'rotate-90' : ''}`}>▶</span>
          How to use this
        </button>
        {guideOpen && (
          <ol className="mt-2 ml-5 text-sm text-slate-600 list-decimal space-y-1">
            <li>Copy the prompt below</li>
            <li>Paste it into <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">Claude</a> and answer its questions</li>
            <li>Upload the generated <code className="bg-slate-100 px-1 rounded">.md</code> file using the button below</li>
          </ol>
        )}
      </div>

      {/* Prompt block */}
      <div className="relative">
        <button
          type="button"
          onClick={copyPrompt}
          className="absolute top-2 right-2 px-2.5 py-1 text-xs font-medium rounded bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 pr-20 text-xs text-slate-700 whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
          {prompt}
        </pre>
      </div>

      {/* Upload Fix button */}
      <Link
        href={`/upload?type=priorities&dept=${opp.departmentSlug}`}
        className="inline-block px-4 py-2 text-sm font-medium rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
      >
        Upload Fix
      </Link>
    </div>
  );
}

export default function MissingGapsTable({ opportunities }: MissingGapsTableProps) {
  const { openModal } = usePriorityModal();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Issue</th>
            <th className="px-4 py-3">Current Text</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => {
            const key = `${opp.departmentSlug}-${opp.rank}`;
            const isExpanded = expandedKey === key;
            return (
              <React.Fragment key={key}>
                <tr className="border-b border-slate-100">
                  <td
                    className="px-4 py-3 text-slate-900 font-medium cursor-pointer hover:text-emerald-700"
                    onClick={() => openModal(opp)}
                  >
                    #{opp.rank} — {opp.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {opp.departmentName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded border text-xs font-medium bg-amber-100 text-amber-700 border-amber-200">
                      {!opp.parsedTimeSavings.valid ? opp.parsedTimeSavings.issue : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-md truncate">
                    {!opp.parsedTimeSavings.valid ? (opp.parsedTimeSavings.rawText || '(no time estimate provided)') : ''}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedKey(isExpanded ? null : key);
                      }}
                      className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      {isExpanded ? 'Close' : 'Instructions'}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-b border-slate-100">
                    <td colSpan={5} className="p-0">
                      <InstructionPanel opp={opp} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
