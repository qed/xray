# Step 5: App Layout and Navigation

## Context
The X-Ray dashboard needs a dark theme layout with branding and navigation before building the page views (Steps 6-9).

## Scope
- Update `src/app/layout.tsx` with dark theme, X-Ray branding, and navigation
- Update `src/app/globals.css` for dark theme base styles and accent colors

## Layout Structure
- Full dark background: `bg-slate-950`
- Nav bar at top: X-Ray wordmark (text), tagline "See everything. Automate what matters."
- Nav links: Overview (/), Tracker (/tracker)
- Electric blue/teal accent: `text-cyan-400` for links, `border-cyan-500` for active states
- Metadata: title "X-Ray", description updated

## globals.css
- Remove light mode / media query
- Set dark colors: background `#0a0f1a`, foreground `#f8fafc`
- Add cyan accent variable

## Commit Message
"Add dark theme layout with X-Ray branding and navigation"
