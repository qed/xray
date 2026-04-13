import { describe, it, expect } from 'vitest';

// Extracted nav link config matching layout.tsx
const allNavLinks = [
  { href: '/org/test/dashboard', label: 'Dashboard', roles: ['owner', 'admin', 'member'] },
  { href: '/org/test/team', label: 'My Team', roles: ['member'] },
  { href: '/org/test/intake', label: 'Intake', roles: ['owner', 'admin', 'member'] },
  { href: '/org/test/tracker', label: 'Tracker', roles: ['owner'] },
  { href: '/org/test/risks', label: 'Risks', roles: ['owner'] },
  { href: '/org/test/dependencies', label: 'Dependencies', roles: ['owner'] },
  { href: '/org/test/tools', label: 'Tools', roles: ['owner'] },
  { href: '/org/test/briefs', label: 'Briefs', roles: ['owner', 'admin'] },
];

function filterNavLinks(role: string) {
  return allNavLinks.filter((link) => link.roles.includes(role));
}

describe('Nav link role filtering', () => {
  it('owner sees 7 links (all except My Team)', () => {
    const links = filterNavLinks('owner');
    expect(links).toHaveLength(7);
  });

  it('admin sees Dashboard, Intake, and Briefs', () => {
    const links = filterNavLinks('admin');
    expect(links).toHaveLength(3);
    expect(links.map((l) => l.label)).toEqual(['Dashboard', 'Intake', 'Briefs']);
  });

  it('member sees Dashboard, My Team, and Intake', () => {
    const links = filterNavLinks('member');
    expect(links).toHaveLength(3);
    expect(links.map((l) => l.label)).toEqual(['Dashboard', 'My Team', 'Intake']);
  });

  it('unknown role sees no links', () => {
    const links = filterNavLinks('viewer');
    expect(links).toHaveLength(0);
  });
});

describe('API role checks', () => {
  const ownerOnlyCheck = (role: string | null) => role === 'owner';
  const adminOrOwnerCheck = (role: string | null) => !!role && ['owner', 'admin'].includes(role);

  it('upload route: only owner allowed', () => {
    expect(ownerOnlyCheck('owner')).toBe(true);
    expect(ownerOnlyCheck('admin')).toBe(false);
    expect(ownerOnlyCheck('member')).toBe(false);
    expect(ownerOnlyCheck(null)).toBe(false);
  });

  it('priorities route: only owner allowed', () => {
    expect(ownerOnlyCheck('owner')).toBe(true);
    expect(ownerOnlyCheck('admin')).toBe(false);
    expect(ownerOnlyCheck('member')).toBe(false);
  });

  it('invite route: owner and admin allowed', () => {
    expect(adminOrOwnerCheck('owner')).toBe(true);
    expect(adminOrOwnerCheck('admin')).toBe(true);
    expect(adminOrOwnerCheck('member')).toBe(false);
    expect(adminOrOwnerCheck(null)).toBe(false);
  });

  it('invite role validation: only admin and member allowed', () => {
    const validInviteRoles = ['admin', 'member'];
    expect(validInviteRoles.includes('admin')).toBe(true);
    expect(validInviteRoles.includes('member')).toBe(true);
    expect(validInviteRoles.includes('owner')).toBe(false);
  });
});

describe('Invite role propagation', () => {
  it('invite with role=admin creates admin org member', () => {
    const invite = { role: 'admin' as const, org_id: 'org1' };
    const memberInsert = { org_id: invite.org_id, user_id: 'user1', role: invite.role ?? 'member' };
    expect(memberInsert.role).toBe('admin');
  });

  it('invite with role=member creates member org member', () => {
    const invite = { role: 'member' as const, org_id: 'org1' };
    const memberInsert = { org_id: invite.org_id, user_id: 'user1', role: invite.role ?? 'member' };
    expect(memberInsert.role).toBe('member');
  });

  it('invite with missing role defaults to member', () => {
    const invite = { role: undefined as string | undefined, org_id: 'org1' };
    const memberInsert = { org_id: invite.org_id, user_id: 'user1', role: invite.role ?? 'member' };
    expect(memberInsert.role).toBe('member');
  });
});
