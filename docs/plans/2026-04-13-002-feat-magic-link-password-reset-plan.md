---
title: "feat: Add magic link login and password reset"
type: feat
status: completed
date: 2026-04-13
origin: docs/brainstorms/magic-link-password-reset-requirements.md
---

# feat: Add magic link login and password reset

## Overview

Users who forget their password are completely locked out — no recovery, no alternative login method. This adds two capabilities: magic link login (email a one-time login link) and password reset (email a recovery link to set a new password). Both options are always visible on the login page alongside the existing password form.

## Problem Frame

The app currently supports only email+password authentication. A user who forgets their password has no self-service recovery path, creating a hard blocker for returning users and a support burden for a solo founder. (see origin: `docs/brainstorms/magic-link-password-reset-requirements.md`)

## Requirements Trace

- R1. Login page shows email field, password field, two action buttons: "Sign In" (password) and "Email me a login link" (magic link)
- R2. "Forgot password?" link below the password field
- R3. Magic link and password login always available — neither hidden or secondary
- R4. Magic link: enter email → receive email → click link → logged in
- R5. Magic link redirects to user's org (same as current post-login redirect)
- R6. Works for users with or without a password
- R7. "Forgot password?" leads to email entry form
- R8. Supabase sends password reset email with recovery link
- R9. Recovery link leads to "Set new password" form within the app
- R10. After setting new password, user is logged in and redirected to org
- R11. Existing signup flow unchanged

## Scope Boundaries

- No OAuth / social login
- No changes to signup flow
- No "set a password" prompt for magic-link-only users
- No custom rate limiting beyond Supabase defaults
- No invite code + magic link combo support (invite flow remains password-only for now — see deferred questions)

## Context & Research

### Relevant Code and Patterns

- `src/components/AuthForm.tsx` — current login/signup form component, establishes styling patterns (`space-y-4`, `border-slate-300 rounded-lg`, `bg-emerald-600` buttons, error as `text-sm text-red-600`)
- `src/app/auth/callback/route.ts` — PKCE code exchange, org lookup, redirect. Currently only handles `code` param
- `src/app/(public)/login/page.tsx` — server component wrapper, redirects authenticated users, passes invite code
- `src/app/(public)/signup-success/page.tsx` — "check your email" confirmation page pattern to follow
- `src/proxy.ts` — `/auth/` prefix already in `publicPrefixes`, so `/auth/callback` and any `/auth/*` sub-routes are unauthenticated
- `src/lib/supabase/client.ts` — browser client via `createBrowserClient()`
- `src/lib/supabase/server.ts` — server client via `createServerClient()` with async cookie adapter

### Institutional Learnings

- `docs/solutions/integration-issues/nextjs-static-spa-serving-with-rewrites-2026-04-13.md` — public route registration is two-step: `publicPrefixes` in proxy.ts AND matcher regex. The `/auth/` prefix already covers new auth routes.
- `docs/solutions/database-issues/supabase-rls-org-creation-security-definer-2026-04-13.md` — RLS bootstrapping traps with new users. Not directly applicable here but relevant context for post-auth flows.

## Key Technical Decisions

- **PKCE flow (not token_hash)**: `@supabase/ssr` defaults to PKCE. Both `signInWithOtp` and `resetPasswordForEmail` will send links with a `code` param when a redirect URL points to `/auth/callback`. The existing `exchangeCodeForSession` call works — no need for `verifyOtp`. The callback just needs recovery-aware branching after session exchange.
- **Recovery detection strategy**: After exchanging the code for a session, use a two-signal approach: (1) primary — check if the user's `recovery_sent_at` timestamp is recent (within the last few minutes); (2) secondary — check the URL `type` param manually appended via `redirectTo`. This avoids relying solely on Supabase preserving custom query params through the PKCE email link.
- **No auto-creation on magic link**: `signInWithOtp` with `shouldCreateUser: false` prevents silently creating accounts for non-existent emails. Always show "Check your email" to prevent email enumeration.
- **Separate forgot-password and update-password pages**: Two new routes under `(public)` route group. Both must be added to `publicPaths` in `src/proxy.ts` — the `(public)` route group only affects layouts, not middleware access control.
- **Magic link button as non-form-submit**: The "Email me a login link" button uses `type="button"` with its own click handler to bypass HTML password field validation. Password "Sign In" remains the form submit.
- **Redirect URL options differ per API**: `signInWithOtp` uses `options.emailRedirectTo`, while `resetPasswordForEmail` uses `redirectTo` (in the options object). Both should point to `${window.location.origin}/auth/callback`. For recovery, append `?type=recovery` to the redirect URL as a secondary signal.
- **Expired/invalid link handling**: Callback redirects to `/login?error=link_expired` on exchange failure. Login page shows a dismissible message when this param is present.

## Open Questions

### Resolved During Planning

- **Does the existing callback handle magic link tokens?** Yes, with PKCE flow. `@supabase/ssr` defaults to PKCE, so Supabase sends a `code` param that works with `exchangeCodeForSession`. No `verifyOtp` needed.
- **Should `/update-password` be accessible only with recovery session?** Yes — redirect to `/login` if no active session. The page is a dead-end without one anyway.
- **Where do new pages go?** Under `(public)` route group for layout purposes. New paths `/forgot-password` and `/update-password` must also be added to `publicPaths` in `src/proxy.ts` — the `(public)` route group is a Next.js layout convention and does NOT bypass the auth proxy.

### Deferred to Implementation

- **Cross-browser PKCE limitation**: Magic links only work in the same browser that requested them (PKCE stores `code_verifier` in cookies). Acceptable for MVP. If `exchangeCodeForSession` fails, the error redirect handles it.
- **Invite code + magic link combo**: Currently the invite code is processed inline in AuthForm after `signInWithPassword`. Supporting it through the magic link email flow would require encoding it in `emailRedirectTo`. Deferred — invite flow stays password-only for now.
- **Back button behavior after password update**: User could navigate back to `/update-password`. The session guard (redirect if no recovery session) handles this gracefully.

## Implementation Units

- [ ] **Unit 1: Extend auth callback and register public routes**

  **Goal:** Make `/auth/callback` handle recovery flow by redirecting to `/update-password` instead of org dashboard. Register new auth pages in the proxy so unauthenticated users can reach them.

  **Requirements:** R5, R7, R9, R10

  **Dependencies:** None

  **Files:**
  - Modify: `src/app/auth/callback/route.ts`
  - Modify: `src/proxy.ts`
  - Test: `src/app/auth/callback/__tests__/route.test.ts`

  **Approach:**
  - Add `/forgot-password` and `/update-password` to `publicPaths` array in `src/proxy.ts`. These pages must be accessible to unauthenticated users — the `(public)` route group only affects layouts, not proxy access control.
  - After successful `exchangeCodeForSession`, detect recovery flow using two signals: (1) check if `session.user.recovery_sent_at` is recent (within last few minutes), (2) check URL `type` search param for `recovery`. If either indicates recovery, redirect to `/update-password`.
  - Otherwise, preserve existing org-lookup-and-redirect logic
  - On exchange failure, redirect to `/login?error=link_expired` instead of bare `/login`

  **Patterns to follow:**
  - Existing callback structure in `src/app/auth/callback/route.ts`
  - Cookie handling pattern with `createServerClient`

  **Test scenarios:**
  - Happy path: `code` param, session has no recent `recovery_sent_at` → exchanges session, redirects to org priorities page
  - Happy path: `code` param with `type=recovery` and recent `recovery_sent_at` → exchanges session, redirects to `/update-password`
  - Happy path: `code` param from magic link (no `type`, no `recovery_sent_at`) → exchanges session, redirects to org
  - Edge case: valid code but user has no org memberships → redirects to `/orgs`
  - Error path: invalid/expired code → redirects to `/login?error=link_expired`
  - Error path: no `code` param at all → redirects to `/login?error=link_expired`
  - Integration: `/forgot-password` and `/update-password` are accessible without authentication (proxy allows them)

  **Verification:**
  - Recovery code exchange lands on `/update-password`
  - Magic link code exchange lands on org dashboard
  - Expired code lands on `/login?error=link_expired`
  - Unauthenticated request to `/forgot-password` is not redirected to login by proxy

- [ ] **Unit 2: Create forgot-password page**

  **Goal:** A simple form where users enter their email to request a password reset link.

  **Requirements:** R7, R8

  **Dependencies:** Unit 1 (callback must handle recovery type)

  **Files:**
  - Create: `src/app/(public)/forgot-password/page.tsx`

  **Approach:**
  - Server component wrapper with same page shell as login (slate-50 bg, white card, centered)
  - Client form component (can be inline or extracted) with email input
  - On submit: call `supabase.auth.resetPasswordForEmail(email, { redirectTo: '${origin}/auth/callback?type=recovery' })`
  - Always show "Check your email" success state regardless of whether the email exists (prevents enumeration)
  - Include "Back to login" link
  - Match existing form styling patterns from AuthForm

  **Patterns to follow:**
  - `src/app/(public)/signup-success/page.tsx` — "check your email" confirmation pattern
  - `src/components/AuthForm.tsx` — form styling, error/loading state patterns

  **Test scenarios:**
  - Happy path: enter valid email, submit → shows "Check your email" confirmation
  - Happy path: enter non-existent email, submit → shows same "Check your email" (no enumeration)
  - Edge case: empty email → HTML required validation prevents submit
  - Error path: Supabase API error → shows error message
  - Integration: submit triggers `resetPasswordForEmail` with correct `redirectTo` containing `type=recovery`

  **Verification:**
  - `/forgot-password` renders the email form
  - Submitting shows confirmation message
  - No password field present on this page

- [ ] **Unit 3: Create update-password page**

  **Goal:** A form where users set a new password after clicking a recovery link. Only accessible with an active session.

  **Requirements:** R9, R10

  **Dependencies:** Unit 1 (callback redirects recovery flow here)

  **Files:**
  - Create: `src/app/(public)/update-password/page.tsx`

  **Approach:**
  - Client component with password + confirm password fields
  - On mount: check for active session via `supabase.auth.getUser()`. If no session, redirect to `/login`
  - On submit: call `supabase.auth.updateUser({ password })` with the new password
  - On success: look up user's first org membership and redirect (same pattern as AuthForm post-login)
  - On failure: show error message
  - Match existing form styling

  **Patterns to follow:**
  - `src/components/AuthForm.tsx` — post-login org lookup and redirect logic (lines 54-67)
  - Page shell pattern from login page

  **Test scenarios:**
  - Happy path: user arrives with recovery session → sees password form → enters new password → redirected to org
  - Edge case: user arrives with no session → redirected to `/login`
  - Edge case: passwords don't match → client-side validation error before submit
  - Edge case: password too short (< 6 chars) → validation error
  - Error path: `updateUser` fails (e.g., same as old password on some configs) → shows error message
  - Integration: after successful password update, user is authenticated and redirected to correct org

  **Verification:**
  - Arriving at `/update-password` without a session redirects to `/login`
  - Arriving with a recovery session shows the password form
  - Setting a new password logs the user in and redirects to their org

- [ ] **Unit 4: Restructure login page with magic link and forgot-password**

  **Goal:** Update the login form to show both password login and magic link options, plus a forgot-password link. This is the main UX change.

  **Requirements:** R1, R2, R3, R4, R5, R6

  **Dependencies:** Units 1-3 (callback and destination pages must exist)

  **Files:**
  - Modify: `src/components/AuthForm.tsx`
  - Modify: `src/app/(public)/login/page.tsx`

  **Approach:**
  - AuthForm login mode layout: email field → password field → "Forgot password?" link (right-aligned, small text) → two buttons stacked or side-by-side: "Sign In" (form submit, requires password) and "Email me a login link" (`type="button"`, only requires email)
  - Magic link handler: validate email is non-empty, call `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: '${origin}/auth/callback', shouldCreateUser: false } })`
  - After magic link request: show "Check your email" success state (replace form or show inline message)
  - "Forgot password?" links to `/forgot-password`
  - Login page: detect `error` search param and show dismissible message for expired/invalid links
  - Preserve existing signup mode behavior unchanged (R11)
  - Preserve invite code handling for password login (invite + magic link deferred)

  **Patterns to follow:**
  - Current AuthForm styling and state management
  - Emerald-600 for primary action, outline/secondary style for magic link button to create visual hierarchy

  **Test scenarios:**
  - Happy path: enter email only, click "Email me a login link" → calls `signInWithOtp`, shows confirmation
  - Happy path: enter email + password, click "Sign In" → existing password login works unchanged
  - Happy path: "Forgot password?" link navigates to `/forgot-password`
  - Edge case: click magic link button with empty email → validation error (email required)
  - Edge case: `signInWithOtp` with `shouldCreateUser: false` on non-existent email → still shows "check your email" (Supabase returns success)
  - Error path: `signInWithOtp` API error → shows error message
  - Edge case: login page with `?error=link_expired` → shows "Your login link has expired" message
  - Integration: magic link button does NOT trigger password field validation (type="button")
  - Edge case: signup mode unchanged — no magic link or forgot-password shown in signup mode

  **Verification:**
  - Login page shows email, password, forgot-password link, two buttons
  - Magic link works without entering a password
  - Password login still works as before
  - Signup form unchanged
  - Expired link error message displays when redirected from callback

## System-Wide Impact

- **Interaction graph:** Auth callback is the single entry point for all email-based auth flows (magic link, recovery, existing email confirmation). Changes here affect any future auth method that uses PKCE code exchange.
- **Error propagation:** Failed code exchange → redirect to `/login?error=link_expired`. Failed `updateUser` → inline error on update-password page. Failed `signInWithOtp` → inline error on login form.
- **State lifecycle risks:** Recovery session is temporary — if user navigates away from `/update-password` before submitting, the session may expire. This is acceptable; they can request another reset link.
- **API surface parity:** No other interfaces (API routes, mobile) need the same change currently.
- **Unchanged invariants:** Signup flow (R11), existing password login, invite code handling for password-based login, proxy middleware configuration (no changes needed — `/auth/` prefix already public, new pages under `(public)` route group).

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Supabase email deliverability issues | Signup confirmation already works, confirming email infra is functional |
| PKCE cross-browser limitation (link only works in requesting browser) | Acceptable for MVP; error redirect handles gracefully |
| `shouldCreateUser: false` behavior may vary by Supabase version | Verify during implementation; fallback is showing "check your email" regardless |
| Recovery session expiration if user is slow | Standard Supabase timeout (1 hour); user can request new link |

## Sources & References

- **Origin document:** [docs/brainstorms/magic-link-password-reset-requirements.md](docs/brainstorms/magic-link-password-reset-requirements.md)
- Related code: `src/app/auth/callback/route.ts`, `src/components/AuthForm.tsx`, `src/app/(public)/login/page.tsx`
- Institutional learnings: `docs/solutions/integration-issues/nextjs-static-spa-serving-with-rewrites-2026-04-13.md` (public route patterns)
