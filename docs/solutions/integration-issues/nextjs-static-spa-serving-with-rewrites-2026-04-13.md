---
title: Serving static SPAs from Next.js public/ with clean URLs
date: 2026-04-13
category: integration-issues
module: csuite-dashboard
problem_type: integration_issue
component: routing
severity: medium
symptoms:
  - "Static HTML in public/ redirected to login by auth middleware"
  - "Rewrite from /wevend to /wevend/index.html breaks relative asset paths"
  - "Redirect approach causes infinite loop with trailingSlash: false"
root_cause: missing_config
resolution_type: code_fix
tags:
  - nextjs
  - static-files
  - rewrites
  - base-href
  - middleware
  - public-directory
---

# Serving static SPAs from Next.js public/ with clean URLs

## Problem

Self-contained static SPAs (HTML + CSS + JS with relative paths) placed in Next.js's `public/` directory had three issues: auth middleware intercepted the routes, clean URL rewrites broke relative asset resolution, and redirect-based approaches caused infinite loops.

## Symptoms

- Visiting `/wevend/` returned 308 redirect to `/login?redirect=/wevend/index.html`
- Using `rewrites` in next.config.ts to map `/wevend` to `/wevend/index.html` served the HTML but broke `style.css`, `data.js`, and `chart.umd.min.js` (browser resolved them against `/` instead of `/wevend/`)
- Using `redirects` to add a trailing slash caused a redirect loop (`/wevend` -> `/wevend/` -> `/wevend` -> ...)

## What Didn't Work

- **Redirects with trailing slash**: Next.js's default `trailingSlash: false` strips trailing slashes, creating `/wevend` -> `/wevend/` -> `/wevend` infinite loop
- **Setting `trailingSlash: true` globally**: Would affect all app routes, not just static demos

## Solution

Three-part fix:

### 1. Bypass auth middleware for static demo paths

In `src/proxy.ts`:
```typescript
const publicPrefixes = ['/invite/', '/auth/', '/wevend', '/csuite'];

function isPublicPath(pathname: string): boolean {
  if (publicPaths.includes(pathname)) return true;
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) return true;
  return false;
}
```

Also added `.html` to the middleware matcher exclusion pattern:
```typescript
matcher: [
  '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.css|.*\\.js|.*\\.html).*)',
]
```

### 2. URL rewrite for clean paths

In `next.config.ts`:
```typescript
async rewrites() {
  return [
    { source: '/wevend', destination: '/wevend/index.html' },
    { source: '/csuite', destination: '/csuite/index.html' },
  ];
},
```

### 3. Base href for relative asset resolution

Added `<base>` tag to each static SPA's HTML `<head>`:
```html
<base href="/wevend/">
```

This tells the browser to resolve all relative URLs against `/wevend/` regardless of whether the address bar shows `/wevend` or `/wevend/index.html`.

## Why This Works

The rewrite makes `/wevend` serve `index.html` without changing the URL. But the browser uses the URL path to resolve relative references — at `/wevend` (no trailing slash), the base is `/`, so `style.css` becomes `/style.css` (404). The `<base href>` tag overrides this behavior, forcing relative paths to resolve against the correct directory.

## Prevention

- When serving static SPAs via Next.js rewrites, always add a `<base href>` tag matching the directory path
- When adding new public static paths, update both the middleware public prefixes AND the rewrite rules
- Avoid redirect-based approaches for trailing slash normalization when `trailingSlash: false` is the default — use rewrites + base href instead

## Related Issues

- `src/proxy.ts` — middleware bypass
- `next.config.ts` — rewrite configuration
- `public/wevend/index.html`, `public/csuite/index.html` — base href tags
