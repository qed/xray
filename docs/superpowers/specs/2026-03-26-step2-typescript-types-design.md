# Step 2: Data Layer — TypeScript Types

## Context
The X-Ray dashboard needs a typed data model before building the parser (Step 3) and aggregator (Step 4). These types define the contract between the markdown parser, data aggregator, and UI components.

## Scope
Create `src/lib/types.ts` with 10 interfaces, exactly as specified in the build plan.

## Interfaces

### Data source types (parsed from markdown)
- `DepartmentProfile` — department identity, team, tools, risks
- `TeamMember` — name, title, responsibilities
- `AutomationPriority` — ranked automation opportunity with metadata
- `ScalingRisk` — area, risk description, mitigation

### Config types (parsed from JSON)
- `MilestoneConfig` — milestone stage definition (id, name, definition)
- `MilestoneStatus` — per-priority milestone tracking (milestone id, date, notes)

### Composite types
- `Department` — combines profile + priorities + timeline targets (quick wins, 30-day, 90-day)

### Aggregation types (computed)
- `CompanyOverview` — cross-department totals, milestone distribution, top wins
- `DepartmentSummary` — per-department progress summary
- `RankedOpportunity` — opportunity ranked by impact/effort score

## Testing
- TypeScript compilation verifies type correctness
- No runtime tests needed for pure type definitions
- Types will be validated when parser and aggregator are built (Steps 3-4)

## Commit Message
"Add TypeScript type definitions for X-Ray data model"
