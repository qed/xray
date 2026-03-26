# Priority Detail Modal & Nav Renaming

## Context
The X-Ray dashboard shows priorities across multiple surfaces (PrioritiesTable, KanbanCard, PriorityCard, Missing Gaps table) but clicking into details requires navigating to the department page and expanding an accordion. Users want quick access to full priority details from anywhere via a modal popup.

## Scope
1. Add a `PriorityModal` component that shows full priority details in a centered overlay.
2. Make priorities clickable across all 4 surfaces to open the modal.
3. Remove PriorityCard's accordion expand/collapse — replaced by the modal.
4. Rename nav links and page headings: "Overview" → "AI Priorities", "Unfiled" → "Missing Gaps".

## Data Changes

### Expand RankedOpportunity
Add all `AutomationPriority` detail fields to `RankedOpportunity`:
- `whatToAutomate: string`
- `currentState: string`
- `whyItMatters: string`
- `dependencies: string[]`
- `suggestedApproach: string`
- `successCriteria: string`

These get populated in `buildRankedOpportunity()` in `src/lib/aggregator.ts`.

## Modal Component — `src/components/PriorityModal.tsx`

Client component (`'use client'`). Props: `opportunity: RankedOpportunity | null`, `onClose: () => void`.

When `opportunity` is null, render nothing.

### Layout
- Fixed full-screen overlay: semi-transparent backdrop (`bg-black/40`)
- Centered panel: `max-w-2xl w-full max-h-[90vh] overflow-y-auto`, white bg, rounded-xl, shadow-xl
- X button in top-right corner
- Closes on: X click, backdrop click, Escape key

### Content Sections (in order, shown only if data exists)
1. **Header** — emerald-600 rank circle + priority name (text-xl font-bold) + department name (text-slate-500)
2. **Badges row** — Impact, Effort, Complexity, Milestone stage (same badge styling as PriorityCard light mode)
3. **What to Automate** — emerald-600 heading, slate-600 body
4. **Current State** — same pattern
5. **Why It Matters** — same pattern
6. **Estimated Time Savings** — same pattern
7. **Dependencies** — bulleted list
8. **Suggested Approach** — same pattern
9. **Success Criteria** — same pattern
10. **View Implementation Plan** — emerald-600 link to `/plan/[slug]/priority-[rank]`

## Modal State Management — `src/components/PriorityModalContext.tsx`

React context + provider. Exports:
- `PriorityModalProvider` — wraps children, holds state
- `usePriorityModal()` — returns `{ openModal(opp: RankedOpportunity): void }`

The provider renders `PriorityModal` and manages open/close state internally.

Wrap in `src/app/layout.tsx` inside `<body>`.

## Surfaces That Open the Modal

### PrioritiesTable (`src/components/PrioritiesTable.tsx`)
- Each `<tr>` gets `onClick={() => openModal(opp)}` and `cursor-pointer`
- Row hover already exists

### KanbanCard (`src/components/KanbanCard.tsx`)
- The card div gets `onClick={() => openModal(opportunity)}`
- Already has `cursor-default` — change to `cursor-pointer`

### PriorityCard (`src/components/PriorityCard.tsx`)
- Remove accordion state and expanded detail section
- The card becomes a simple clickable div that calls `openModal()`
- Keep the badges row visible on the card face
- Need to convert the priority data: PriorityCard receives `AutomationPriority` but modal needs `RankedOpportunity`. Add a prop for the `RankedOpportunity` version, or build one from the AutomationPriority + milestone info.

### Missing Gaps table (`src/app/unfiled/page.tsx`)
- Each `<tr>` gets `onClick` to open modal
- Needs access to full `RankedOpportunity` data, not just `UnfiledPriority`
- Update page to fetch full ranked opportunities filtered to unfiled ones

## Nav Renaming

### `src/app/layout.tsx`
- "Overview" link text → "AI Priorities"
- `UnfiledNavLink` text → "Missing Gaps"

### `src/app/page.tsx`
- `<h1>` "Company Overview" → "AI Priorities"
- `<p>` subtitle updated accordingly

### `src/app/unfiled/page.tsx`
- `<h1>` "Unfiled Priorities" → "Missing Gaps"
- `<p>` subtitle updated accordingly

## Files to Create
- `src/components/PriorityModal.tsx`
- `src/components/PriorityModalContext.tsx`

## Files to Modify
- `src/lib/types.ts` — expand RankedOpportunity
- `src/lib/aggregator.ts` — populate new fields in buildRankedOpportunity
- `src/app/layout.tsx` — wrap with PriorityModalProvider, rename nav links
- `src/app/page.tsx` — rename heading
- `src/app/unfiled/page.tsx` — rename heading, use RankedOpportunity data, add click handler
- `src/components/PrioritiesTable.tsx` — add row click to open modal
- `src/components/PriorityCard.tsx` — remove accordion, add click to open modal
- `src/components/KanbanCard.tsx` — add click to open modal

## Commit Message
"Add priority detail modal, rename nav to AI Priorities / Missing Gaps"
