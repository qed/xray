'use client';

import { PHASE_TITLES, PHASE_TOPICS } from '@/lib/phase-config';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PhaseProgressBarProps {
  currentPhase: number;
  subProgress: { current: number; total: number };
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TOTAL_PHASES = 8;

/* ------------------------------------------------------------------ */
/*  Helpers (exported for testing)                                     */
/* ------------------------------------------------------------------ */

export type PhaseStatus = 'completed' | 'current' | 'future';

export function getPhaseStatus(phase: number, currentPhase: number): PhaseStatus {
  if (phase < currentPhase) return 'completed';
  if (phase === currentPhase) return 'current';
  return 'future';
}

export function getPhaseTitle(phase: number): string {
  return PHASE_TITLES[phase] ?? `Phase ${phase}`;
}

export function getSubProgressLabel(subProgress: { current: number; total: number }): string {
  return `${subProgress.current}/${subProgress.total} topics`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PhaseProgressBar({
  currentPhase,
  subProgress,
  className = '',
}: PhaseProgressBarProps) {
  const phases = Array.from({ length: TOTAL_PHASES }, (_, i) => i + 1);
  const allComplete = currentPhase > TOTAL_PHASES;

  return (
    <div className={className}>
      {/* Desktop: full horizontal bar (hidden below md) */}
      <div className="hidden md:block">
        <div role="list" className="flex items-start gap-0">
          {phases.map((phase, idx) => {
            const status = allComplete
              ? 'completed'
              : getPhaseStatus(phase, currentPhase);
            const title = getPhaseTitle(phase);

            return (
              <div key={phase} className="flex items-center flex-1 last:flex-initial">
                <div
                  role="listitem"
                  aria-current={status === 'current' ? 'step' : undefined}
                  className="flex flex-col items-center min-w-0"
                >
                  {/* Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      status === 'completed'
                        ? 'bg-emerald-100 text-emerald-600'
                        : status === 'current'
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {status === 'completed' ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      phase
                    )}
                  </div>

                  {/* Title */}
                  <span
                    className={`text-[10px] mt-1 text-center leading-tight max-w-[80px] ${
                      status === 'current'
                        ? 'text-emerald-600 font-semibold'
                        : status === 'completed'
                          ? 'text-emerald-500'
                          : 'text-slate-400'
                    }`}
                  >
                    {title}
                  </span>

                  {/* Sub-progress for current phase */}
                  {status === 'current' && (
                    <span
                      aria-live="polite"
                      className="text-[10px] text-emerald-600 font-medium mt-0.5"
                    >
                      {getSubProgressLabel(subProgress)}
                    </span>
                  )}
                </div>

                {/* Connector line */}
                {idx < TOTAL_PHASES - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 mt-[-20px] self-start translate-y-[15px] ${
                      status === 'completed' ? 'bg-emerald-300' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: compact single-line display (visible below md) */}
      <div className="md:hidden">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
            Phase {Math.min(currentPhase, TOTAL_PHASES)}/{TOTAL_PHASES}:
          </span>
          <span className="text-sm text-emerald-600 font-medium truncate">
            {allComplete ? 'Complete' : getPhaseTitle(currentPhase)}
          </span>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 mt-2">
          {phases.map((phase) => {
            const status = allComplete
              ? 'completed'
              : getPhaseStatus(phase, currentPhase);
            return (
              <div
                key={phase}
                className={`h-2 rounded-full transition-all ${
                  status === 'current'
                    ? 'w-6 bg-emerald-600'
                    : status === 'completed'
                      ? 'w-2 bg-emerald-400'
                      : 'w-2 bg-slate-200'
                }`}
              />
            );
          })}
        </div>

        {/* Sub-progress on mobile */}
        {!allComplete && (
          <div aria-live="polite" className="text-xs text-slate-500 mt-1">
            {getSubProgressLabel(subProgress)}
          </div>
        )}
      </div>
    </div>
  );
}
