import type { TeamMember } from '@/lib/types';

interface TeamRosterProps {
  members: TeamMember[];
}

export default function TeamRoster({ members }: TeamRosterProps) {
  if (members.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-slate-500 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-slate-500 font-medium">Title</th>
            <th className="text-left py-3 px-4 text-slate-500 font-medium">Responsibilities</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, idx) => (
            <tr
              key={idx}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="py-3 px-4 text-slate-900 font-medium">{member.name}</td>
              <td className="py-3 px-4 text-slate-600">{member.title}</td>
              <td className="py-3 px-4 text-slate-500">{member.responsibilities}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
