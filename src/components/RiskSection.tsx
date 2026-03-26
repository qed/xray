import type { ScalingRisk } from '@/lib/types';

interface RiskSectionProps {
  singlePointsOfFailure: string[];
  scalingRisks?: ScalingRisk[];
}

export default function RiskSection({ singlePointsOfFailure, scalingRisks }: RiskSectionProps) {
  if (singlePointsOfFailure.length === 0 && (!scalingRisks || scalingRisks.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {singlePointsOfFailure.length > 0 && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            Single Points of Failure
          </h3>
          <ul className="space-y-3">
            {singlePointsOfFailure.map((spof, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-amber-200/90"
              >
                <span className="text-red-400 mt-0.5 shrink-0">&#9888;</span>
                <span>{spof}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {scalingRisks && scalingRisks.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
            Scaling Risks
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-900/40">
                  <th className="text-left py-3 px-4 text-amber-400/80 font-medium">Area</th>
                  <th className="text-left py-3 px-4 text-amber-400/80 font-medium">Risk</th>
                  <th className="text-left py-3 px-4 text-amber-400/80 font-medium">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {scalingRisks.map((risk, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-amber-900/20"
                  >
                    <td className="py-3 px-4 text-white font-medium">{risk.area}</td>
                    <td className="py-3 px-4 text-amber-200/80">{risk.risk}</td>
                    <td className="py-3 px-4 text-slate-300">{risk.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
