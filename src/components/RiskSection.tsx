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
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            Single Points of Failure
          </h3>
          <ul className="space-y-3">
            {singlePointsOfFailure.map((spof, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-red-700"
              >
                <span className="text-red-500 mt-0.5 shrink-0">&#9888;</span>
                <span>{spof}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {scalingRisks && scalingRisks.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-600 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
            Scaling Risks
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-200">
                  <th className="text-left py-3 px-4 text-amber-600 font-medium">Area</th>
                  <th className="text-left py-3 px-4 text-amber-600 font-medium">Risk</th>
                  <th className="text-left py-3 px-4 text-amber-600 font-medium">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {scalingRisks.map((risk, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-amber-100"
                  >
                    <td className="py-3 px-4 text-slate-900 font-medium">{risk.area}</td>
                    <td className="py-3 px-4 text-amber-700">{risk.risk}</td>
                    <td className="py-3 px-4 text-slate-600">{risk.mitigation}</td>
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
