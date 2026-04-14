---
title: "feat: Add status toggle to PriorityModal"
type: feat
status: completed
date: 2026-04-14
origin: docs/brainstorms/priority-status-toggle-requirements.md
---

# feat: Add status toggle to PriorityModal

## Overview

Replace the read-only status badge in `PriorityModal` with an interactive control that lets users advance a priority's status through the forward-only lifecycle. No new API work — the existing `PATCH /api/priorities/[id]` endpoint handles validation and authorization.

## Problem Frame

Users can see a priority's status in the modal but cannot change it. The only way to advance status is through the Kanban tracker (owner-only, milestone-based). Any user with edit access should be able to advance status directly from the modal popup. (see origin: `docs/brainstorms/priority-status-toggle-requirements.md`)

## Requirements Trace

- R1. Interactive status control in PriorityModal showing current status + advance button
- R2. Use existing forward-only `STATUS_TRANSITIONS` lifecycle
- R3. Terminal states (`complete`, `rejected`) show as static badge, no action
- R4. Use existing `PATCH /api/priorities/[id]` endpoint
- R5. Loading state during update, refresh data on success
- R6. Inline error display on API rejection

## Scope Boundaries

- PriorityModal only — not detail page or kanban cards
- No new API routes or database changes
- No backward transitions
- No new test infrastructure (no existing tests for PriorityModal)

## Context & Research

### Relevant Code and Patterns

- `src/components/PriorityModal.tsx` — target component; status badge at lines 101-112
- `src/components/PriorityModalContext.tsx` — stores `selected: RankedOpportunity | null` in local state; only exposes `openModal` and renders `<PriorityModal>`
- `src/components/KanbanCard.tsx` — closest analog: `useRole()`, `useState(false)` for loading, fetch PATCH, `router.refresh()`
- `src/lib/constants.ts` — `STATUS_TRANSITIONS`, `PriorityStatus`, `PRIORITY_STATUSES`
- `src/app/api/priorities/[id]/route.ts` — PATCH handler with auth, transition validation, auto-transition of `approved` → `not_started`
- `src/components/RoleContext.tsx` — `useRole()` hook available in all org pages
- `src/lib/types.ts` — `RankedOpportunity` has `id: string` and `status: string`

### Institutional Learnings

- `approved` is a transient gate — the API auto-transitions it to `not_started` before persisting. The UI should never expect the user to land on `approved` as a resting state. (see `docs/solutions/best-practices/department-lead-experience-feature-patterns-2026-04-13.md`)
- Defense in depth: API enforces transition rules, DB CHECK constraint enforces valid values.

## Key Technical Decisions

- **Optimistic local state update**: The modal's data is a snapshot stored in `PriorityModalContext` state. After a successful PATCH, update the `opportunity` object's status locally so the badge reflects the change immediately. Also call `router.refresh()` to revalidate server data for when the modal closes. This avoids needing to add an `updateSelected` callback to the context — the modal component can manage this internally with its own state.
- **Show toggle for all roles**: The API already enforces authorization (owner = all, admin/member = linked department). Duplicating that logic client-side adds complexity for no safety gain. Handle 403 gracefully with an inline error.
- **Single "advance" button, not a dropdown**: The forward-only lifecycle means each non-terminal status has exactly one next state (except `proposed` which has two: `approved` and `rejected`). A single button for the primary action keeps it simple. For `proposed`, show two buttons: "Approve" and "Reject".

## Implementation Units

- [ ] **Unit 1: Add interactive status control to PriorityModal**

**Goal:** Replace the read-only status badge with an interactive control showing current status and an advance button. Handle loading, success (optimistic update + router refresh), and error states.

**Requirements:** R1, R2, R3, R4, R5, R6

**Dependencies:** None

**Files:**
- Modify: `src/components/PriorityModal.tsx`

**Approach:**
- Add local state: `localStatus` (initialized from `opportunity.status`), `updating` (boolean), `error` (string)
- Reset `localStatus` when `opportunity` prop changes (new modal opened)
- Import `STATUS_TRANSITIONS` from constants to derive the next valid status(es)
- For terminal states (`complete`, `rejected`) or empty transitions array: render the existing static badge
- For `proposed`: render two buttons — "Approve" (transitions to `approved`, which API auto-converts to `not_started`) and "Reject"
- For `not_started`: render "Start" button (→ `in_progress`)
- For `in_progress`: render "Complete" button (→ `complete`)
- On click: set `updating=true`, PATCH `/api/priorities/{id}` with `{ status: nextStatus }`, on success update `localStatus` to the effective status (`approved` becomes `not_started`), call `router.refresh()`, clear error. On failure: revert `localStatus` to pre-click value and show error inline below the control.
- Style the advance button to match existing badge aesthetics — small, colored, inline with the status badge row

**Patterns to follow:**
- `src/components/KanbanCard.tsx` lines 39-53 — fetch PATCH + router.refresh() + loading state pattern
- `src/components/PriorityModal.tsx` lines 101-112 — existing status badge styling and color mapping

**Test scenarios:**
- Happy path: clicking "Start" on a `not_started` priority calls PATCH with `{status: "in_progress"}` and updates the displayed status
- Happy path: clicking "Complete" on an `in_progress` priority calls PATCH with `{status: "complete"}` and the advance button disappears (terminal)
- Happy path: clicking "Approve" on a `proposed` priority calls PATCH with `{status: "approved"}` and displays "Not Started" (API auto-transitions)
- Happy path: clicking "Reject" on a `proposed` priority calls PATCH with `{status: "rejected"}` and the advance button disappears (terminal)
- Edge case: `complete` status renders static badge with no action button
- Edge case: `rejected` status renders static badge with no action button
- Error path: API returns 403 → inline error message shown, status unchanged
- Error path: API returns 400 (invalid transition) → inline error message shown
- Edge case: button is disabled and shows loading indicator while request is in flight

**Verification:**
- Opening a priority modal for a non-terminal priority shows the current status and an advance button
- Clicking the advance button updates the status badge immediately (optimistic)
- Terminal statuses show no action button
- `proposed` shows both "Approve" and "Reject" options
- API errors display inline without crashing the modal

## System-Wide Impact

- **Interaction graph:** PriorityModal → PATCH `/api/priorities/[id]` → Supabase `priorities` table. No callbacks or triggers affected.
- **State lifecycle risks:** Optimistic update could show wrong status if PATCH fails — mitigated by reverting `localStatus` on error.
- **API surface parity:** KanbanCard still uses the old milestone API (`/api/milestones/[id]`). This is a known divergence — not in scope to fix here.
- **Unchanged invariants:** `PriorityModalContext` API unchanged. Components that call `openModal()` are not affected.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Stale modal data after status change if user doesn't close/reopen | `router.refresh()` revalidates server data; `localStatus` provides immediate visual feedback |
| `approved` transient state confusion | Button labeled "Approve" but UI shows "Not Started" after success, matching API behavior |

## Sources & References

- **Origin document:** [docs/brainstorms/priority-status-toggle-requirements.md](docs/brainstorms/priority-status-toggle-requirements.md)
- Related pattern: `src/components/KanbanCard.tsx` (milestone stage controls)
- Institutional learning: `docs/solutions/best-practices/department-lead-experience-feature-patterns-2026-04-13.md` (status lifecycle patterns)
