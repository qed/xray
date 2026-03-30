-- Trim trailing em dash / en dash / hyphen and surrounding spaces from department names
UPDATE departments
SET name = TRIM(BOTH FROM REGEXP_REPLACE(name, '\s*[—–\-]+\s*$', ''))
WHERE name ~ '\s*[—–\-]+\s*$';

-- Also trim leading dashes
UPDATE departments
SET name = TRIM(BOTH FROM REGEXP_REPLACE(name, '^\s*[—–\-]+\s*', ''))
WHERE name ~ '^\s*[—–\-]+\s*';
