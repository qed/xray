-- Remove the impact column from priorities.
-- Impact is now derived from estimated time savings rather than self-reported by departments.
UPDATE priorities SET impact = '' WHERE impact IS NOT NULL AND impact != '';
