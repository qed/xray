# Organization Dashboard — Design Spec

**Date:** 2026-03-30
**Goal:** Replace the nav-bar org dropdown with a dedicated organization landing page showing card-per-org with invite codes, stats, and role badges. Lowercase all invite codes. Redirect login to the org page instead of directly into an org.

---

## Problem Statement

The current org switcher is a dropdown in the nav bar that links directly to `/org/{slug}/priorities`. There's no central place to see all your orgs at a glance, share invite codes, or understand org-level stats. Invite codes are uppercase which looks aggressive. The login flow skips the org page entirely.

---

## Architecture

Three changes:

1. **New `/orgs` page** — server component showing org cards with stats, invite codes, and role badges
2. **OrgSwitcher replacement** — the nav bar dropdown becomes a simple link back to `/orgs`
3. **Invite code normalization** — lowercase codes in seed script, case-insensitive matching in join page, SQL migration for existing codes

---

## Section 1: New `/orgs` Page

### Route: `src/app/(protected)/orgs/page.tsx`

Server component. Requires authentication (redirect to `/login` if not logged in).

**Data fetching:**
- `getUserOrgs(userId)` — returns org memberships with nested organization
- For each org: fetch department count and priority count
- For each org: fetch first invite code

**New DB function: `getOrgStats(orgId: string): Promise<{ departmentCount: number; priorityCount: number }>`**

Runs two count queries (departments, priorities) for the given org.

**New DB function: `getFirstInviteCode(orgId: string): Promise<string | null>`**

Returns the first (oldest) invite code for the org, or null if none exist.

### Layout

The `/orgs` page needs its own minimal layout — NOT the full org layout with nav links (since no org is selected yet).

**Route group:** `src/app/(protected)/layout.tsx`

Minimal layout with:
- Slate-900 nav bar containing only the X-Ray logo (links to `/orgs`) and UserMenu (email + logout only, no settings link since no org context)
- White background main area

**Org cards** — 2-column responsive grid (`grid-cols-1 md:grid-cols-2`):

Each card shows:
- **Org name** (large, bold)
- **Role badge** — owner (emerald), admin (blue), member (slate)
- **Stats row** — "{N} departments" and "{N} priorities"
- **Invite code** — lowercase, in a green tinted box with copy button
- **Entire card is clickable** — navigates to `/org/{slug}/priorities`

**Footer link:** "+ Join another organization" → links to `/join`

### Component: `src/components/OrgCard.tsx`

Client component (needs onClick copy for invite code).

Props:
```typescript
interface OrgCardProps {
  name: string;
  slug: string;
  role: string;
  departmentCount: number;
  priorityCount: number;
  inviteCode: string | null;
}
```

Clicking the card navigates to `/org/{slug}/priorities`. The invite code copy button uses `navigator.clipboard.writeText()` with a brief "Copied!" feedback.

---

## Section 2: OrgSwitcher → Org Link

### Replace `src/components/OrgSwitcher.tsx`

The dropdown component is replaced with a simple link showing the current org name that navigates to `/orgs`.

**Before:**
```tsx
<OrgSwitcher currentOrg={...} allOrgs={...} />
```

**After:**
```tsx
<Link href="/orgs" className="text-sm font-semibold text-white hover:text-emerald-300">
  {org.name}
</Link>
```

The `allOrgs` prop and `getUserOrgs()` call in the org layout can be removed since we no longer need to list all orgs in the nav.

---

## Section 3: Auth Flow Changes

### AuthForm.tsx — post-login redirect

**Current:** After login, queries `org_members` and redirects to `/org/{first_slug}/priorities`.

**New:** After login, always redirect to `/orgs`. The org page handles the case where user has 0, 1, or many orgs.

Remove the `org_members` query from AuthForm entirely. After successful auth:
- If `inviteCode` is present: redirect to `/invite/{code}` (unchanged)
- Otherwise: redirect to `/orgs`

### Invite page — post-accept redirect

**Current:** After accepting invite, redirects to `/org/{slug}/priorities`.

**New:** After accepting invite, redirect to `/org/{slug}/priorities` (unchanged — user just joined an org, take them straight in).

### Join page — post-join/create redirect

**Current:** After joining or creating, redirects to `/org/{slug}/priorities`.

**New:** Unchanged. User just picked/created an org, take them straight in.

### Proxy — allow `/orgs` path

Add `/orgs` to the protected paths that require auth but don't require org membership. Currently the proxy only knows about public paths and `/org/{slug}` paths. `/orgs` is a new authenticated-but-no-org path.

The proxy should:
- Allow `/orgs` through for authenticated users (no org membership check needed)
- Redirect unauthenticated users hitting `/orgs` to `/login`

---

## Section 4: Invite Code Normalization

### Seed script change

In `scripts/seed.ts`, change invite code generation from:
```typescript
const code = org.slug.toUpperCase().replace(/-/g, '') + '2026';
```
to:
```typescript
const code = org.slug.replace(/-/g, '') + '2026';
```

### Join page — case-insensitive matching

In `src/app/(public)/join/page.tsx`, the invite code query currently does:
```typescript
.eq('code', inviteCode.trim().toUpperCase())
```

Change to case-insensitive matching. Since codes are now stored lowercase, normalize input to lowercase:
```typescript
.eq('code', inviteCode.trim().toLowerCase())
```

### Invite accept page — case-insensitive matching

In `src/app/(public)/invite/[code]/page.tsx`, the code comes from the URL. Normalize to lowercase before querying:
```typescript
const normalizedCode = code.toLowerCase();
```

### SQL migration for existing codes

New Supabase migration to lowercase all existing invite codes:
```sql
UPDATE invites SET code = LOWER(code);
```

### InviteManager — generate lowercase codes

In `src/components/InviteManager.tsx`, the random code generation currently uses `.toUpperCase()`. Change to use lowercase characters.

---

## Section 5: Cleanup

- Delete `src/components/OrgSwitcher.tsx` — no longer used
- Remove `allOrgs` prop threading from org layout
- Remove `getUserOrgs()` call from org layout (the `/orgs` page calls it instead)

---

## Testing

- Login → lands on `/orgs` page (not directly into an org)
- `/orgs` page shows cards for all orgs user belongs to
- Each card shows name, role, stats, invite code
- Clicking a card navigates into the org
- Org nav bar shows org name as link back to `/orgs` (no dropdown)
- Invite codes display as lowercase
- Joining with any case of invite code works (case-insensitive)
- Copy button on invite code works
- Unauthenticated user hitting `/orgs` gets redirected to `/login`
- User with 0 orgs sees empty state with link to `/join`
