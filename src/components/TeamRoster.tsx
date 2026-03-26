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
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium">Title</th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium">Responsibilities</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, idx) => (
            <tr
              key={idx}
              className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-3 px-4 text-white font-medium">{member.name}</td>
              <td className="py-3 px-4 text-slate-300">{member.title}</td>
              <td className="py-3 px-4 text-slate-400">{member.responsibilities}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
