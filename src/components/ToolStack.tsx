interface ToolStackProps {
  tools: string[];
}

export default function ToolStack({ tools }: ToolStackProps) {
  if (tools.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((tool, idx) => (
        <span
          key={idx}
          className="inline-block bg-slate-100 text-slate-600 text-sm px-3 py-1.5 rounded-lg border border-slate-200"
        >
          {tool}
        </span>
      ))}
    </div>
  );
}
