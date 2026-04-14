---
date: 2026-04-14
topic: priority-status-toggle
---

# Priority Status Toggle in Modal

## Problem Frame

Users viewing a priority in the modal popup can see the current status as a read-only badge, but have no way to advance it. They must use the Kanban tracker (owner-only, milestone-based) to change status. Any user with edit access to a priority should be able to advance its status directly from the modal.

## Requirements

- R1. Replace the read-only status badge in `PriorityModal` with an interactive status control showing the current status and a button to advance to the next valid status
- R2. Use the existing forward-only `STATUS_TRANSITIONS` lifecycle (`not_started → in_progress → complete`; owners can also `proposed → approved/rejected`)
- R3. Terminal states (`complete`, `rejected`) show as a static badge with no advance button
- R4. Use the existing `PATCH /api/priorities/[id]` endpoint — it already validates transitions and enforces edit access (owner = all priorities, admin/member = linked department only)
- R5. Show a loading state while the status update is in flight and refresh the modal data on success
- R6. Display a user-friendly inline error if the API rejects the transition (e.g., 403 for unauthorized, 400 for invalid transition)

## Success Criteria

- A user viewing a priority they can edit sees the current status and a clear "advance" action
- Clicking the advance button transitions the status one step forward and the UI reflects the change immediately
- Terminal statuses show no action — the user understands the priority is done or rejected
- No regression to the existing modal layout or other badge displays

## Scope Boundaries

- PriorityModal only — not the detail page or kanban cards (can be added later)
- No new API work — the endpoint and transition logic already exist
- No backward transitions from the modal (forward-only)

## Key Decisions

- **Modal only**: Keeps the change small and ships fast. Detail page and kanban can follow.
- **Show toggle for all roles**: The API enforces authorization; if a user can see the priority in their dashboard, they likely have edit access. Handle the rare 403 gracefully rather than duplicating auth logic client-side.

## Next Steps

-> `/ce:plan` for structured implementation planning, or implement directly (lightweight scope)
