import type { AutomationPriority, MilestoneConfig } from '@/lib/types';

interface ImplementationPlanProps {
  priority: AutomationPriority;
  departmentName: string;
  milestones: MilestoneConfig[];
  currentMilestone: number;
}

interface Capability {
  label: string;
  color: string;
}

function detectCapabilities(approach: string): Capability[] {
  const text = approach.toLowerCase();
  const caps: Capability[] = [];

  if (/cron|schedule|scheduled|recurring/i.test(text)) {
    caps.push({ label: 'Cron Jobs', color: 'bg-purple-100 text-purple-700 border-purple-200' });
  }
  if (/rule|workflow|trigger/i.test(text)) {
    caps.push({ label: 'Skills', color: 'bg-blue-100 text-blue-700 border-blue-200' });
  }
  if (/monitor|alert|watch|detect/i.test(text)) {
    caps.push({ label: 'Auto Mode', color: 'bg-amber-100 text-amber-700 border-amber-200' });
  }
  if (/email|notification|notify|send|slack/i.test(text)) {
    caps.push({ label: 'Channels', color: 'bg-green-100 text-green-700 border-green-200' });
  }
  if (/api|integration|connect|endpoint|webhook/i.test(text)) {
    caps.push({ label: 'MCP Integrations', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' });
  }
  if (/data|memory|store|database|persist|log/i.test(text)) {
    caps.push({ label: 'Persistent Memory', color: 'bg-rose-100 text-rose-700 border-rose-200' });
  }
  if (/plugin|extension|add-on/i.test(text)) {
    caps.push({ label: 'Plugins', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' });
  }

  return caps;
}

const effortColors: Record<string, string> = {
  Low: 'text-emerald-600',
  Medium: 'text-yellow-600',
  High: 'text-red-600',
};

export default function ImplementationPlan({
  priority,
  departmentName,
  milestones,
  currentMilestone,
}: ImplementationPlanProps) {
  const capabilities = detectCapabilities(priority.suggestedApproach);

  return (
    <div className="space-y-6">
      {/* Objective */}
      <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-emerald-600 mb-3">Objective</h2>
        {priority.whatToAutomate && (
          <p className="text-slate-700 mb-2">{priority.whatToAutomate}</p>
        )}
        {priority.whyItMatters && (
          <p className="text-slate-500 text-sm">{priority.whyItMatters}</p>
        )}
      </section>

      {/* Current State */}
      {priority.currentState && (
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-emerald-600 mb-3">Current State</h2>
          <p className="text-slate-600">{priority.currentState}</p>
        </section>
      )}

      {/* Target State */}
      {priority.successCriteria && (
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-emerald-600 mb-3">Target State</h2>
          <p className="text-slate-600">{priority.successCriteria}</p>
        </section>
      )}

      {/* Execution Approach */}
      {priority.suggestedApproach && (
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-emerald-600 mb-3">Execution Approach</h2>
          <p className="text-slate-600 whitespace-pre-line">{priority.suggestedApproach}</p>
        </section>
      )}

      {/* Claude Cowork Capabilities */}
      {capabilities.length > 0 && (
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-emerald-600 mb-3">Claude Cowork Capabilities</h2>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((cap) => (
              <span
                key={cap.label}
                className={`inline-flex items-center text-sm px-3 py-1.5 rounded-full border ${cap.color}`}
              >
                {cap.label}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Dependencies & Blockers */}
      {priority.dependencies.length > 0 && (
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-emerald-600 mb-3">Dependencies &amp; Blockers</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            {priority.dependencies.map((dep, idx) => (
              <li key={idx}>{dep}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Estimated Effort */}
      <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-emerald-600 mb-3">Estimated Effort</h2>
        <div className="flex items-center gap-4">
          <span className={`text-2xl font-bold ${effortColors[priority.effort] ?? 'text-slate-600'}`}>
            {priority.effort}
          </span>
          {priority.estimatedTimeSavings && (
            <span className="text-slate-500 text-sm">
              Time savings: {priority.estimatedTimeSavings}
            </span>
          )}
        </div>
      </section>

      {/* Milestone Pipeline */}
      <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-emerald-600 mb-4">Milestone Definitions</h2>
        <div className="overflow-x-auto">
        <div className="flex gap-0 min-w-[600px]">
          {milestones.map((milestone, idx) => {
            const isCurrent = milestone.id === currentMilestone;
            const isPast = milestone.id < currentMilestone;
            const isLast = idx === milestones.length - 1;

            return (
              <div key={milestone.id} className="flex-1 flex flex-col items-center">
                {/* Connector + dot */}
                <div className="flex items-center w-full">
                  {idx > 0 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        isPast || isCurrent ? 'bg-emerald-300' : 'bg-slate-300'
                      }`}
                    />
                  )}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-600 ring-4 ring-emerald-100'
                        : isPast
                        ? 'bg-emerald-50 text-emerald-500 border-2 border-emerald-400'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                    }`}
                  >
                    M{milestone.id}
                  </div>
                  {!isLast && (
                    <div
                      className={`flex-1 h-0.5 ${
                        isPast ? 'bg-emerald-300' : 'bg-slate-300'
                      }`}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center px-1">
                  <div
                    className={`text-xs font-semibold ${
                      isCurrent ? 'text-emerald-600' : isPast ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  >
                    {milestone.name}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isCurrent ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {milestone.definition}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </section>
    </div>
  );
}
