---
date: 2026-04-14
topic: department-self-serve
---

# Department Self-Serve: Join, Leave, and Create

## Problem Frame

Currently, department assignment is fragmented: members only see `/team` in the nav, owners/admins don't see it at all, and new users land on the dashboard with no guidance to pick a department. There's no way to leave a department once joined, and creating new departments requires a full Intake flow. This makes onboarding friction high and department management feel rigid.

## Requirements

**Navigation**
- R1. `/team` is visible in the nav for all roles (owner, admin, member) — not just members
- R2. The nav link appears under the user's name in the top-left area

**First-login redirect**
- R3. Users with no department links are redirected to `/team` from any org page (except `/team` itself and `/settings`)
- R4. The redirect is role-agnostic — applies to owners, admins, and members equally

**Department picker (shown when user has no departments)**
- R5. Shows all existing departments in the org as selectable options
- R6. Includes a "Create new department" option that shows an inline name form
- R7. Creating a new department creates an empty shell (name only, no profile/priorities) that can be filled in later via Intake

**Join and leave (shown when user already has departments)**
- R8. Users can join additional departments at any time from `/team`
- R9. Users can leave any department at any time from `/team`
- R10. Join/leave is available to all roles (owner, admin, member) with no restrictions

## Success Criteria

- A brand-new user accepting an invite lands on `/team` and can pick or create a department without guidance
- Any user can join/leave departments freely — no admin intervention needed
- Owners and admins can access `/team` from the nav just like members

## Scope Boundaries

- **Not changing Intake** — department creation here is just an empty shell; full profiles still come from Intake
- **No approval workflows** — join/leave is trust-based, no confirmation from department leads
- **Not changing dashboard** — dashboard continues to show all org data for owners; scoped data for members based on linked departments
- **Not removing invite pre-assignment** — invites can still pre-link departments, this just adds self-serve on top

## Key Decisions

- **Empty shell for new departments**: Creating from `/team` just sets a name. This avoids duplicating Intake and keeps the picker simple.
- **Redirect from all org pages**: Ensures users can't bypass department selection by navigating directly to other pages.
- **No role restrictions on join/leave**: Trust-based model — any org member can freely associate with any department.

## Dependencies / Assumptions

- `self_select_departments` RPC already exists and handles joining
- `member_departments` junction table already exists
- DepartmentPicker component exists and can be extended
- Leaving departments will need a new RPC or API endpoint (no "unlink" capability exists today)

## Outstanding Questions

### Deferred to Planning
- [Affects R9][Technical] What's the best approach for "leave department" — new RPC, or extend the existing assign endpoint?
- [Affects R3][Technical] Should the redirect live in the org layout (server component) or in middleware?
- [Affects R7][Technical] Does creating an empty department need a new API route, or can it reuse an existing one?
- [Affects R2][Technical] Best placement for the nav link — rename "My Team" to "Team" and show for all roles, or add a separate entry?

## Next Steps

-> `/ce:plan` for structured implementation planning
