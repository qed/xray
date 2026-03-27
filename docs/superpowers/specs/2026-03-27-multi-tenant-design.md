# Multi-Tenant X-Ray Design

**Date:** 2026-03-27
**Status:** Approved

## Overview

Convert X-Ray from a single-tenant filesystem-based app to a multi-tenant SaaS using Supabase (Postgres + Auth) and Vercel. Users sign up with email/password, join organizations via invite codes or invite links, and see only their org's data. All department data moves from markdown files into Supabase tables.

## Architecture

- **Auth:** Supabase Auth (email/password) via `@supabase/ssr`
- **Database:** Supabase Postgres with Row-Level Security (RLS) on all tables
- **Service Role:** Server-side admin operations (seeding, imports) use the Supabase service role key to bypass RLS
- **Deployment:** Vercel (existing setup)
- **Org context:** Cookie-based (`current_org_id`), read by middleware and data-fetching layer

## Initial Organizations (Pre-Seeded)

1. Helix
2. The Printing House
3. Winters Instruments
4. Connect CPA
5. WeVend (seeded with existing 4 departments: Accounting, Sales Operations, Infrastructure & Compliance, Operations)

Each org gets a generated invite code during seeding.

## Database Schema

### organizations
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text NOT NULL | |
| slug | text UNIQUE | URL-safe identifier |
| created_at | timestamptz | DEFAULT now() |

### org_members
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| org_id | uuid FK → organizations | |
| user_id | uuid FK → auth.users | |
| role | text | 'owner', 'admin', or 'member' |
| joined_at | timestamptz | DEFAULT now() |

UNIQUE(org_id, user_id)

### invites
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| org_id | uuid FK → organizations | |
| code | text UNIQUE | Short invite code |
| email | text | NULL = reusable code; non-null = single-use email invite |
| max_uses | int | NULL = unlimited |
| use_count | int | DEFAULT 0 |
| expires_at | timestamptz | NULL = never expires |
| created_by | uuid FK → auth.users | |
| created_at | timestamptz | DEFAULT now() |

### departments
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| org_id | uuid FK → organizations | |
| slug | text | |
| name | text | |
| mission | text | |
| scope | text | |
| tools | text[] | |
| single_points_of_failure | text[] | |
| pain_points | text[] | |
| tribal_knowledge_risks | text[] | |

UNIQUE(org_id, slug)

### team_members
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| department_id | uuid FK → departments | |
| name | text | |
| title | text | |
| responsibilities | text | |

### priorities
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| department_id | uuid FK → departments | |
| rank | int | |
| name | text | |
| effort | text | Low/Medium/High |
| complexity | text | Low/Medium/Medium-High/High |
| impact | text | Low/Medium/High/Very High/Critical |
| what_to_automate | text | |
| current_state | text | |
| why_it_matters | text | |
| estimated_time_savings | text | Raw text, parsed client-side |
| suggested_approach | text | |
| success_criteria | text | |
| dependencies | text[] | |
| status | text | |

UNIQUE(department_id, rank)

### milestones
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| priority_id | uuid FK → priorities | UNIQUE |
| stage | int | 0=Not Started, 1=Implemented, 2=2 Weeks Stable, 3=Dept Head Confirmed |
| updated_at | timestamptz | |
| notes | text | |

### scaling_risks
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| department_id | uuid FK → departments | |
| area | text | |
| risk | text | |
| mitigation | text | |

### quick_wins
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| department_id | uuid FK → departments | |
| description | text | |

### thirty_day_targets
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| department_id | uuid FK → departments | |
| description | text | |

### ninety_day_targets
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| department_id | uuid FK → departments | |
| description | text | |

## RLS Policies

All tables with `org_id` get:
```sql
CREATE POLICY "Users can access their org data"
ON table_name FOR ALL
USING (org_id IN (
  SELECT org_id FROM org_members WHERE user_id = auth.uid()
));
```

Tables under departments (team_members, priorities, scaling_risks, milestones, quick_wins, thirty_day_targets, ninety_day_targets) chain through the department's org:
```sql
CREATE POLICY "Users can access their org department data"
ON table_name FOR ALL
USING (department_id IN (
  SELECT d.id FROM departments d
  JOIN org_members om ON om.org_id = d.org_id
  WHERE om.user_id = auth.uid()
));
```

The `invites` table allows public read of specific codes (for the join flow) but restricts creation to org admins/owners.

## Auth Flow

### Sign Up
1. User visits `/signup` → enters email + password
2. Supabase Auth creates account
3. If they arrived via `/invite/:code`, auto-join that org → redirect to `/org/[slug]/priorities`
4. Otherwise → redirect to `/join`

### Log In
1. User visits `/login` → enters email + password
2. On success: check `org_members` for user
3. If they have orgs → redirect to last-used org (from cookie) or first org
4. If no orgs → redirect to `/join`

### Join Organization
`/join` page offers:
- Text input for invite code → validates against `invites` table → joins org
- "Create New Organization" button → form with org name → creates org, user becomes Owner

### Invite Link
`/invite/:code` route:
- If logged in → validate code, join org, redirect to org dashboard
- If not logged in → redirect to `/signup?invite=:code`, sign up flow auto-joins after account creation

## Middleware

**File:** `src/middleware.ts`

Public routes (no auth required):
- `/`
- `/login`
- `/signup`
- `/invite/:code`

All `/org/*` routes require:
1. Valid Supabase session
2. User is a member of the org identified by `[orgSlug]`

If no session → redirect to `/login`.
If session but not a member of the org → redirect to `/join`.

## Route Structure

### Public Routes
| Route | Purpose |
|-------|---------|
| `/` | Landing page: X-Ray logo, tagline, Sign Up / Log In buttons |
| `/login` | Email/password login form |
| `/signup` | Email/password signup form |
| `/invite/:code` | Accept invite, auto-join org |
| `/join` | Enter invite code or create new org |

### Org-Scoped Routes (all under `/org/[orgSlug]/`)
| Route | Purpose | Was |
|-------|---------|-----|
| `/org/[orgSlug]/priorities` | AI Priorities table | `/` |
| `/org/[orgSlug]/dashboard` | Dashboard with KPIs | `/dashboard` |
| `/org/[orgSlug]/tracker` | Kanban pipeline | `/tracker` |
| `/org/[orgSlug]/risks` | Risk heatmap + staffing | `/risks` |
| `/org/[orgSlug]/dependencies` | Cross-dept dependency graph | `/dependencies` |
| `/org/[orgSlug]/tools` | Tool overlap matrix | `/tools` |
| `/org/[orgSlug]/unfiled` | Missing gaps + instructions | `/unfiled` |
| `/org/[orgSlug]/upload` | Upload markdown files | `/upload` |
| `/org/[orgSlug]/department/[slug]` | Department detail | `/department/[slug]` |
| `/org/[orgSlug]/plan/[slug]/[priority]` | Implementation plan | `/plan/[slug]/[priority]` |
| `/org/[orgSlug]/tour` | Feature tour | `/tour` |
| `/org/[orgSlug]/settings` | Org settings: members, invites | NEW |

## Data Layer Rewrite

### Remove
- `src/lib/parser.ts` — no more filesystem reads at runtime
- `src/lib/aggregator.ts` — replaced by Supabase queries
- `artifacts/status.json` — replaced by `milestones` table
- `artifacts/milestones.json` — milestone stage definitions become constants

### Add
- `src/lib/supabase/client.ts` — browser Supabase client (uses anon key)
- `src/lib/supabase/server.ts` — server-side Supabase client (reads cookies for auth)
- `src/lib/supabase/admin.ts` — service role client (server-only, bypasses RLS)
- `src/lib/db.ts` — data access functions replacing parser/aggregator (same function signatures where possible, but backed by Supabase queries instead of filesystem reads)
- `src/lib/types.ts` — updated types matching new schema (mostly same fields, different source)
- `scripts/seed.ts` — creates 5 orgs, generates invite codes, imports WeVend's markdown data

### Upload Flow Change
Current: upload .md → write to filesystem → parser reads at next request
New: upload .md → parse in memory (parser becomes an import utility) → insert rows into Supabase → data available immediately

## UI Changes

### Landing Page (`/`)
- X-Ray logo and tagline: "See everything. Automate what matters."
- Two buttons top-right nav: "Sign Up" and "Log In"
- No data shown — purely a welcome/entry page

### Navbar (authenticated)
- **Top-left:** Org switcher dropdown (current org name, click to switch or see all orgs)
- **Center:** Same nav links as now (AI Priorities, Dashboard, Tracker, etc.) but linking to `/org/[orgSlug]/...`
- **Top-right:** User menu (email, Settings, Logout)

### Settings Page (`/org/[orgSlug]/settings`)
- **Members tab:** List all members with roles. Admins/Owners can remove members and change roles.
- **Invites tab:** Create reusable invite codes (with optional expiry/max uses). Create single-use email invites. List active invites with usage stats.
- **Organization tab (Owner only):** Edit org name, delete org.

### Existing Components
All existing presentational components (PrioritiesTable, KanbanBoard, RiskHeatmap, DependencyGraph, etc.) remain unchanged — they already accept data via props. Only the data-fetching layer changes.

### Remove
- `PasswordGate.tsx` — replaced by Supabase Auth + middleware

## Seed Script

`scripts/seed.ts` uses the service role client to:

1. Create 5 organizations (Helix, The Printing House, Winters Instruments, Connect CPA, WeVend)
2. Generate a reusable invite code for each org
3. For WeVend only: parse existing markdown files from `artifacts/WeVend X-Ray/` and insert departments, team members, priorities, milestones, scaling risks, quick wins, 30-day targets, and 90-day targets into Supabase
4. Output: list of org names + invite codes

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  (server-only, never exposed to client)
```

## Constraints

- Supabase free tier supports up to 500MB database, 50K monthly active users — sufficient for 5 orgs
- File uploads still parse markdown in memory — no change to parser logic, just where the result goes
- Existing markdown files in `artifacts/` are kept for reference but not used at runtime after migration
- The `basePath` config in `next.config.ts` should be removed (no longer needed with org-scoped routes)
- Tour page content is hardcoded — stays the same, just moves under org route
