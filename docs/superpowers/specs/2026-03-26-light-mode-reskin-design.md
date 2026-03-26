# Light Mode Reskin with WeVend Branding

## Context
The X-Ray dashboard currently uses a dark theme (slate-950 bg, cyan-400 accents). WeVend's brand is white/light with green accents. Reskin to match.

## Scope
Pure visual change — swap dark Tailwind classes for light equivalents and cyan accent for emerald-600 across all files. No logic, data, or component structure changes.

## Accent Color
Tailwind `emerald-600` (#059669). Replaces all `cyan-400`/`cyan-500` usage.

## Color Mapping

| Current (Dark) | New (Light) |
|---|---|
| `bg-slate-950` (page bg) | `bg-white` |
| `bg-slate-900` (cards/panels) | `bg-slate-50` |
| `border-slate-800` | `border-slate-200` |
| `border-slate-800/50` (table rows) | `border-slate-100` |
| `text-white` (headings) | `text-slate-900` |
| `text-slate-300` (body text) | `text-slate-600` |
| `text-slate-400` (secondary text) | `text-slate-500` |
| `text-slate-500` (dim text) | `text-slate-400` |
| `text-cyan-400` (accent/brand) | `text-emerald-600` |
| `hover:text-cyan-400` | `hover:text-emerald-600` |
| `border-cyan-500` | `border-emerald-600` |
| `hover:bg-slate-800/50` (nav hover) | `hover:bg-slate-100` |
| `hover:bg-slate-800/30` (table row hover) | `hover:bg-slate-50` |
| `bg-slate-950/80` (nav backdrop) | `bg-white/80` |

## globals.css
- `--background: #ffffff`
- `--foreground: #0f172a`
- `--accent: #059669`
- Remove any dark-mode-specific styles

## Impact Badge Colors (keep as-is)
The impact badges in PrioritiesTable and KanbanCard use red/orange/yellow/cyan/slate colors that work on both light and dark. These should be reviewed — the `bg-*-500/20` opacity variants may need adjustment for light backgrounds. Use `bg-*-100` and `border-*-200` equivalents for better light mode contrast:
- Critical: `bg-red-100 text-red-700 border-red-200`
- Very High: `bg-orange-100 text-orange-700 border-orange-200`
- High: `bg-yellow-100 text-yellow-700 border-yellow-200`
- Medium: `bg-emerald-100 text-emerald-700 border-emerald-200`
- Low: `bg-slate-100 text-slate-600 border-slate-200`

## Unfiled Page Badge Colors
- Issue badges: `bg-amber-100 text-amber-700 border-amber-200` (replacing `bg-amber-500/20 text-amber-400 border-amber-500/30`)
- Success state border: `border-emerald-200` (replacing `border-emerald-500/30`)
- Success text: `text-emerald-600` (replacing `text-emerald-400`)

## Nav Unfiled Badge
- `bg-amber-100 text-amber-700 border-amber-200` (replacing `bg-amber-500/20 text-amber-400 border-amber-500/30`)

## Files to Modify
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/not-found.tsx`
- `src/app/unfiled/page.tsx`
- `src/app/department/[slug]/page.tsx`
- `src/app/tracker/page.tsx`
- `src/app/plan/[slug]/[priority]/page.tsx`
- `src/components/PrioritiesTable.tsx`
- `src/components/ScoreCard.tsx`
- `src/components/DepartmentCard.tsx`
- `src/components/MilestoneChart.tsx`
- `src/components/PriorityCard.tsx`
- `src/components/MilestonePipeline.tsx`
- `src/components/RiskSection.tsx`
- `src/components/TeamRoster.tsx`
- `src/components/ToolStack.tsx`
- `src/components/KanbanBoard.tsx`
- `src/components/KanbanColumn.tsx`
- `src/components/KanbanCard.tsx`
- `src/components/ImplementationPlan.tsx`

## Commit Message
"Reskin to light mode with WeVend emerald-600 branding"
