interface StaffingOverview {
  slug: string;
  name: string;
  teamSize: number;
  priorityCount: number;
  prioritiesPerPerson: number;
}

interface StaffingTableProps {
  staffing: StaffingOverview[];
}

function perPersonBadgeClass(value: number): string {
  if (value >= 3.5) return 'bg-red-100 text-red-700';
  if (value >= 2) return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
}

export default function StaffingTable({ staffing }: StaffingTableProps) {
  const sorted = [...staffing].sort(
    (a, b) => b.prioritiesPerPerson - a.prioritiesPerPerson
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-slate-600 font-medium">
              Department
            </th>
            <th className="text-right py-3 px-4 text-slate-600 font-medium">
              Team Size
            </th>
            <th className="text-right py-3 px-4 text-slate-600 font-medium">
              Priorities
            </th>
            <th className="text-right py-3 px-4 text-slate-600 font-medium">
              Per Person
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((dept) => (
            <tr key={dept.slug} className="border-b border-slate-100">
              <td className="py-3 px-4 text-slate-900 font-medium">
                {dept.name}
              </td>
              <td className="py-3 px-4 text-right text-slate-600">
                {dept.teamSize}
              </td>
              <td className="py-3 px-4 text-right text-slate-600">
                {dept.priorityCount}
              </td>
              <td className="py-3 px-4 text-right">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${perPersonBadgeClass(dept.prioritiesPerPerson)}`}
                >
                  {dept.prioritiesPerPerson.toFixed(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
