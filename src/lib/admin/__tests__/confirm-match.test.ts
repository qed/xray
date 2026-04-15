import { describe, it, expect } from 'vitest';
import { emailMatches } from '../confirm-match';

describe('emailMatches', () => {
  it('matches exact email', () => {
    expect(emailMatches('a@b.com', 'a@b.com')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(emailMatches('A@B.com', 'a@b.com')).toBe(true);
    expect(emailMatches('a@b.com', 'A@B.COM')).toBe(true);
  });

  it('trims whitespace on both sides', () => {
    expect(emailMatches('  a@b.com  ', 'a@b.com')).toBe(true);
    expect(emailMatches('a@b.com', '  a@b.com\n')).toBe(true);
  });

  it('returns false on mismatch', () => {
    expect(emailMatches('a@b.com', 'a@c.com')).toBe(false);
  });

  it('returns false on empty typed', () => {
    expect(emailMatches('', 'a@b.com')).toBe(false);
  });

  it('returns false on empty target (never match blank)', () => {
    expect(emailMatches('', '')).toBe(false);
    expect(emailMatches('a@b.com', '')).toBe(false);
  });
});
