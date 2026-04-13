-- ====================
-- Dashboard columns: slug, color_index, reporting_data
-- ====================

-- 1. Add slug to priorities (for clean dashboard URLs)
ALTER TABLE priorities ADD COLUMN slug text;

-- 2. Add color_index to departments (for stable palette assignment)
ALTER TABLE departments ADD COLUMN color_index int;

-- 3. Add reporting_data to priorities (JSON reporting payload)
ALTER TABLE priorities ADD COLUMN reporting_data jsonb DEFAULT NULL;

-- 4. Backfill slugs for existing priorities
-- Generate slug from name: lowercase, replace non-alphanumeric with hyphens, trim
DO $$
DECLARE
  rec RECORD;
  base_slug text;
  candidate text;
  counter int;
BEGIN
  FOR rec IN
    SELECT id, department_id, name FROM priorities ORDER BY department_id, rank
  LOOP
    -- slugify: lowercase, replace non-alphanumeric with hyphens, collapse multiple hyphens, trim
    base_slug := lower(rec.name);
    base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(both '-' from base_slug);
    -- truncate to 80 chars
    base_slug := left(base_slug, 80);

    candidate := base_slug;
    counter := 1;

    -- Handle collisions within the same department
    WHILE EXISTS (
      SELECT 1 FROM priorities
      WHERE department_id = rec.department_id AND slug = candidate AND id != rec.id
    ) LOOP
      counter := counter + 1;
      candidate := base_slug || '-' || counter;
    END LOOP;

    UPDATE priorities SET slug = candidate WHERE id = rec.id;
  END LOOP;
END;
$$;

-- 5. Make slug NOT NULL after backfill
ALTER TABLE priorities ALTER COLUMN slug SET NOT NULL;

-- 6. Add unique constraint (department_id, slug)
ALTER TABLE priorities ADD CONSTRAINT priorities_dept_slug_unique UNIQUE (department_id, slug);

-- 7. Backfill color_index for existing departments (sequential per org)
DO $$
DECLARE
  rec RECORD;
  idx int;
  current_org uuid := NULL;
BEGIN
  FOR rec IN
    SELECT id, org_id FROM departments ORDER BY org_id, name
  LOOP
    IF current_org IS NULL OR current_org != rec.org_id THEN
      current_org := rec.org_id;
      idx := 0;
    ELSE
      idx := idx + 1;
    END IF;

    UPDATE departments SET color_index = idx WHERE id = rec.id;
  END LOOP;
END;
$$;
