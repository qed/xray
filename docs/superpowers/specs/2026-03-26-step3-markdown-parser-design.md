# Step 3: Markdown Parser

## Context
The X-Ray dashboard needs to parse department markdown files into typed structures at build time. Two departments exist with different markdown formats. The parser must handle both and be extensible to future departments with unknown formats.

## Scope
Create `src/lib/parser.ts` with functions to read and parse department data from `artifacts/`. Fix `status.json` to include sales-ops priority-8.

## Exported Functions

- `getAllDepartments()` — scans `artifacts/` for department subdirectories (those containing `department_profile.md` + `automation_priorities.md`), returns `Department[]`
- `getDepartment(slug: string)` — returns a single `Department` for a given slug
- `getMilestones()` — reads `artifacts/milestones.json`, returns `MilestoneConfig[]`
- `getStatuses()` — reads `artifacts/status.json`, returns `Record<string, MilestoneStatus>`

## Parsing Strategy

### Priority Discovery
- Regex: `/^#{2,3}\s+Priority\s+(\d+)\s*[—:\-–]\s*(.+)/m`
- Matches both `### Priority N: Name` (Accounting) and `## Priority N — Name` (Sales Ops)
- No hardcoded priority counts — discovers dynamically from content

### Field Extraction
- Search for bold labels (`**Label:**`) within each priority section
- Capture text from after the label until the next bold label or heading
- Label normalization map:
  - "What to automate/improve" / "What to Automate" / "What to Build" → `whatToAutomate`
  - "Current state" / "Current State" → `currentState`
  - "Target State" → also `currentState`
  - "Why it matters" / "Why It Matters" → `whyItMatters`
  - "Estimated time savings" / "Estimated Time Savings" / "Estimated Risk Reduction" → `estimatedTimeSavings`
  - "Complexity" → `complexity` (extract level before dash: "Medium-High — explanation" → "Medium-High")
  - "Dependencies" → `dependencies` (split bullet list into string[])
  - "Suggested approach" → `suggestedApproach` (empty string if missing)
  - "Success criteria" → `successCriteria` (empty string if missing)
  - "Status" → `status` (default "Not started" if missing)

### Effort/Impact from Summary Table
- Accounting has a summary table with Rank, Opportunity, Est. Effort, Complexity, Impact columns
- Sales Ops has a Summary View table with Priority, Item, Status, Complexity, Time Impact columns
- Parse these tables to get effort/impact/complexity values, cross-referenced by priority rank
- For Sales Ops, the summary table has "Time Impact" instead of separate Impact/Effort columns. Parse the `**Complexity:**` field from each priority's detail section for complexity. For impact and effort, since Sales Ops doesn't provide these separately, parse from the priority detail content where available, defaulting to "High" for impact and "Medium" for effort when not explicitly stated.

### Profile Parsing
- Mission: find `**Mission:**` bold label or "Mission" heading, extract paragraph
- Scope: find `**Scope:**` bold label or "Scope" heading, extract content
- Team members: find team/roster table, parse rows into `TeamMember[]`
- Tools: find tools table, extract tool names into `string[]`
- Single points of failure: find SPOF section/table, extract into `string[]`
- Pain points: find pain points section/table, extract into `string[]`
- Tribal knowledge risks: find tribal knowledge section, extract into `string[]`

### Timeline Sections (Optional)
- Quick Wins: numbered list items → `string[]`
- 30-Day Targets: numbered list items → `string[]`
- 90-Day Targets: numbered list items → `string[]`
- Default to undefined if section not present

### Scaling Risks (Optional)
- Parse from table format into `ScalingRisk[]` (area, risk, mitigation)
- Default to undefined if section not present

## Data Fix
Add `"sales-operations/priority-8": { "milestone": 0, "updated": "2026-03-26", "notes": "" }` to `artifacts/status.json`.

## File Reads
All `fs` operations use `path.join(process.cwd(), 'artifacts', ...)` and execute at build time only.

## Testing
Tests run against the real markdown files in `artifacts/`:
- Accounting: 9 priorities parsed, names match, effort/complexity/impact values correct
- Sales Ops: 8 priorities parsed, names match, status field populated for priority 1
- Profile: mission, team members, tools populated for both departments
- Missing fields: default to empty string gracefully
- JSON configs: milestones and statuses parse correctly

## Commit Message
"Add markdown parser with tests against real department data"
