'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TourStep {
  title: string;
  description: string;
  route: string;
  highlights: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Dashboard',
    description:
      'The command center. See score cards for total opportunities, time savings potential, and completion rates. Track strategic blockers and view milestone progress on the chart.',
    route: '/dashboard',
    highlights: [
      'Score cards with key metrics at a glance',
      'Time savings potential vs. realized hours',
      'Strategic blockers affecting multiple priorities',
      'Milestone chart showing progress across all departments',
    ],
  },
  {
    title: 'AI Priorities',
    description:
      'The full list of automation priorities across every department. Sort by impact, effort, or score. Filter by department. Click any row to see the full detail modal.',
    route: '/',
    highlights: [
      'Sortable table with all priorities',
      'Filter by department or impact level',
      'Click any row for the detail modal',
      'Score computed from impact and effort',
    ],
  },
  {
    title: 'Implementation Tracker',
    description:
      'A kanban board showing every priority organized into four milestone columns: Not Started, Planning, In Progress, and Complete.',
    route: '/tracker',
    highlights: [
      'Kanban board with 4 milestone columns',
      'Cards show department, impact, and effort',
      'Visual progress across the entire pipeline',
      'Quick identification of bottlenecks',
    ],
  },
  {
    title: 'Risks',
    description:
      'A consolidated view of all risks across the organization. Color-coded by severity (critical, high, medium) with type classification (people, process, tool).',
    route: '/risks',
    highlights: [
      'Color-coded severity indicators',
      'Risk type classification (people, process, tool)',
      'Staffing and capacity table',
      'Priorities-per-person ratio for each department',
    ],
  },
  {
    title: 'Dependencies',
    description:
      'An SVG dependency graph showing how departments rely on each other. Below it, a detailed table lists every cross-department dependency.',
    route: '/dependencies',
    highlights: [
      'SVG graph with clickable department nodes',
      'Arrows showing dependency direction',
      'Dependency table with source, target, and related priorities',
      'Strategic blocker identification',
    ],
  },
  {
    title: 'Tools',
    description:
      'A matrix view of every tool used across departments. Shared tools are highlighted. Click any row to see which priorities reference that tool.',
    route: '/tools',
    highlights: [
      'Matrix view with department columns',
      'Green dots for departments using each tool',
      'Shared tools highlighted with emerald badges',
      'Click to see related priorities',
    ],
  },
  {
    title: 'Department Profiles',
    description:
      'Deep-dive into any department. See the team roster, tool stack, milestone pipeline, priority cards, and department-specific risks.',
    route: '/department/accounting',
    highlights: [
      'Team roster with roles and responsibilities',
      'Tool stack used by the department',
      'Milestone pipeline showing priority progress',
      'Department-specific pain points and risks',
    ],
  },
  {
    title: 'Implementation Plans',
    description:
      'Full detail for any single priority. Includes what to automate, current state, why it matters, dependencies, suggested approach, and success criteria.',
    route: '/plan/accounting/priority-1',
    highlights: [
      'Complete priority breakdown',
      'Dependencies and suggested approach',
      'Success criteria and estimated time savings',
      'Direct link from any priority table or card',
    ],
  },
];

export default function TourWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = TOUR_STEPS[currentStep];

  return (
    <div className="space-y-8">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {TOUR_STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`rounded-full transition-all ${
              i === currentStep
                ? 'w-8 h-3 bg-emerald-500'
                : i < currentStep
                  ? 'w-3 h-3 bg-emerald-400'
                  : 'w-3 h-3 bg-slate-300'
            }`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      {/* Step card */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 mb-1">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              {step.title}
            </h2>
          </div>
          <Link
            href={step.route}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shrink-0"
          >
            Open page
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <p className="text-slate-600 mb-6 leading-relaxed">
          {step.description}
        </p>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Highlights
          </h3>
          <ul className="space-y-2">
            {step.highlights.map((highlight, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <span className="inline-block mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentStep((s) => Math.min(TOUR_STEPS.length - 1, s + 1))
          }
          disabled={currentStep === TOUR_STEPS.length - 1}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
