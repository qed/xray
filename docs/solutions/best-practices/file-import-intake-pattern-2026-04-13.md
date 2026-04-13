---
title: Adding new intake modes — server-side first message and extension checklist
date: 2026-04-13
category: best-practices
module: intake
problem_type: best_practice
component: assistant
severity: medium
applies_when:
  - Adding a new intake mode to X-Ray
  - Building a ChatInterface wrapper that needs to pre-load context the component cannot accept as props
  - Extending the intake sidebar with new feature options
  - Target entity (department) is not known until the LLM processes user input
tags:
  - intake
  - chat-interface
  - server-side-streaming
  - file-import
  - wrapper-component
  - localStorage
  - extension-pattern
---

# Adding new intake modes — server-side first message and extension checklist

## Context

X-Ray's intake system supports multiple modes for collecting department data (interview, gap-fill, new-priorities, file-import). When building the file-import mode, ChatInterface had no prop for pre-loaded file attachments — `autoSendMessage` fires `sendMessage()` on mount which reads from empty `pendingAttachments`. A new pattern was needed to bootstrap a conversation server-side before handing control to ChatInterface.

Additionally, each new intake mode touches 8 specific locations in the codebase, and missing any one causes silent failures or UI inconsistencies. This document captures both patterns. (auto memory [claude]: the feature was motivated by X-Ray scaling from 4 to 11 departments, requiring faster bulk onboarding.)

## Guidance

### Pattern 1: Server-Side First Message

When a wrapper component needs to seed a conversation with context that ChatInterface cannot accept as props (file attachments, pre-parsed data, external API results), drive the first turn server-side and then mount ChatInterface in resume mode:

```typescript
// In the wrapper component (e.g., FileImportIntake.tsx)
async function handleImport() {
  // 1. Upload files to get attachment references
  const attachments = [];
  for (const file of stagedFiles) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload-attachment', { method: 'POST', body: formData });
    attachments.push(await res.json());
  }

  // 2. POST directly to /api/chat with attachments in the body
  const chatRes = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      mode: 'file-import',
      context: { summary: ctxSummary },
      orgId,
      attachments,
    }),
  });

  // 3. Read the full SSE stream to extract conversationId + first assistant reply
  const reader = chatRes.body?.getReader();
  let assistantContent = '';
  let newConvoId = '';
  // ... consume SSE events, accumulate text deltas ...

  // 4. Mount ChatInterface in resume mode
  setConversationId(newConvoId);
  setExistingMessages([
    { role: 'user', content: userMessage },
    { role: 'assistant', content: assistantContent },
  ]);
  // ChatInterface mounts with existingConversationId + existingMessages
}
```

### Pattern 2: Intake Mode Extension Checklist

Adding a new intake mode requires changes in exactly these 8 locations:

| # | File | Change |
|---|------|--------|
| 1 | `supabase/migrations/NNN_*.sql` | Add mode value to `conversations` CHECK constraint |
| 2 | `src/lib/prompts.ts` | New system prompt constant + context builder function |
| 3 | `src/app/api/chat/route.ts` | `else if (mode === 'new-mode')` branch for system prompt selection |
| 4 | `src/components/ChatInterface.tsx` | Extend the `mode` prop type union |
| 5 | `src/app/org/[orgSlug]/intake/NewMode.tsx` | Wrapper component following XRayInterview pattern |
| 6 | `src/app/org/[orgSlug]/intake/IntakeSidebar.tsx` | Add to `IntakeFeature` type + `FEATURES` array |
| 7 | `src/app/org/[orgSlug]/intake/IntakePageClient.tsx` | `FEATURE_LABELS` + localStorage guard + render branch |
| 8 | localStorage restoration guard | Include new feature value in the `if (stored === ...)` check |

### Pattern 3: Deferred Department Linking

When the intake mode does not know the target department upfront (the LLM determines it from uploaded files), the `/api/intake/complete` endpoint accepts an optional `departmentId` parameter. It UPDATEs the conversation's `department_id` before calling `apply_extraction`, which reads `department_id` from the conversation for append mode.

```typescript
// In /api/intake/complete/route.ts
if (mode === 'append' && departmentId && conversationId) {
  await admin
    .from('conversations')
    .update({ department_id: departmentId })
    .eq('id', conversationId);
}
const result = await applyExtraction(orgId, extractedData, conversationId, mode);
```

## Why This Matters

**Server-side first message**: ChatInterface is designed for interactive conversations, not bootstrapped ones. Trying to hack around its mount cycle (autoSendMessage + pendingAttachments) produces timing bugs. The server-side pattern is deterministic — the conversation exists with full context before the UI mounts.

**Extension checklist**: With 8 touch points spread across database, API, library, and UI layers, it is easy to add a mode that partially works. The CHECK constraint silently rejects inserts if you forget the migration. The sidebar shows nothing if you miss the FEATURES array. localStorage restoration loops if you forget the new value. Each failure mode is subtle and appears in a different part of the app.

**Deferred linking**: Forcing users to choose a department before uploading files defeats the purpose of AI-driven classification. The deferred pattern keeps the UX clean while maintaining `apply_extraction`'s data integrity requirements.

## When to Apply

- Any time you add a new intake mode to X-Ray (the 8-point checklist is mandatory)
- When building any ChatInterface wrapper that needs to pre-load context the component cannot accept as props (file attachments, pre-computed data, external API results)
- When the target entity (department, project, etc.) is not known until the LLM processes user input
- When extending a feature system that uses localStorage for state persistence across reloads

## Examples

**Before (broken — autoSendMessage with file attachments):**
```typescript
// autoSendMessage fires on mount, reads pendingAttachments = [],
// sends a bare text message with no files attached.
<ChatInterface
  autoSendMessage="Analyze these files"
  mode="file-import"
/>
// LLM responds: "I don't see any files uploaded."
```

**After (working — server-side first message, then resume):**
```typescript
const { conversationId, messages } = await serverSideFirstMessage(files);
<ChatInterface
  existingConversationId={conversationId}
  existingMessages={messages}
  mode="file-import"
/>
// ChatInterface mounts with the full first exchange already visible.
// LLM's first response references the actual file contents.
```

**Before (incomplete intake mode — missing localStorage guard):**
```typescript
// Added all 7 other locations, but forgot to update the restoration check:
if (stored === 'xray' || stored === 'missing' || stored === 'new-priorities') {
  setActiveFeature(stored);
}
// User selects file-import, reloads page — mode resets to null. Silent failure.
```

**After (complete — all 8 locations updated):**
```typescript
if (stored === 'xray' || stored === 'missing' || stored === 'new-priorities' || stored === 'file-import') {
  setActiveFeature(stored);
}
// Mode persists across reloads.
```

## Related

- `docs/solutions/ui-bugs/intake-feature-selection-lost-on-reload-2026-04-13.md` — localStorage persistence for IntakeFeature (must be updated when adding new modes)
- `src/app/org/[orgSlug]/intake/FileImportIntake.tsx` — reference implementation of server-side first message pattern
- `src/app/org/[orgSlug]/intake/XRayInterview.tsx` — original intake mode wrapper (the template for new modes)
- `docs/plans/2026-04-13-004-feat-file-import-intake-plan.md` — implementation plan with architectural decisions
