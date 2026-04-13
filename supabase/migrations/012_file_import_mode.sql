-- Migration 012: Add 'file-import' to conversations mode CHECK
-- Enables file-import intake mode conversations.

ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_mode_check;
ALTER TABLE conversations ADD CONSTRAINT conversations_mode_check
  CHECK (mode IN ('intake', 'gap-fill', 'new-priorities', 'file-import'));
