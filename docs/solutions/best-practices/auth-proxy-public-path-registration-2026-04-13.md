---
title: New unauthenticated pages require proxy.ts publicPaths update, not just (public) route group
date: 2026-04-13
category: best-practices
module: authentication
problem_type: best_practice
component: routing
severity: medium
applies_when:
  - Adding any new page that must be accessible to unauthenticated users
  - Planning auth-related features (login, signup, password reset, magic links)
  - Moving pages into or out of authentication-protected areas
tags:
  - nextjs
  - auth
  - middleware
  - proxy
  - route-groups
  - public-paths
---

# New unauthenticated pages require proxy.ts publicPaths update, not just (public) route group

## Context

During planning for magic link login and password reset, new pages (`/forgot-password`, `/update-password`) were placed under the `(public)` route group at `src/app/(public)/`. A plan review caught that this alone would not make those pages accessible to unauthenticated users. The app uses a custom auth proxy at `src/proxy.ts` — not the standard Next.js `middleware.ts` — which maintains its own allowlists that are completely independent of Next.js route group conventions.

## Guidance

The Next.js `(public)` route group controls **layout inheritance only** — it has zero effect on authentication enforcement. All auth gating is performed by the custom proxy in `src/proxy.ts`, which checks incoming paths against two explicit allowlists:

```typescript
// src/proxy.ts
const publicPaths = ['/', '/login', '/signup', '/signup-success', '/join'];
const publicPrefixes = ['/invite/', '/auth/', '/wevend', '/csuite'];

function isPublicPath(pathname: string): boolean {
  if (publicPaths.includes(pathname)) return true;
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) return true;
  return false;
}
```

When adding any new page that must be accessible without authentication:

1. Place the page file under `src/app/(public)/` for correct layout inheritance
2. Add the path to `publicPaths` (for exact routes) or `publicPrefixes` (for path families) in `src/proxy.ts`

Both steps are required. Step 1 without step 2 means the page exists but the proxy blocks it.

## Why This Matters

Without the proxy update, unauthenticated visitors are silently redirected to `/login`. For auth recovery flows (password reset, magic link), this completely breaks the user journey — a user clicking a password reset link from their email would land on the login page instead of the password update form.

This failure mode is especially insidious because it's invisible during development if the developer is already authenticated. The proxy check passes for authenticated sessions, so the page appears to work during local testing.

## When to Apply

- Any time a new page or route is added that must be accessible without authentication
- When moving existing pages into or out of authentication-protected areas
- During planning and review of auth-related features (login, signup, password reset, magic links, email verification)
- When onboarding new developers who may assume Next.js route group conventions control access

## Examples

**Before (broken — page exists but proxy blocks it):**
```
src/app/(public)/forgot-password/page.tsx   # file exists
src/proxy.ts:
  const publicPaths = ['/', '/login', '/signup', '/signup-success', '/join'];
```
Result: `GET /forgot-password` → proxy finds no session → 302 redirect to `/login?redirect=/forgot-password`

**After (working — proxy explicitly allows the path):**
```
src/app/(public)/forgot-password/page.tsx   # file exists
src/proxy.ts:
  const publicPaths = ['/', '/login', '/signup', '/signup-success', '/join', '/forgot-password', '/update-password'];
```
Result: `GET /forgot-password` → proxy sees path in `publicPaths` → `NextResponse.next()` → page renders

## Related

- `docs/solutions/integration-issues/nextjs-static-spa-serving-with-rewrites-2026-04-13.md` — documents the same `publicPrefixes` mechanism for static SPA paths, plus the matcher regex exclusion pattern
- `src/proxy.ts` — the auth proxy with `publicPaths` and `publicPrefixes`
- `docs/plans/2026-04-13-002-feat-magic-link-password-reset-plan.md` — the plan where this was caught during review
