import { describe, it, expect } from 'vitest';
import { filterUsers, type FilterableUser } from '../filter-users';

const u = (
  id: string,
  email: string,
  memberships: { org_slug: string }[] = [],
  display_name: string | null = null,
): FilterableUser => ({ id, email, display_name, memberships });

describe('filterUsers', () => {
  const rows: FilterableUser[] = [
    u('aaa-1111', 'founder@wevend.com', [{ org_slug: 'wevend' }]),
    u('bbb-2222', 'ops@tph.com', [{ org_slug: 'tph' }, { org_slug: 'wevend' }]),
    u('ccc-3333', 'nobody@example.com', []),
    u('ddd-4444', 'casey@tph.com', [{ org_slug: 'tph' }], 'Casey Rivera'),
  ];

  it('returns all rows with empty filter', () => {
    expect(filterUsers(rows, {})).toHaveLength(4);
  });

  it('filters by email substring case-insensitive', () => {
    const out = filterUsers(rows, { q: 'TPH' });
    expect(out.map((r) => r.id)).toEqual(['bbb-2222', 'ddd-4444']);
  });

  it('filters by id prefix', () => {
    const out = filterUsers(rows, { q: 'aaa' });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('aaa-1111');
  });

  it('filters by display name substring', () => {
    const out = filterUsers(rows, { q: 'casey' });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('ddd-4444');
  });

  it('filters by org slug', () => {
    const out = filterUsers(rows, { org: 'wevend' });
    expect(out.map((r) => r.id).sort()).toEqual(['aaa-1111', 'bbb-2222']);
  });

  it('stranded=true returns only users with no memberships', () => {
    const out = filterUsers(rows, { stranded: true });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('ccc-3333');
  });

  it('combines q + org filters (AND)', () => {
    const out = filterUsers(rows, { q: 'casey', org: 'tph' });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('ddd-4444');
  });

  it('combines stranded + q filters (AND) — stranded user with matching email', () => {
    const out = filterUsers(rows, { q: 'nobody', stranded: true });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('ccc-3333');
  });

  it('returns empty when stranded=true and org set (mutually exclusive in practice)', () => {
    const out = filterUsers(rows, { stranded: true, org: 'wevend' });
    expect(out).toHaveLength(0);
  });

  it('handles user with null display_name without crashing', () => {
    const out = filterUsers(rows, { q: 'founder' });
    expect(out).toHaveLength(1);
  });

  it('whitespace-only q is treated as empty', () => {
    const out = filterUsers(rows, { q: '   ' });
    expect(out).toHaveLength(4);
  });
});
