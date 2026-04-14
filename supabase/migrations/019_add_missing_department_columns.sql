-- Migration 019: Add missing department columns referenced by apply_extraction
--
-- The apply_extraction RPC (from migration 013/014) references handoffs_inbound,
-- handoffs_outbound, and scaling_concerns on the departments table, but these
-- columns were never created.

ALTER TABLE departments ADD COLUMN IF NOT EXISTS handoffs_inbound text[] DEFAULT '{}';
ALTER TABLE departments ADD COLUMN IF NOT EXISTS handoffs_outbound text[] DEFAULT '{}';
ALTER TABLE departments ADD COLUMN IF NOT EXISTS scaling_concerns text[] DEFAULT '{}';
