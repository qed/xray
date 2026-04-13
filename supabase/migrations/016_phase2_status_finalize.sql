-- Migration 016: Phase 2 — Finalize status column, add CHECK constraint
--
-- This completes the milestone-to-status migration:
-- 1. Add CHECK constraint on priorities.status
-- 2. Drop bridge trigger (no longer needed — status is authoritative)
-- 3. Keep milestones table for now (Phase 3 will drop it after full verification)

-- ============================================================
-- 1. CHECK constraint on priorities.status
-- ============================================================
ALTER TABLE priorities
  ADD CONSTRAINT priorities_status_check
  CHECK (status IN ('proposed', 'approved', 'rejected', 'not_started', 'in_progress', 'complete'));

-- ============================================================
-- 2. Drop bridge trigger (status is now the source of truth)
-- ============================================================
DROP TRIGGER IF EXISTS bridge_milestone_to_status ON milestones;
DROP FUNCTION IF EXISTS bridge_milestone_to_status();

-- ============================================================
-- 3. Default new priorities to 'proposed'
-- ============================================================
ALTER TABLE priorities
  ALTER COLUMN status SET DEFAULT 'proposed';

-- ============================================================
-- 4. Verification queries (run manually after migration)
-- ============================================================
-- SELECT status, count(*) FROM priorities GROUP BY status;
-- SELECT count(*) FROM priorities WHERE status NOT IN ('proposed','approved','rejected','not_started','in_progress','complete');
-- Should return 0 for the second query.
