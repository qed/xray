-- Lowercase all existing invite codes
UPDATE invites SET code = LOWER(code);
