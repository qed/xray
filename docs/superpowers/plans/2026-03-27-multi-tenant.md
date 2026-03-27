# Multi-Tenant Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert X-Ray from a single-tenant filesystem app to a multi-tenant SaaS with Supabase Auth, RLS, and org-scoped routes.

**Architecture:** Supabase Postgres with RLS for tenant isolation. Supabase Auth for email/password login. Next.js 16 proxy (formerly middleware) for route protection. All department data moves from markdown files to database tables. Routes restructured under `/org/[orgSlug]/`.

**Tech Stack:** Next.js 16.2.1, React 19, Supabase (Postgres + Auth), `@supabase/ssr` 0.9.x, `@supabase/supabase-js` 2.99.x, TypeScript, Tailwind CSS 4

**CRITICAL Next.js 16 breaking changes:**
- `middleware.ts` is renamed to `proxy.ts` — export `proxy()` not `middleware()`
- `cookies()` and `headers()` from `next/headers` are **async** — must `await`
- Read `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` before writing proxy
- Read `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md` before using cookies

**Spec:** `docs/superpowers/specs/2026-03-27-multi-tenant-design.md`

---

## File Structure

### New Files
```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client (singleton)
│   │   ├── server.ts          # Server Supabase client (cookie-based)
│   │   └── admin.ts           # Service role client (bypasses RLS)
│   ├── db.ts                  # Data access functions (replaces parser+aggregator)
│   └── constants.ts           # Milestone stage definitions, scoring helpers
├── proxy.ts                   # Auth proxy (replaces middleware.ts)
├── app/
│   ├── (public)/
│   │   ├── page.tsx           # Landing page
│   │   ├── login/page.tsx     # Login form
│   │   ├── signup/page.tsx    # Signup form
│   │   ├── join/page.tsx      # Enter invite code / create org
│   │   └── invite/[code]/page.tsx  # Accept invite link
│   └── org/
│       └── [orgSlug]/
│           ├── layout.tsx     # Org layout with nav + org switcher
│           ├── priorities/page.tsx
│           ├── dashboard/page.tsx
│           ├── tracker/page.tsx
│           ├── risks/page.tsx
│           ├── dependencies/page.tsx
│           ├── tools/page.tsx
│           ├── unfiled/page.tsx
│           ├── upload/page.tsx
│           ├── tour/page.tsx
│           ├── settings/page.tsx
│           ├── department/[slug]/page.tsx
│           └── plan/[slug]/[priority]/page.tsx
├── components/
│   ├── OrgSwitcher.tsx        # Org dropdown in navbar
│   ├── UserMenu.tsx           # User avatar/logout dropdown
│   ├── AuthForm.tsx           # Shared login/signup form component
│   ├── InviteManager.tsx      # Create/list invites (settings page)
│   └── MemberList.tsx         # List/manage org members (settings page)
scripts/
├── seed.ts                    # Create 5 orgs, import WeVend data
supabase/
├── migrations/
│   └── 001_schema.sql         # Full schema + RLS policies
.env.local                     # Supabase credentials
```

### Files to Delete (after migration)
```
src/lib/parser.ts              # Replaced by db.ts
src/lib/aggregator.ts          # Replaced by db.ts
src/components/PasswordGate.tsx # Replaced by Supabase Auth
src/app/page.tsx               # Replaced by (public)/page.tsx
src/app/dashboard/page.tsx     # Moved to org/[orgSlug]/dashboard/
src/app/tracker/page.tsx       # Moved to org/[orgSlug]/tracker/
src/app/risks/page.tsx         # Moved to org/[orgSlug]/risks/
src/app/dependencies/page.tsx  # Moved to org/[orgSlug]/dependencies/
src/app/tools/page.tsx         # Moved to org/[orgSlug]/tools/
src/app/unfiled/page.tsx       # Moved to org/[orgSlug]/unfiled/
src/app/upload/page.tsx        # Moved to org/[orgSlug]/upload/
src/app/tour/page.tsx          # Moved to org/[orgSlug]/tour/
src/app/department/[slug]/     # Moved to org/[orgSlug]/department/[slug]/
src/app/plan/[slug]/[priority]/ # Moved to org/[orgSlug]/plan/[slug]/[priority]/
artifacts/status.json          # Replaced by milestones table
artifacts/milestones.json      # Replaced by constants.ts
```

### Files to Modify
```
src/app/layout.tsx             # Simplify: remove PasswordGate, keep minimal shell
next.config.ts                 # Remove basePath
package.json                   # Add supabase deps
.gitignore                     # Add .env.local
```

---

### Task 1: Install Dependencies & Environment Setup

**Files:**
- Modify: `package.json`
- Create: `.env.local`
- Modify: `.gitignore`
- Modify: `next.config.ts`

- [ ] **Step 1: Install Supabase packages**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Create `.env.local`**

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
```

Replace with actual values from the Supabase project dashboard (Settings → API).

- [ ] **Step 3: Add `.env.local` to `.gitignore`**

Append to `.gitignore`:
```
.env.local
.env*.local
```

- [ ] **Step 4: Remove basePath from `next.config.ts`**

Open `next.config.ts`. Remove the `basePath` line (currently `basePath: isProd ? '/xray' : ''`). The org-scoped routes replace it. Keep `output: 'standalone'` and `images: { unoptimized: true }`.

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore next.config.ts
git commit -m "feat: install Supabase deps, configure env, remove basePath"
```

---

### Task 2: Database Schema & RLS Policies

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- supabase/migrations/001_schema.sql
-- Multi-tenant schema for X-Ray

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Org membership (links auth.users to organizations)
CREATE TABLE org_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE (org_id, user_id)
);

-- Invites (both single-use email invites and reusable codes)
CREATE TABLE invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  email text,
  max_uses int,
  use_count int DEFAULT 0,
  expires_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Departments
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  mission text DEFAULT '',
  scope text DEFAULT '',
  tools text[] DEFAULT '{}',
  single_points_of_failure text[] DEFAULT '{}',
  pain_points text[] DEFAULT '{}',
  tribal_knowledge_risks text[] DEFAULT '{}',
  UNIQUE (org_id, slug)
);

-- Team members within a department
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  title text DEFAULT '',
  responsibilities text DEFAULT ''
);

-- Automation priorities
CREATE TABLE priorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  rank int NOT NULL,
  name text NOT NULL,
  effort text DEFAULT '',
  complexity text DEFAULT '',
  impact text DEFAULT '',
  what_to_automate text DEFAULT '',
  current_state text DEFAULT '',
  why_it_matters text DEFAULT '',
  estimated_time_savings text DEFAULT '',
  suggested_approach text DEFAULT '',
  success_criteria text DEFAULT '',
  dependencies text[] DEFAULT '{}',
  status text DEFAULT '',
  UNIQUE (department_id, rank)
);

-- Milestone tracking (replaces status.json)
CREATE TABLE milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  priority_id uuid UNIQUE NOT NULL REFERENCES priorities(id) ON DELETE CASCADE,
  stage int NOT NULL DEFAULT 0 CHECK (stage BETWEEN 0 AND 3),
  updated_at timestamptz DEFAULT now(),
  notes text DEFAULT ''
);

-- Scaling risks
CREATE TABLE scaling_risks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  area text NOT NULL,
  risk text NOT NULL,
  mitigation text DEFAULT ''
);

-- Quick wins
CREATE TABLE quick_wins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  description text NOT NULL
);

-- 30-day targets
CREATE TABLE thirty_day_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  description text NOT NULL
);

-- 90-day targets
CREATE TABLE ninety_day_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  description text NOT NULL
);

-- ====================
-- Row Level Security
-- ====================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE scaling_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE thirty_day_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ninety_day_targets ENABLE ROW LEVEL SECURITY;

-- Helper: get org_ids the current user belongs to
CREATE OR REPLACE FUNCTION user_org_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT org_id FROM org_members WHERE user_id = auth.uid();
$$;

-- Helper: get department_ids the current user can access
CREATE OR REPLACE FUNCTION user_department_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT d.id FROM departments d WHERE d.org_id IN (SELECT user_org_ids());
$$;

-- Organizations: users can see orgs they belong to
CREATE POLICY "Users can view their orgs"
  ON organizations FOR SELECT
  USING (id IN (SELECT user_org_ids()));

-- Org members: users can see members of their orgs
CREATE POLICY "Users can view org members"
  ON org_members FOR SELECT
  USING (org_id IN (SELECT user_org_ids()));

-- Org members: admins/owners can insert new members
CREATE POLICY "Admins can add members"
  ON org_members FOR INSERT
  WITH CHECK (org_id IN (
    SELECT org_id FROM org_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Org members: owners can update roles
CREATE POLICY "Owners can update members"
  ON org_members FOR UPDATE
  USING (org_id IN (
    SELECT org_id FROM org_members
    WHERE user_id = auth.uid() AND role = 'owner'
  ));

-- Org members: admins/owners can remove members
CREATE POLICY "Admins can remove members"
  ON org_members FOR DELETE
  USING (org_id IN (
    SELECT org_id FROM org_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Invites: anyone can read a specific invite by code (for join flow)
CREATE POLICY "Anyone can read invites by code"
  ON invites FOR SELECT
  USING (true);

-- Invites: admins/owners can create invites
CREATE POLICY "Admins can create invites"
  ON invites FOR INSERT
  WITH CHECK (org_id IN (
    SELECT org_id FROM org_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Invites: admins/owners can update invites (increment use_count)
CREATE POLICY "Admins can update invites"
  ON invites FOR UPDATE
  USING (org_id IN (
    SELECT org_id FROM org_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Invites: allow authenticated users to increment use_count when joining
CREATE POLICY "Users can use invites"
  ON invites FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Departments: users can view/manage departments in their orgs
CREATE POLICY "Users can access org departments"
  ON departments FOR ALL
  USING (org_id IN (SELECT user_org_ids()));

-- Team members: access through department → org chain
CREATE POLICY "Users can access org team members"
  ON team_members FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- Priorities: access through department → org chain
CREATE POLICY "Users can access org priorities"
  ON priorities FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- Milestones: access through priority → department → org chain
CREATE POLICY "Users can access org milestones"
  ON milestones FOR ALL
  USING (priority_id IN (
    SELECT p.id FROM priorities p
    WHERE p.department_id IN (SELECT user_department_ids())
  ));

-- Scaling risks: access through department → org chain
CREATE POLICY "Users can access org scaling risks"
  ON scaling_risks FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- Quick wins: access through department → org chain
CREATE POLICY "Users can access org quick wins"
  ON quick_wins FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- 30-day targets: access through department → org chain
CREATE POLICY "Users can access org thirty day targets"
  ON thirty_day_targets FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- 90-day targets: access through department → org chain
CREATE POLICY "Users can access org ninety day targets"
  ON ninety_day_targets FOR ALL
  USING (department_id IN (SELECT user_department_ids()));

-- Indexes for performance
CREATE INDEX idx_org_members_user ON org_members(user_id);
CREATE INDEX idx_org_members_org ON org_members(org_id);
CREATE INDEX idx_departments_org ON departments(org_id);
CREATE INDEX idx_priorities_dept ON priorities(department_id);
CREATE INDEX idx_team_members_dept ON team_members(department_id);
CREATE INDEX idx_milestones_priority ON milestones(priority_id);
CREATE INDEX idx_invites_code ON invites(code);
```

- [ ] **Step 2: Run migration in Supabase**

Go to the Supabase dashboard → SQL Editor → paste and run `001_schema.sql`. Or if using the Supabase CLI:

```bash
npx supabase db push
```

- [ ] **Step 3: Commit**

```bash
git add supabase/
git commit -m "feat: add database schema with RLS policies"
```

---

### Task 3: Supabase Client Utilities

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/admin.ts`

**Docs to read first:** `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md` — cookies() is async in Next.js 16.

- [ ] **Step 1: Create browser client**

```ts
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 2: Create server client**

```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can fail in Server Components (read-only context).
            // This is expected — cookie writes happen in proxy or Server Actions.
          }
        },
      },
    }
  );
}
```

- [ ] **Step 3: Create admin (service role) client**

```ts
// src/lib/supabase/admin.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Service role client — bypasses RLS. Server-only!
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/
git commit -m "feat: add Supabase client utilities (browser, server, admin)"
```

---

### Task 4: Auth Proxy (Route Protection)

**Files:**
- Create: `src/proxy.ts`

**Docs to read first:** `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` — Next.js 16 uses `proxy.ts` not `middleware.ts`.

- [ ] **Step 1: Create the proxy file**

```ts
// src/proxy.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/', '/login', '/signup', '/join'];

function isPublicPath(pathname: string): boolean {
  if (publicPaths.includes(pathname)) return true;
  if (pathname.startsWith('/invite/')) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static assets
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session — this validates the token with Supabase
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For org-scoped routes, verify membership
  if (pathname.startsWith('/org/')) {
    const orgSlug = pathname.split('/')[2];
    if (orgSlug) {
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', orgSlug)
        .single();

      if (!org) {
        return NextResponse.redirect(new URL('/join', request.url));
      }

      const { data: membership } = await supabase
        .from('org_members')
        .select('id')
        .eq('org_id', org.id)
        .eq('user_id', user.id)
        .single();

      if (!membership) {
        return NextResponse.redirect(new URL('/join', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.css|.*\\.js).*)',
  ],
};
```

- [ ] **Step 2: Verify proxy filename is correct for Next.js 16**

```bash
# Confirm docs say proxy.ts — read the first 30 lines
head -30 node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md
```

If docs confirm the convention, the file is correctly named. If the filename convention differs, rename accordingly.

- [ ] **Step 3: Commit**

```bash
git add src/proxy.ts
git commit -m "feat: add auth proxy for route protection"
```

---

### Task 5: Constants & Updated Types

**Files:**
- Create: `src/lib/constants.ts`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Create constants (replaces milestones.json)**

```ts
// src/lib/constants.ts
export const MILESTONE_STAGES = [
  { stage: 0, name: 'Not Started' },
  { stage: 1, name: 'Implemented' },
  { stage: 2, name: '2 Weeks Stable' },
  { stage: 3, name: 'Dept Head Confirmed' },
] as const;

export const IMPACT_SCORES: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  'Very High': 4,
  Critical: 5,
};

export const EFFORT_SCORES: Record<string, number> = {
  Low: 3,
  Medium: 2,
  High: 1,
};

export function computeScore(impact: string, effort: string): number {
  return (IMPACT_SCORES[impact] ?? 1) * (EFFORT_SCORES[effort] ?? 1);
}
```

- [ ] **Step 2: Update `src/lib/types.ts`**

Keep existing interfaces but add new ones for auth/org context. Do NOT remove existing types yet — they're still used by old pages until those are migrated.

Add to the bottom of `src/lib/types.ts`:

```ts
// --- Multi-tenant types ---

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface Invite {
  id: string;
  org_id: string;
  code: string;
  email: string | null;
  max_uses: number | null;
  use_count: number;
  expires_at: string | null;
  created_by: string;
  created_at: string;
}

export interface DbDepartment {
  id: string;
  org_id: string;
  slug: string;
  name: string;
  mission: string;
  scope: string;
  tools: string[];
  single_points_of_failure: string[];
  pain_points: string[];
  tribal_knowledge_risks: string[];
}

export interface DbTeamMember {
  id: string;
  department_id: string;
  name: string;
  title: string;
  responsibilities: string;
}

export interface DbPriority {
  id: string;
  department_id: string;
  rank: number;
  name: string;
  effort: string;
  complexity: string;
  impact: string;
  what_to_automate: string;
  current_state: string;
  why_it_matters: string;
  estimated_time_savings: string;
  suggested_approach: string;
  success_criteria: string;
  dependencies: string[];
  status: string;
}

export interface DbMilestone {
  id: string;
  priority_id: string;
  stage: number;
  updated_at: string;
  notes: string;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/constants.ts src/lib/types.ts
git commit -m "feat: add constants and multi-tenant types"
```

---

### Task 6: Data Access Layer (`db.ts`)

**Files:**
- Create: `src/lib/db.ts`

This replaces `parser.ts` + `aggregator.ts`. It uses the server Supabase client and queries the database. Functions mirror the old API where possible so components can be rewired with minimal changes.

- [ ] **Step 1: Create `src/lib/db.ts`**

```ts
// src/lib/db.ts
import { createClient } from '@/lib/supabase/server';
import { computeScore, MILESTONE_STAGES } from '@/lib/constants';
import type {
  DbDepartment, DbPriority, DbTeamMember, DbMilestone,
  Organization, OrgMember, Invite,
  RankedOpportunity, ParsedTimeSavings, CompanyOverview,
  DepartmentSummary, TimeSavingsRollup, ConsolidatedRisk,
  StaffingOverview, DepartmentDependency, StrategicBlocker,
  ToolOverlap, UnfiledPriority,
} from '@/lib/types';

// ---------- Auth / Org Helpers ----------

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserOrgs(userId: string): Promise<(OrgMember & { organization: Organization })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('org_members')
    .select('*, organization:organizations(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return data ?? [];
}

export async function getOrgBySlug(slug: string): Promise<Organization | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

export async function getUserRole(orgId: string, userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', userId)
    .single();
  return data?.role ?? null;
}

export async function getOrgMembers(orgId: string): Promise<(OrgMember & { email: string })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('org_members')
    .select('*, user:auth.users(email)')
    .eq('org_id', orgId);
  if (error) throw error;
  return (data ?? []).map((m: Record<string, unknown>) => ({
    ...m,
    email: (m.user as { email: string })?.email ?? '',
  })) as (OrgMember & { email: string })[];
}

// ---------- Invite Helpers ----------

export async function getInviteByCode(code: string): Promise<(Invite & { organization: Organization }) | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('invites')
    .select('*, organization:organizations(*)')
    .eq('code', code)
    .single();
  return data;
}

export async function getOrgInvites(orgId: string): Promise<Invite[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('invites')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

// ---------- Department Queries ----------

export async function getDepartments(orgId: string): Promise<DbDepartment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('departments')
    .select('*')
    .eq('org_id', orgId)
    .order('name');
  return data ?? [];
}

export async function getDepartmentBySlug(orgId: string, slug: string): Promise<DbDepartment | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('departments')
    .select('*')
    .eq('org_id', orgId)
    .eq('slug', slug)
    .single();
  return data;
}

export async function getTeamMembers(departmentId: string): Promise<DbTeamMember[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('department_id', departmentId);
  return data ?? [];
}

// ---------- Priority Queries ----------

export async function getPriorities(departmentId: string): Promise<DbPriority[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('priorities')
    .select('*')
    .eq('department_id', departmentId)
    .order('rank');
  return data ?? [];
}

export async function getAllPrioritiesForOrg(orgId: string): Promise<(DbPriority & { department: DbDepartment; milestone: DbMilestone | null })[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('priorities')
    .select('*, department:departments!inner(*), milestone:milestones(*)')
    .eq('department.org_id', orgId)
    .order('rank');
  return (data ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    milestone: Array.isArray(p.milestone) ? p.milestone[0] ?? null : p.milestone,
  })) as (DbPriority & { department: DbDepartment; milestone: DbMilestone | null })[];
}

// ---------- Time Savings Parser (reused from old parser logic) ----------

export function parseTimeSavings(raw: string): ParsedTimeSavings {
  if (!raw || raw.trim() === '') {
    return { valid: false, rawText: raw ?? '', issue: 'not quantified' };
  }

  const hoursMatch = raw.match(/([\d.]+)\s*[-–to]+\s*([\d.]+)\s*hours?\s*\/?\s*w/i)
    || raw.match(/([\d.]+)\s*hours?\s*\/?\s*w/i);

  if (hoursMatch) {
    const min = parseFloat(hoursMatch[1]);
    const max = hoursMatch[2] ? parseFloat(hoursMatch[2]) : min;
    return {
      valid: true,
      min,
      max,
      midpoint: (min + max) / 2,
      display: min === max ? `${min} hrs/wk` : `${min}–${max} hrs/wk`,
    };
  }

  if (/\d/.test(raw) && !/hour|hr|week|wk/i.test(raw)) {
    return { valid: false, rawText: raw, issue: 'non-standard unit' };
  }

  if (!/\d/.test(raw)) {
    return { valid: false, rawText: raw, issue: 'no numeric value found' };
  }

  return { valid: false, rawText: raw, issue: 'non-standard unit' };
}

// ---------- Aggregation Functions ----------

export async function getTopWins(orgId: string, n: number): Promise<RankedOpportunity[]> {
  const allPriorities = await getAllPrioritiesForOrg(orgId);

  const ranked: RankedOpportunity[] = allPriorities.map((p) => {
    const milestoneStage = p.milestone?.stage ?? 0;
    const milestoneName = MILESTONE_STAGES[milestoneStage]?.name ?? 'Not Started';
    const parsedTimeSavings = parseTimeSavings(p.estimated_time_savings);

    return {
      departmentSlug: p.department.slug,
      departmentName: p.department.name,
      rank: p.rank,
      name: p.name,
      impact: p.impact,
      complexity: p.complexity,
      effort: p.effort,
      estimatedTimeSavings: p.estimated_time_savings,
      parsedTimeSavings,
      milestoneStage,
      milestoneName,
      score: computeScore(p.impact, p.effort),
      whatToAutomate: p.what_to_automate,
      currentState: p.current_state,
      whyItMatters: p.why_it_matters,
      dependencies: p.dependencies,
      suggestedApproach: p.suggested_approach,
      successCriteria: p.success_criteria,
    };
  });

  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, n);
}

export async function getUnfiledRankedOpportunities(orgId: string): Promise<RankedOpportunity[]> {
  const all = await getTopWins(orgId, 1000);
  return all.filter((opp) => !opp.parsedTimeSavings.valid);
}

export async function getOpportunitiesByMilestone(orgId: string): Promise<Record<number, RankedOpportunity[]>> {
  const all = await getTopWins(orgId, 1000);
  const grouped: Record<number, RankedOpportunity[]> = { 0: [], 1: [], 2: [], 3: [] };
  for (const opp of all) {
    (grouped[opp.milestoneStage] ??= []).push(opp);
  }
  return grouped;
}

export async function getCompanyOverview(orgId: string): Promise<CompanyOverview> {
  const all = await getTopWins(orgId, 1000);
  const departments = await getDepartments(orgId);

  const byMilestoneStage: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const opp of all) {
    byMilestoneStage[opp.milestoneStage] = (byMilestoneStage[opp.milestoneStage] ?? 0) + 1;
  }

  const deptSummaries: DepartmentSummary[] = departments.map((dept) => {
    const deptOpps = all.filter((o) => o.departmentSlug === dept.slug);
    const completed = deptOpps.filter((o) => o.milestoneStage === 3).length;
    const inProgress = deptOpps.filter((o) => o.milestoneStage > 0 && o.milestoneStage < 3).length;
    const notStarted = deptOpps.filter((o) => o.milestoneStage === 0).length;
    const total = deptOpps.length;

    return {
      slug: dept.slug,
      name: dept.name,
      totalPriorities: total,
      completed,
      inProgress,
      notStarted,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  return {
    totalOpportunities: all.length,
    byMilestoneStage,
    departments: deptSummaries,
    topWins: all.slice(0, 10),
  };
}

export async function getTimeSavingsRollup(orgId: string): Promise<TimeSavingsRollup> {
  const all = await getTopWins(orgId, 1000);
  const departments = await getDepartments(orgId);

  let totalPotential = 0;
  let totalRealized = 0;

  const byDepartment = departments.map((dept) => {
    const deptOpps = all.filter((o) => o.departmentSlug === dept.slug);
    let potential = 0;
    let realized = 0;

    for (const opp of deptOpps) {
      if (opp.parsedTimeSavings.valid) {
        potential += opp.parsedTimeSavings.midpoint;
        if (opp.milestoneStage >= 1) {
          realized += opp.parsedTimeSavings.midpoint;
        }
      }
    }

    totalPotential += potential;
    totalRealized += realized;

    return {
      slug: dept.slug,
      name: dept.name,
      potentialHoursPerWeek: potential,
      realizedHoursPerWeek: realized,
    };
  });

  return {
    totalPotentialHoursPerWeek: totalPotential,
    realizedHoursPerWeek: totalRealized,
    remainingHoursPerWeek: totalPotential - totalRealized,
    byDepartment,
  };
}

export async function getConsolidatedRisks(orgId: string): Promise<ConsolidatedRisk[]> {
  const departments = await getDepartments(orgId);
  const risks: ConsolidatedRisk[] = [];
  let riskId = 0;

  for (const dept of departments) {
    for (const item of dept.single_points_of_failure) {
      risks.push({
        id: `risk-${++riskId}`,
        description: item,
        type: 'people',
        severity: 'critical',
        departmentSlug: dept.slug,
        departmentName: dept.name,
        source: 'spof',
      });
    }
    for (const item of dept.pain_points) {
      risks.push({
        id: `risk-${++riskId}`,
        description: item,
        type: 'process',
        severity: 'high',
        departmentSlug: dept.slug,
        departmentName: dept.name,
        source: 'pain-point',
      });
    }
    for (const item of dept.tribal_knowledge_risks) {
      risks.push({
        id: `risk-${++riskId}`,
        description: item,
        type: 'people',
        severity: 'high',
        departmentSlug: dept.slug,
        departmentName: dept.name,
        source: 'tribal-knowledge',
      });
    }

    const supabase = await createClient();
    const { data: scalingRisks } = await supabase
      .from('scaling_risks')
      .select('*')
      .eq('department_id', dept.id);

    for (const sr of scalingRisks ?? []) {
      risks.push({
        id: `risk-${++riskId}`,
        description: `${sr.area}: ${sr.risk}`,
        type: 'process',
        severity: 'medium',
        departmentSlug: dept.slug,
        departmentName: dept.name,
        source: 'scaling-risk',
      });
    }
  }

  return risks;
}

export async function getStaffingOverview(orgId: string): Promise<StaffingOverview[]> {
  const departments = await getDepartments(orgId);
  const staffing: StaffingOverview[] = [];

  for (const dept of departments) {
    const team = await getTeamMembers(dept.id);
    const priorities = await getPriorities(dept.id);

    staffing.push({
      slug: dept.slug,
      name: dept.name,
      teamSize: team.length,
      priorityCount: priorities.length,
      ratio: team.length > 0 ? priorities.length / team.length : 0,
    });
  }

  return staffing;
}

export async function getCrossDepartmentDependencies(orgId: string): Promise<DepartmentDependency[]> {
  const departments = await getDepartments(orgId);
  const deptMap = new Map(departments.map((d) => [d.slug, d.name]));
  const deps: DepartmentDependency[] = [];
  let depId = 0;

  for (const dept of departments) {
    const priorities = await getPriorities(dept.id);
    for (const p of priorities) {
      for (const dep of p.dependencies) {
        const targetSlug = departments.find((d) =>
          dep.toLowerCase().includes(d.name.toLowerCase())
        )?.slug;
        if (targetSlug && targetSlug !== dept.slug) {
          deps.push({
            id: `dep-${++depId}`,
            sourceDepartment: dept.slug,
            sourceDepartmentName: dept.name,
            targetDepartment: targetSlug,
            targetDepartmentName: deptMap.get(targetSlug) ?? targetSlug,
            description: dep,
            priorityNames: [p.name],
          });
        }
      }
    }
  }

  return deps;
}

export async function getStrategicBlockers(orgId: string): Promise<StrategicBlocker[]> {
  const allPriorities = await getAllPrioritiesForOrg(orgId);
  const depCounts = new Map<string, { departments: Set<string>; priorities: { departmentName: string; priorityName: string }[] }>();

  for (const p of allPriorities) {
    for (const dep of p.dependencies) {
      const key = dep.toLowerCase().trim();
      if (!depCounts.has(key)) {
        depCounts.set(key, { departments: new Set(), priorities: [] });
      }
      const entry = depCounts.get(key)!;
      entry.departments.add(p.department.name);
      entry.priorities.push({ departmentName: p.department.name, priorityName: p.name });
    }
  }

  const blockers: StrategicBlocker[] = [];
  let blockerId = 0;
  for (const [name, data] of depCounts) {
    if (data.priorities.length >= 2) {
      blockers.push({
        id: `blocker-${++blockerId}`,
        name,
        affectedPriorityCount: data.priorities.length,
        departments: Array.from(data.departments),
        priorities: data.priorities,
      });
    }
  }

  blockers.sort((a, b) => b.affectedPriorityCount - a.affectedPriorityCount);
  return blockers;
}

export async function getToolOverlap(orgId: string): Promise<ToolOverlap[]> {
  const departments = await getDepartments(orgId);
  const toolMap = new Map<string, string[]>();

  for (const dept of departments) {
    for (const tool of dept.tools) {
      const key = tool.toLowerCase().trim();
      if (!toolMap.has(key)) toolMap.set(key, []);
      toolMap.get(key)!.push(dept.name);
    }
  }

  const overlaps: ToolOverlap[] = Array.from(toolMap.entries()).map(([tool, depts]) => ({
    tool,
    departments: depts,
  }));

  overlaps.sort((a, b) => b.departments.length - a.departments.length);
  return overlaps;
}

// ---------- Mutation Helpers ----------

export async function createOrganization(name: string, slug: string, userId: string): Promise<Organization> {
  const supabase = await createClient();
  const { data: org, error } = await supabase
    .from('organizations')
    .insert({ name, slug })
    .select()
    .single();
  if (error) throw error;

  await supabase
    .from('org_members')
    .insert({ org_id: org.id, user_id: userId, role: 'owner' });

  return org;
}

export async function joinOrg(orgId: string, userId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from('org_members')
    .insert({ org_id: orgId, user_id: userId, role: 'member' });
}

export async function createInvite(orgId: string, userId: string, opts: {
  email?: string;
  maxUses?: number;
  expiresAt?: string;
}): Promise<Invite> {
  const supabase = await createClient();
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  const { data, error } = await supabase
    .from('invites')
    .insert({
      org_id: orgId,
      code,
      email: opts.email ?? null,
      max_uses: opts.maxUses ?? null,
      expires_at: opts.expiresAt ?? null,
      created_by: userId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add data access layer replacing parser and aggregator"
```

---

### Task 7: Landing Page & Auth Pages

**Files:**
- Create: `src/components/AuthForm.tsx`
- Create: `src/app/(public)/page.tsx`
- Create: `src/app/(public)/login/page.tsx`
- Create: `src/app/(public)/signup/page.tsx`
- Create: `src/app/(public)/layout.tsx`

- [ ] **Step 1: Create AuthForm component**

```tsx
// src/components/AuthForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AuthFormProps {
  mode: 'login' | 'signup';
  inviteCode?: string;
}

export default function AuthForm({ mode, inviteCode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
    }

    if (inviteCode) {
      router.push(`/invite/${inviteCode}`);
    } else {
      router.push('/join');
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          placeholder="At least 6 characters"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40"
      >
        {loading ? 'Loading...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create public layout**

```tsx
// src/app/(public)/layout.tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 3: Create landing page**

```tsx
// src/app/(public)/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="text-white font-bold text-xl tracking-tight">X-Ray</div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white tracking-tight">X-Ray</h1>
          <p className="mt-4 text-xl text-slate-400">See everything. Automate what matters.</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create login page**

```tsx
// src/app/(public)/login/page.tsx
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string; invite?: string }> }) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Log In</h1>
        <AuthForm mode="login" inviteCode={params.invite} />
        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account?{' '}
          <Link href={params.invite ? `/signup?invite=${params.invite}` : '/signup'} className="text-emerald-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create signup page**

```tsx
// src/app/(public)/signup/page.tsx
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Create Account</h1>
        <AuthForm mode="signup" inviteCode={params.invite} />
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link href={params.invite ? `/login?invite=${params.invite}` : '/login'} className="text-emerald-600 font-medium hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/AuthForm.tsx src/app/\(public\)/
git commit -m "feat: add landing page, login, and signup pages"
```

---

### Task 8: Join & Invite Pages

**Files:**
- Create: `src/app/(public)/join/page.tsx`
- Create: `src/app/(public)/invite/[code]/page.tsx`

- [ ] **Step 1: Create join page**

```tsx
// src/app/(public)/join/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function JoinPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [mode, setMode] = useState<'join' | 'create'>('join');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: invite } = await supabase
        .from('invites')
        .select('*, organization:organizations(*)')
        .eq('code', inviteCode.trim().toUpperCase())
        .single();

      if (!invite) {
        setError('Invalid invite code');
        setLoading(false);
        return;
      }

      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        setError('This invite code has expired');
        setLoading(false);
        return;
      }

      if (invite.max_uses && invite.use_count >= invite.max_uses) {
        setError('This invite code has reached its maximum uses');
        setLoading(false);
        return;
      }

      await supabase.from('org_members').insert({
        org_id: invite.org_id,
        user_id: user.id,
        role: 'member',
      });

      await supabase
        .from('invites')
        .update({ use_count: invite.use_count + 1 })
        .eq('id', invite.id);

      router.push(`/org/${invite.organization.slug}/priorities`);
      router.refresh();
    } catch {
      setError('Failed to join organization');
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const slug = orgName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({ name: orgName, slug })
        .select()
        .single();

      if (orgError) {
        setError(orgError.message.includes('duplicate') ? 'An organization with this name already exists' : orgError.message);
        setLoading(false);
        return;
      }

      await supabase.from('org_members').insert({
        org_id: org.id,
        user_id: user.id,
        role: 'owner',
      });

      router.push(`/org/${slug}/priorities`);
      router.refresh();
    } catch {
      setError('Failed to create organization');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Join an Organization</h1>

        <div className="flex rounded-lg border border-slate-300 overflow-hidden w-full mb-6">
          <button
            type="button"
            onClick={() => setMode('join')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'join' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Enter Invite Code
          </button>
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'create' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Create Organization
          </button>
        </div>

        {mode === 'join' ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invite Code</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm uppercase"
                placeholder="ABCD1234"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40"
            >
              {loading ? 'Joining...' : 'Join'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                placeholder="My Company"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40"
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create invite acceptance page**

```tsx
// src/app/(public)/invite/[code]/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in — redirect to signup with invite code
  if (!user) {
    redirect(`/signup?invite=${code}`);
  }

  // Look up the invite
  const { data: invite } = await supabase
    .from('invites')
    .select('*, organization:organizations(*)')
    .eq('code', code)
    .single();

  if (!invite) {
    redirect('/join');
  }

  // Check if already a member
  const { data: existingMember } = await supabase
    .from('org_members')
    .select('id')
    .eq('org_id', invite.org_id)
    .eq('user_id', user.id)
    .single();

  if (existingMember) {
    redirect(`/org/${invite.organization.slug}/priorities`);
  }

  // Check expiry and usage limits
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    redirect('/join');
  }
  if (invite.max_uses && invite.use_count >= invite.max_uses) {
    redirect('/join');
  }

  // Join the org
  await supabase.from('org_members').insert({
    org_id: invite.org_id,
    user_id: user.id,
    role: 'member',
  });

  await supabase
    .from('invites')
    .update({ use_count: invite.use_count + 1 })
    .eq('id', invite.id);

  redirect(`/org/${invite.organization.slug}/priorities`);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(public\)/join/ src/app/\(public\)/invite/
git commit -m "feat: add join and invite acceptance pages"
```

---

### Task 9: Org Layout, Nav, Org Switcher, User Menu

**Files:**
- Create: `src/components/OrgSwitcher.tsx`
- Create: `src/components/UserMenu.tsx`
- Create: `src/app/org/[orgSlug]/layout.tsx`

- [ ] **Step 1: Create OrgSwitcher**

```tsx
// src/components/OrgSwitcher.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface OrgOption {
  slug: string;
  name: string;
}

interface OrgSwitcherProps {
  currentOrg: OrgOption;
  allOrgs: OrgOption[];
}

export default function OrgSwitcher({ currentOrg, allOrgs }: OrgSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (allOrgs.length <= 1) {
    return <span className="text-sm font-semibold text-white">{currentOrg.name}</span>;
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-emerald-300 transition-colors"
      >
        {currentOrg.name}
        <span className="text-xs">▼</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 min-w-48">
          {allOrgs.map((org) => (
            <Link
              key={org.slug}
              href={`/org/${org.slug}/priorities`}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 text-sm transition-colors ${
                org.slug === currentOrg.slug
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {org.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create UserMenu**

```tsx
// src/components/UserMenu.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface UserMenuProps {
  email: string;
  orgSlug: string;
  role: string;
}

export default function UserMenu({ email, orgSlug, role }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center hover:bg-emerald-500 transition-colors"
      >
        {email[0].toUpperCase()}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 min-w-48">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">{email}</p>
            <p className="text-xs text-slate-500 capitalize">{role}</p>
          </div>
          {(role === 'owner' || role === 'admin') && (
            <Link
              href={`/org/${orgSlug}/settings`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Settings
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create org layout**

This replaces the current `layout.tsx` nav for authenticated org-scoped pages. Copy the nav link structure from the existing layout but adapt for org-scoped routes.

```tsx
// src/app/org/[orgSlug]/layout.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserOrgs, getUserRole, getUnfiledRankedOpportunities } from '@/lib/db';
import OrgSwitcher from '@/components/OrgSwitcher';
import UserMenu from '@/components/UserMenu';
import { PriorityModalProvider } from '@/components/PriorityModalContext';

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) redirect('/join');

  const role = await getUserRole(org.id, user.id);
  if (!role) redirect('/join');

  const userOrgs = await getUserOrgs(user.id);
  const allOrgs = userOrgs.map((m) => ({
    slug: m.organization.slug,
    name: m.organization.name,
  }));

  const unfiled = await getUnfiledRankedOpportunities(org.id);
  const unfiledCount = unfiled.length;

  const base = `/org/${orgSlug}`;

  const navLinks = [
    { href: `${base}/priorities`, label: 'AI Priorities' },
    { href: `${base}/dashboard`, label: 'Dashboard' },
    { href: `${base}/tracker`, label: 'Tracker' },
    { href: `${base}/risks`, label: 'Risks' },
    { href: `${base}/dependencies`, label: 'Dependencies' },
    { href: `${base}/tools`, label: 'Tools' },
    { href: `${base}/unfiled`, label: 'Missing Gaps', badge: unfiledCount > 0 ? unfiledCount : undefined },
    { href: `${base}/upload`, label: 'Upload' },
  ];

  return (
    <PriorityModalProvider>
      <div className="min-h-screen bg-white">
        <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
          <div className="max-w-screen-2xl mx-auto px-4 flex items-center h-14 gap-6">
            <Link href={base} className="text-white font-bold text-lg tracking-tight shrink-0">
              X-Ray
            </Link>
            <OrgSwitcher currentOrg={{ slug: orgSlug, name: org.name }} allOrgs={allOrgs} />

            <div className="flex-1 flex items-center gap-1 overflow-x-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap"
                >
                  {link.label}
                  {link.badge !== undefined && (
                    <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <UserMenu email={user.email ?? ''} orgSlug={orgSlug} role={role} />
          </div>
        </nav>

        <main className="max-w-screen-2xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </PriorityModalProvider>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/OrgSwitcher.tsx src/components/UserMenu.tsx src/app/org/
git commit -m "feat: add org layout with switcher, user menu, and navigation"
```

---

### Task 10: Migrate All Pages Under `/org/[orgSlug]/`

**Files:**
- Create all pages under `src/app/org/[orgSlug]/` based on existing pages
- Each page changes: (1) receives `orgSlug` from params, (2) calls `db.ts` with `orgId` instead of the old parser/aggregator functions

The key change in every page is the same pattern:

```tsx
// Old pattern:
import { getTopWins } from '@/lib/aggregator';
export default function Page() {
  const data = getTopWins(100);
  // ...
}

// New pattern:
import { getTopWins, getOrgBySlug } from '@/lib/db';
export default async function Page({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();
  const data = await getTopWins(org.id, 100);
  // ...
}
```

- [ ] **Step 1: Create priorities page**

```tsx
// src/app/org/[orgSlug]/priorities/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrgBySlug, getTopWins } from '@/lib/db';
import PrioritiesTable from '@/components/PrioritiesTable';

export default async function PrioritiesPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const allOpportunities = await getTopWins(org.id, 100);
  const valid = allOpportunities.filter((o) => o.parsedTimeSavings.valid);
  const unfiledCount = allOpportunities.length - valid.length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Priorities</h1>
        <p className="text-slate-500 mt-1">Automation opportunities ranked by impact</p>
      </div>

      {unfiledCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-amber-800 text-sm">
            {unfiledCount} {unfiledCount === 1 ? 'priority is' : 'priorities are'} missing hours/week estimates.{' '}
            <Link href={`/org/${orgSlug}/unfiled`} className="font-medium underline hover:text-amber-900">
              View Missing Gaps
            </Link>{' '}
            to resolve them.
          </p>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">All Priorities</h2>
        <PrioritiesTable opportunities={valid} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create all remaining org pages**

Apply the same pattern to each page. For each, the only changes are:
1. Add `params` prop, extract `orgSlug`, look up `org`
2. Replace sync function calls with `await` async versions from `db.ts`, passing `org.id`
3. Update any internal links to include `/org/${orgSlug}/` prefix

Create these files using the existing page code as the base, applying the pattern above:

- `src/app/org/[orgSlug]/dashboard/page.tsx` — uses `getCompanyOverview(org.id)`, `getTimeSavingsRollup(org.id)`, `getStrategicBlockers(org.id)`
- `src/app/org/[orgSlug]/tracker/page.tsx` — uses `getOpportunitiesByMilestone(org.id)`
- `src/app/org/[orgSlug]/risks/page.tsx` — uses `getConsolidatedRisks(org.id)`, `getStaffingOverview(org.id)`
- `src/app/org/[orgSlug]/dependencies/page.tsx` — uses `getCrossDepartmentDependencies(org.id)`
- `src/app/org/[orgSlug]/tools/page.tsx` — uses `getToolOverlap(org.id)`
- `src/app/org/[orgSlug]/unfiled/page.tsx` — uses `getUnfiledRankedOpportunities(org.id)`, update Upload Fix links to `/org/${orgSlug}/upload?...`
- `src/app/org/[orgSlug]/upload/page.tsx` — uses `getDepartments(org.id)` for dept list
- `src/app/org/[orgSlug]/tour/page.tsx` — copy existing tour content
- `src/app/org/[orgSlug]/department/[slug]/page.tsx` — uses `getDepartmentBySlug(org.id, slug)`, `getPriorities(dept.id)`, `getTeamMembers(dept.id)`
- `src/app/org/[orgSlug]/plan/[slug]/[priority]/page.tsx` — same pattern

Each page file should read the existing page it replaces (listed in "Files to Delete" above) and adapt with the org-scoped pattern.

- [ ] **Step 3: Commit after each batch of 3-4 pages**

```bash
git add src/app/org/
git commit -m "feat: migrate pages under org-scoped routes"
```

---

### Task 11: Upload API Route Update

**Files:**
- Modify: `src/app/api/upload/route.ts`

The upload route changes from writing files to disk to parsing markdown in memory and inserting into Supabase.

- [ ] **Step 1: Rewrite the upload route**

```ts
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Reuse the parsing logic from the old parser.ts but as in-memory functions.
// Import from a new parse utility or inline the parsing.
// For now, we'll import the old parser functions as utilities:
import { parsePrioritiesFromText, parseProfileFromText } from '@/lib/parse-upload';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const fileType = formData.get('fileType') as string;
  const slug = formData.get('slug') as string;
  const orgId = formData.get('orgId') as string;
  const newDepartmentName = formData.get('newDepartmentName') as string | null;

  if (!file || !file.name.endsWith('.md')) {
    return NextResponse.json({ error: 'File must be .md format' }, { status: 400 });
  }

  const text = await file.text();
  if (!text.trim()) {
    return NextResponse.json({ error: 'File is empty' }, { status: 400 });
  }

  let departmentSlug = slug;
  let departmentName = '';

  // Handle new department creation
  if (slug === '__new__' && newDepartmentName) {
    departmentSlug = newDepartmentName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    departmentName = newDepartmentName;
  }

  // Ensure department exists
  let { data: dept } = await supabase
    .from('departments')
    .select('*')
    .eq('org_id', orgId)
    .eq('slug', departmentSlug)
    .single();

  if (!dept) {
    const { data: newDept, error } = await supabase
      .from('departments')
      .insert({ org_id: orgId, slug: departmentSlug, name: departmentName || departmentSlug })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    dept = newDept;
  }

  try {
    if (fileType === 'profile') {
      const profile = parseProfileFromText(text);
      await supabase
        .from('departments')
        .update({
          name: profile.name || dept.name,
          mission: profile.mission,
          scope: profile.scope,
          tools: profile.tools,
          single_points_of_failure: profile.singlePointsOfFailure,
          pain_points: profile.painPoints,
          tribal_knowledge_risks: profile.tribalKnowledgeRisks,
        })
        .eq('id', dept.id);

      // Upsert team members
      await supabase.from('team_members').delete().eq('department_id', dept.id);
      if (profile.teamMembers.length > 0) {
        await supabase.from('team_members').insert(
          profile.teamMembers.map((tm) => ({
            department_id: dept!.id,
            name: tm.name,
            title: tm.title,
            responsibilities: tm.responsibilities,
          }))
        );
      }
    } else {
      const priorities = parsePrioritiesFromText(text);

      // Delete existing priorities for this department
      await supabase.from('priorities').delete().eq('department_id', dept.id);

      // Insert new priorities
      if (priorities.length > 0) {
        const { data: insertedPriorities } = await supabase
          .from('priorities')
          .insert(
            priorities.map((p, i) => ({
              department_id: dept!.id,
              rank: i + 1,
              name: p.name,
              effort: p.effort,
              complexity: p.complexity,
              impact: p.impact,
              what_to_automate: p.whatToAutomate,
              current_state: p.currentState,
              why_it_matters: p.whyItMatters,
              estimated_time_savings: p.estimatedTimeSavings,
              suggested_approach: p.suggestedApproach,
              success_criteria: p.successCriteria,
              dependencies: p.dependencies,
              status: p.status,
            }))
          )
          .select();

        // Create milestone entries for each priority
        if (insertedPriorities) {
          await supabase.from('milestones').insert(
            insertedPriorities.map((p) => ({
              priority_id: p.id,
              stage: 0,
            }))
          );
        }
      }
    }

    return NextResponse.json({ slug: departmentSlug });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create `src/lib/parse-upload.ts`**

Extract the markdown parsing logic from the old `parser.ts` into a standalone utility that works on text strings (no filesystem access). This file reuses the parsing regex/logic but takes a string as input instead of reading from disk.

```ts
// src/lib/parse-upload.ts
// In-memory markdown parser for upload processing.
// Extracts the parsing logic from the old parser.ts to work on text strings.

import type { DepartmentProfile, AutomationPriority, TeamMember } from '@/lib/types';

export function parseProfileFromText(text: string): DepartmentProfile {
  // Use the same regex patterns from the old parser.ts parseProfile function
  // but operate on the `text` string instead of reading from filesystem.
  // The implementation should be copied from parser.ts with fs.readFileSync
  // calls replaced by using the `text` parameter directly.

  const lines = text.split('\n');

  function extractSection(heading: string): string[] {
    const items: string[] = [];
    let inSection = false;
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) {
        inSection = true;
        continue;
      }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.startsWith('- ')) {
        items.push(line.replace(/^-\s*/, '').trim());
      }
    }
    return items;
  }

  function extractText(heading: string): string {
    let inSection = false;
    const parts: string[] = [];
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) {
        inSection = true;
        continue;
      }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.trim()) parts.push(line.trim());
    }
    return parts.join(' ');
  }

  // Parse team members from table format
  const teamMembers: TeamMember[] = [];
  let inTeamSection = false;
  let pastHeader = false;
  for (const line of lines) {
    if (line.match(/^#{1,3}\s.*team/i)) { inTeamSection = true; continue; }
    if (inTeamSection && /^#{1,3}\s/.test(line) && !line.match(/team/i)) break;
    if (inTeamSection && line.includes('|') && line.includes('---')) { pastHeader = true; continue; }
    if (inTeamSection && pastHeader && line.includes('|')) {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        teamMembers.push({
          name: cols[0],
          title: cols[1] ?? '',
          responsibilities: cols[2] ?? '',
        });
      }
    }
  }

  const name = (lines.find((l) => /^#\s/.test(l)) ?? '').replace(/^#\s*/, '').replace(/department\s*profile/i, '').trim();

  return {
    slug: '',
    name,
    mission: extractText('mission') || extractText('purpose'),
    scope: extractText('scope'),
    teamMembers,
    tools: extractSection('tools') || extractSection('software'),
    singlePointsOfFailure: extractSection('single point'),
    painPoints: extractSection('pain point'),
    tribalKnowledgeRisks: extractSection('tribal knowledge'),
  };
}

export function parsePrioritiesFromText(text: string): AutomationPriority[] {
  // Use the same regex patterns from the old parser.ts parsePriorities function
  // Split by priority headings, extract fields from each section.
  // This should be copied from parser.ts with fs.readFileSync replaced by text param.

  const priorities: AutomationPriority[] = [];
  const sections = text.split(/^##\s+(?:Priority\s+)?(\d+)/mi);

  // sections[0] is content before first priority
  // sections[1] is rank, sections[2] is content, etc.
  for (let i = 1; i < sections.length; i += 2) {
    const rank = parseInt(sections[i], 10);
    const content = sections[i + 1] ?? '';
    const contentLines = content.split('\n');

    function findField(pattern: RegExp): string {
      for (const line of contentLines) {
        const match = line.match(pattern);
        if (match) return match[1]?.trim() ?? '';
      }
      return '';
    }

    function findSection(heading: string): string {
      let inSection = false;
      const parts: string[] = [];
      for (const line of contentLines) {
        if (line.match(new RegExp(`^###?\\s.*${heading}`, 'i'))) { inSection = true; continue; }
        if (inSection && /^###?\s/.test(line)) break;
        if (inSection && line.trim()) parts.push(line.trim());
      }
      return parts.join('\n');
    }

    function findList(heading: string): string[] {
      let inSection = false;
      const items: string[] = [];
      for (const line of contentLines) {
        if (line.match(new RegExp(`^###?\\s.*${heading}`, 'i'))) { inSection = true; continue; }
        if (inSection && /^###?\s/.test(line)) break;
        if (inSection && /^[-*]\s/.test(line.trim())) {
          items.push(line.trim().replace(/^[-*]\s*/, ''));
        }
      }
      return items;
    }

    const nameMatch = contentLines[0]?.match(/^[:\s—–-]*(.+)/);
    const name = nameMatch?.[1]?.trim() ?? `Priority ${rank}`;

    priorities.push({
      departmentSlug: '',
      rank,
      name,
      effort: findField(/\*?\*?effort\*?\*?[:\s]+(.+)/i),
      complexity: findField(/\*?\*?complexity\*?\*?[:\s]+(.+)/i),
      impact: findField(/\*?\*?impact\*?\*?[:\s]+(.+)/i),
      whatToAutomate: findSection('what to automate') || findSection('automate'),
      currentState: findSection('current state') || findSection('current process'),
      whyItMatters: findSection('why it matters') || findSection('why'),
      estimatedTimeSavings: findField(/\*?\*?estimated time saving\*?\*?s?[:\s]+(.+)/i) || findField(/\*?\*?time saving\*?\*?s?[:\s]+(.+)/i),
      suggestedApproach: findSection('suggested approach') || findSection('approach'),
      successCriteria: findSection('success criteria') || findSection('success'),
      dependencies: findList('dependencies') || findList('depends on'),
      status: findField(/\*?\*?status\*?\*?[:\s]+(.+)/i),
    });
  }

  return priorities;
}
```

- [ ] **Step 3: Update UploadForm to pass orgId**

In `src/components/UploadForm.tsx`, add `orgId` to the props and include it in the form data submission:

```tsx
// Add to interface:
interface UploadFormProps {
  departments: Department[];
  orgId: string;
  orgSlug: string;
}

// Add to formData in handleSubmit:
formData.append('orgId', orgId);

// Update redirect:
router.push(`/org/${orgSlug}/department/${data.slug}`);
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/upload/route.ts src/lib/parse-upload.ts src/components/UploadForm.tsx
git commit -m "feat: rewrite upload to insert into Supabase instead of filesystem"
```

---

### Task 12: Settings Page (Members & Invites)

**Files:**
- Create: `src/app/org/[orgSlug]/settings/page.tsx`
- Create: `src/components/MemberList.tsx`
- Create: `src/components/InviteManager.tsx`

- [ ] **Step 1: Create MemberList component**

```tsx
// src/components/MemberList.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { OrgMember } from '@/lib/types';

interface MemberListProps {
  members: (OrgMember & { email: string })[];
  currentUserId: string;
  currentUserRole: string;
  orgId: string;
}

export default function MemberList({ members, currentUserId, currentUserRole, orgId }: MemberListProps) {
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);

  async function removeMember(memberId: string) {
    setRemoving(memberId);
    const supabase = createClient();
    await supabase.from('org_members').delete().eq('id', memberId);
    router.refresh();
    setRemoving(null);
  }

  return (
    <div className="space-y-2">
      {members.map((m) => (
        <div key={m.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-900">{m.email}</p>
            <p className="text-xs text-slate-500 capitalize">{m.role}</p>
          </div>
          {currentUserRole === 'owner' && m.user_id !== currentUserId && m.role !== 'owner' && (
            <button
              onClick={() => removeMember(m.id)}
              disabled={removing === m.id}
              className="text-xs text-red-600 hover:text-red-800"
            >
              {removing === m.id ? 'Removing...' : 'Remove'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create InviteManager component**

```tsx
// src/components/InviteManager.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Invite } from '@/lib/types';

interface InviteManagerProps {
  invites: Invite[];
  orgId: string;
}

export default function InviteManager({ invites, orgId }: InviteManagerProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [maxUses, setMaxUses] = useState('');

  async function createInvite(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await supabase.from('invites').insert({
      org_id: orgId,
      code,
      max_uses: maxUses ? parseInt(maxUses, 10) : null,
      created_by: user.id,
    });

    setMaxUses('');
    setCreating(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={createInvite} className="flex gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Max Uses (optional)</label>
          <input
            type="number"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            className="w-24 border border-slate-300 rounded-lg px-2 py-1.5 text-sm"
            placeholder="∞"
            min="1"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40"
        >
          {creating ? 'Creating...' : 'Create Invite Code'}
        </button>
      </form>

      {invites.length > 0 && (
        <div className="space-y-2">
          {invites.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-mono font-bold text-slate-900">{inv.code}</p>
                <p className="text-xs text-slate-500">
                  Used {inv.use_count}{inv.max_uses ? `/${inv.max_uses}` : ''} times
                  {inv.expires_at ? ` · Expires ${new Date(inv.expires_at).toLocaleDateString()}` : ''}
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(inv.code)}
                className="text-xs text-emerald-600 hover:text-emerald-800"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create settings page**

```tsx
// src/app/org/[orgSlug]/settings/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrgBySlug, getUserRole, getOrgMembers, getOrgInvites } from '@/lib/db';
import MemberList from '@/components/MemberList';
import InviteManager from '@/components/InviteManager';

export default async function SettingsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const org = await getOrgBySlug(orgSlug);
  if (!org) redirect('/join');

  const role = await getUserRole(org.id, user.id);
  if (!role || (role !== 'owner' && role !== 'admin')) {
    redirect(`/org/${orgSlug}/priorities`);
  }

  const members = await getOrgMembers(org.id);
  const invites = await getOrgInvites(org.id);

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">{org.name}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Members</h2>
        <MemberList
          members={members}
          currentUserId={user.id}
          currentUserRole={role}
          orgId={org.id}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Invite Codes</h2>
        <InviteManager invites={invites} orgId={org.id} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/MemberList.tsx src/components/InviteManager.tsx src/app/org/\[orgSlug\]/settings/
git commit -m "feat: add settings page with member list and invite management"
```

---

### Task 13: Seed Script

**Files:**
- Create: `scripts/seed.ts`

- [ ] **Step 1: Create the seed script**

```ts
// scripts/seed.ts
// Run with: npx tsx scripts/seed.ts
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ORGS = [
  { name: 'Helix', slug: 'helix' },
  { name: 'The Printing House', slug: 'the-printing-house' },
  { name: 'Winters Instruments', slug: 'winters-instruments' },
  { name: 'Connect CPA', slug: 'connect-cpa' },
  { name: 'WeVend', slug: 'wevend' },
];

// Import parsing functions for WeVend data
// Reuse the old parser.ts logic by reading the artifact files directly
const ARTIFACTS_DIR = path.join(process.cwd(), 'artifacts', 'WeVend X-Ray');

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

// Simplified parsers for seeding (copied from parse-upload.ts patterns)
function parseDepartmentProfile(text: string) {
  const lines = text.split('\n');

  function extractSection(heading: string): string[] {
    const items: string[] = [];
    let inSection = false;
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) { inSection = true; continue; }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.startsWith('- ')) items.push(line.replace(/^-\s*/, '').trim());
    }
    return items;
  }

  function extractText(heading: string): string {
    let inSection = false;
    const parts: string[] = [];
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) { inSection = true; continue; }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.trim()) parts.push(line.trim());
    }
    return parts.join(' ');
  }

  const teamMembers: { name: string; title: string; responsibilities: string }[] = [];
  let inTeam = false;
  let pastHeader = false;
  for (const line of lines) {
    if (line.match(/^#{1,3}\s.*team/i)) { inTeam = true; continue; }
    if (inTeam && /^#{1,3}\s/.test(line) && !line.match(/team/i)) break;
    if (inTeam && line.includes('---')) { pastHeader = true; continue; }
    if (inTeam && pastHeader && line.includes('|')) {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        teamMembers.push({ name: cols[0], title: cols[1] ?? '', responsibilities: cols[2] ?? '' });
      }
    }
  }

  const name = (lines.find((l) => /^#\s/.test(l)) ?? '').replace(/^#\s*/, '').replace(/department\s*profile/i, '').trim();

  return {
    name,
    mission: extractText('mission') || extractText('purpose'),
    scope: extractText('scope'),
    teamMembers,
    tools: extractSection('tools') || extractSection('software'),
    singlePointsOfFailure: extractSection('single point'),
    painPoints: extractSection('pain point'),
    tribalKnowledgeRisks: extractSection('tribal knowledge'),
  };
}

async function seed() {
  console.log('Seeding organizations...\n');

  for (const org of ORGS) {
    // Create org
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .upsert({ name: org.name, slug: org.slug }, { onConflict: 'slug' })
      .select()
      .single();

    if (orgError) { console.error(`Failed to create ${org.name}:`, orgError.message); continue; }
    console.log(`✓ Created org: ${org.name}`);

    // Create invite code
    const code = org.slug.toUpperCase().replace(/-/g, '') + '2026';
    await supabase
      .from('invites')
      .upsert({ org_id: orgData.id, code, created_by: null }, { onConflict: 'code' });
    console.log(`  Invite code: ${code}`);

    // Import WeVend data
    if (org.slug === 'wevend') {
      console.log('  Importing WeVend department data...');
      const deptDirs = fs.readdirSync(ARTIFACTS_DIR);

      for (const dir of deptDirs) {
        const deptPath = path.join(ARTIFACTS_DIR, dir);
        if (!fs.statSync(deptPath).isDirectory()) continue;

        const slug = dir;
        const profilePath = path.join(deptPath, 'department_profile.md');
        const prioritiesPath = path.join(deptPath, 'automation_priorities.md');

        let deptName = dir.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        let profile: ReturnType<typeof parseDepartmentProfile> | null = null;

        if (fs.existsSync(profilePath)) {
          profile = parseDepartmentProfile(readFile(profilePath));
          deptName = profile.name || deptName;
        }

        // Upsert department
        const { data: dept, error: deptError } = await supabase
          .from('departments')
          .upsert({
            org_id: orgData.id,
            slug,
            name: deptName,
            mission: profile?.mission ?? '',
            scope: profile?.scope ?? '',
            tools: profile?.tools ?? [],
            single_points_of_failure: profile?.singlePointsOfFailure ?? [],
            pain_points: profile?.painPoints ?? [],
            tribal_knowledge_risks: profile?.tribalKnowledgeRisks ?? [],
          }, { onConflict: 'org_id,slug' })
          .select()
          .single();

        if (deptError) { console.error(`  Failed to create dept ${slug}:`, deptError.message); continue; }
        console.log(`  ✓ Department: ${deptName}`);

        // Insert team members
        if (profile?.teamMembers?.length) {
          await supabase.from('team_members').delete().eq('department_id', dept.id);
          await supabase.from('team_members').insert(
            profile.teamMembers.map((tm) => ({
              department_id: dept.id,
              name: tm.name,
              title: tm.title,
              responsibilities: tm.responsibilities,
            }))
          );
          console.log(`    ${profile.teamMembers.length} team members`);
        }

        // Import priorities (using existing parser.ts at runtime for accuracy)
        if (fs.existsSync(prioritiesPath)) {
          // For seeding, we'll use a simplified inline parser
          // In production, the full parser runs during upload
          const priorityText = readFile(prioritiesPath);
          const sections = priorityText.split(/^##\s+(?:Priority\s+)?(\d+)/mi);

          const priorities: { rank: number; name: string; [key: string]: unknown }[] = [];
          for (let i = 1; i < sections.length; i += 2) {
            const rank = parseInt(sections[i], 10);
            const content = sections[i + 1] ?? '';
            const contentLines = content.split('\n');

            function findField(pattern: RegExp): string {
              for (const line of contentLines) {
                const match = line.match(pattern);
                if (match) return match[1]?.trim() ?? '';
              }
              return '';
            }

            function findSection(heading: string): string {
              let inSection = false;
              const parts: string[] = [];
              for (const line of contentLines) {
                if (line.match(new RegExp(`^###?\\s.*${heading}`, 'i'))) { inSection = true; continue; }
                if (inSection && /^###?\s/.test(line)) break;
                if (inSection && line.trim()) parts.push(line.trim());
              }
              return parts.join('\n');
            }

            function findList(heading: string): string[] {
              let inSection = false;
              const items: string[] = [];
              for (const line of contentLines) {
                if (line.match(new RegExp(`^###?\\s.*${heading}`, 'i'))) { inSection = true; continue; }
                if (inSection && /^###?\s/.test(line)) break;
                if (inSection && /^[-*]\s/.test(line.trim())) items.push(line.trim().replace(/^[-*]\s*/, ''));
              }
              return items;
            }

            const nameMatch = contentLines[0]?.match(/^[:\s—–-]*(.+)/);
            const name = nameMatch?.[1]?.trim() ?? `Priority ${rank}`;

            priorities.push({
              rank,
              name,
              effort: findField(/\*?\*?effort\*?\*?[:\s]+(.+)/i),
              complexity: findField(/\*?\*?complexity\*?\*?[:\s]+(.+)/i),
              impact: findField(/\*?\*?impact\*?\*?[:\s]+(.+)/i),
              what_to_automate: findSection('what to automate') || findSection('automate'),
              current_state: findSection('current state') || findSection('current process'),
              why_it_matters: findSection('why it matters') || findSection('why'),
              estimated_time_savings: findField(/\*?\*?estimated time saving\*?\*?s?[:\s]+(.+)/i),
              suggested_approach: findSection('suggested approach') || findSection('approach'),
              success_criteria: findSection('success criteria') || findSection('success'),
              dependencies: findList('dependencies') || findList('depends on'),
              status: findField(/\*?\*?status\*?\*?[:\s]+(.+)/i),
            });
          }

          // Delete existing, insert new
          await supabase.from('priorities').delete().eq('department_id', dept.id);

          if (priorities.length > 0) {
            const { data: inserted } = await supabase
              .from('priorities')
              .insert(priorities.map((p) => ({ department_id: dept.id, ...p })))
              .select();

            // Create milestones
            if (inserted) {
              await supabase.from('milestones').insert(
                inserted.map((p) => ({ priority_id: p.id, stage: 0 }))
              );
            }
            console.log(`    ${priorities.length} priorities`);
          }
        }
      }
    }
  }

  console.log('\n✓ Seeding complete!');
  console.log('\nInvite codes:');
  for (const org of ORGS) {
    const code = org.slug.toUpperCase().replace(/-/g, '') + '2026';
    console.log(`  ${org.name}: ${code}`);
  }
}

seed().catch(console.error);
```

- [ ] **Step 2: Install tsx for running the script**

```bash
npm install -D tsx
```

- [ ] **Step 3: Commit**

```bash
git add scripts/seed.ts package.json package-lock.json
git commit -m "feat: add seed script for 5 initial orgs with WeVend data import"
```

---

### Task 14: Simplify Root Layout & Remove Old Files

**Files:**
- Modify: `src/app/layout.tsx`
- Delete: old page files, PasswordGate, parser.ts (runtime), aggregator.ts

- [ ] **Step 1: Simplify root layout**

The root layout should be a minimal shell — no nav (org layout handles that), no PasswordGate.

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'X-Ray',
  description: 'See everything. Automate what matters.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Delete old page files**

```bash
rm -f src/app/page.tsx
rm -rf src/app/dashboard
rm -rf src/app/tracker
rm -rf src/app/risks
rm -rf src/app/dependencies
rm -rf src/app/tools
rm -rf src/app/unfiled
rm -rf src/app/upload
rm -rf src/app/tour
rm -rf src/app/department
rm -rf src/app/plan
rm -f src/components/PasswordGate.tsx
```

- [ ] **Step 3: Remove PasswordGate import from any remaining files**

Search for and remove any remaining references to `PasswordGate` in the codebase.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: simplify root layout, remove old pages and PasswordGate"
```

---

### Task 15: Update Tests

**Files:**
- Modify: `src/lib/__tests__/parser.test.ts` — update or remove tests that depend on filesystem reads
- Create: `src/lib/__tests__/db.test.ts` — basic tests for `parseTimeSavings` and `computeScore` (pure functions that don't need Supabase)

- [ ] **Step 1: Update test imports for pure functions**

The `parseTimeSavings` function moved to `db.ts` and `computeScore` to `constants.ts`. Create a test file for these:

```ts
// src/lib/__tests__/db.test.ts
import { describe, it, expect } from 'vitest';
import { parseTimeSavings } from '../db';
import { computeScore } from '../constants';

describe('parseTimeSavings', () => {
  it('parses range format', () => {
    const result = parseTimeSavings('5-10 hours/week');
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.min).toBe(5);
      expect(result.max).toBe(10);
      expect(result.midpoint).toBe(7.5);
    }
  });

  it('parses single value', () => {
    const result = parseTimeSavings('3 hours/week');
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.min).toBe(3);
      expect(result.max).toBe(3);
    }
  });

  it('returns invalid for empty string', () => {
    const result = parseTimeSavings('');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for non-standard units', () => {
    const result = parseTimeSavings('5 days/month');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.issue).toBe('non-standard unit');
    }
  });

  it('returns invalid for no numeric value', () => {
    const result = parseTimeSavings('significant time savings expected');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.issue).toBe('no numeric value found');
    }
  });
});

describe('computeScore', () => {
  it('computes High impact * Low effort = 9', () => {
    expect(computeScore('High', 'Low')).toBe(9);
  });

  it('computes Low impact * High effort = 1', () => {
    expect(computeScore('Low', 'High')).toBe(1);
  });

  it('computes Critical impact * Low effort = 15', () => {
    expect(computeScore('Critical', 'Low')).toBe(15);
  });
});
```

- [ ] **Step 2: Remove or skip old tests that depend on filesystem**

The old parser.test.ts and aggregator.test.ts read from `artifacts/` which will no longer be the runtime data source. These tests can be kept as integration tests (they still validate the markdown parsing), but they should be moved to a separate test file or marked as skipped if the parser.ts file is removed.

If `parser.ts` is kept as a reference file (not deleted), keep the tests. If it's deleted, remove the test files too.

```bash
# If removing parser.ts entirely:
rm -f src/lib/parser.ts
rm -f src/lib/aggregator.ts
rm -f src/lib/__tests__/parser.test.ts
rm -f src/lib/__tests__/aggregator.test.ts
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add db/constants tests, remove old parser/aggregator tests"
```

---

### Task 16: Build, Test, Deploy

- [ ] **Step 1: Create Supabase project**

If not already done, create a Supabase project at https://supabase.com/dashboard. Copy the URL, anon key, and service role key to `.env.local`.

- [ ] **Step 2: Run the migration**

Go to Supabase SQL Editor and run `supabase/migrations/001_schema.sql`.

- [ ] **Step 3: Enable email auth in Supabase**

Go to Supabase Dashboard → Authentication → Providers → Email. Ensure it's enabled. Disable "Confirm email" for easier testing (can re-enable later).

- [ ] **Step 4: Run the seed script**

```bash
npx tsx scripts/seed.ts
```

Expected output: 5 orgs created with invite codes, WeVend data imported.

- [ ] **Step 5: Build and test locally**

```bash
npm run build
npm run dev
```

Test flow:
1. Visit `http://localhost:3000` — see landing page
2. Click Sign Up — create account
3. Enter WeVend invite code (`WEVEND2026`) — join org
4. See AI Priorities with WeVend data
5. Test org switcher, settings page, upload

- [ ] **Step 6: Set Vercel environment variables**

```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
```

- [ ] **Step 7: Deploy**

```bash
npx vercel --prod
```

- [ ] **Step 8: Push to remotes**

```bash
git push xray main
```

- [ ] **Step 9: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final multi-tenant deployment adjustments"
```
