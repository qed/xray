---
date: 2026-04-13
topic: magic-link-password-reset
---

# Magic Link Login & Password Reset

## Problem Frame

Users who forget their password are completely locked out — there's no "Forgot password?" link, no magic link option, and no self-service recovery. This blocks returning users and creates support burden for a solo founder.

## Requirements

**Login Page UX**
- R1. Login page shows email field, password field, two action buttons: "Sign In" (password) and "Email me a login link" (magic link)
- R2. "Forgot password?" link appears below the password field, initiating a password reset flow
- R3. Magic link and password login are always available — neither is hidden or secondary

**Magic Link Flow**
- R4. User enters email and clicks "Email me a login link" — Supabase sends an email with a one-time login link
- R5. Clicking the link logs the user in and redirects to their org (same as current post-login redirect)
- R6. Works for users with or without a password set — no password required

**Password Reset Flow**
- R7. "Forgot password?" leads to a form where user enters their email
- R8. Supabase sends a password reset email with a link to set a new password
- R9. Reset link leads to a "Set new password" form within the app
- R10. After setting a new password, user is logged in and redirected to their org

**Signup**
- R11. Existing signup flow continues to work as-is (email + password + confirmation email)

## Success Criteria

- A user who forgot their password can recover access without any manual intervention
- A user can log in via magic link without ever setting a password
- Existing password-based login continues to work unchanged

## Scope Boundaries

- No OAuth / social login (out of scope)
- No changes to the signup flow
- No "set a password" prompt for magic-link-only users (they can stay passwordless)
- No rate limiting or abuse prevention beyond what Supabase provides by default

## Key Decisions

- **Both options always visible**: Single form with two buttons rather than tabs or hidden fallback — reduces friction, no mode-switching needed
- **Supabase native auth methods**: Using `signInWithOtp` for magic link and `resetPasswordForEmail` for password reset — no custom email infrastructure needed

## Dependencies / Assumptions

- Supabase project has email sending configured (signup confirmation emails already work, so this is likely in place)
- Auth callback route (`/auth/callback`) already exists and handles code exchange

## Outstanding Questions

### Deferred to Planning
- [Affects R5, R9][Technical] Does the existing `/auth/callback` route handle magic link and password reset token types, or does it need updates?
- [Affects R9][Technical] Should the reset password page be a new route (e.g., `/reset-password`) or reuse the existing auth form component?

## Next Steps

-> `/ce:plan` for structured implementation planning
