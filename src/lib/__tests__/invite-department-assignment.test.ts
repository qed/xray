import { describe, it, expect } from 'vitest';

// Pure logic tests for invite department pre-assignment flow.

interface InviteRow {
  org_id: string;
  department_ids: string[] | null;
  role: 'admin' | 'member';
}

function shouldLinkDepartments(invite: InviteRow): boolean {
  return Array.isArray(invite.department_ids) && invite.department_ids.length > 0;
}

function buildInviteInsert(
  orgId: string,
  email: string,
  role: string,
  departmentIds?: string[]
) {
  return {
    org_id: orgId,
    email,
    role,
    ...(Array.isArray(departmentIds) && departmentIds.length > 0
      ? { department_ids: departmentIds }
      : {}),
  };
}

describe('Invite department pre-assignment', () => {
  it('invite with departments should trigger linking', () => {
    const invite: InviteRow = {
      org_id: 'org-1',
      department_ids: ['dept-a', 'dept-b'],
      role: 'member',
    };
    expect(shouldLinkDepartments(invite)).toBe(true);
  });

  it('invite with no departments should not trigger linking', () => {
    const invite: InviteRow = {
      org_id: 'org-1',
      department_ids: null,
      role: 'member',
    };
    expect(shouldLinkDepartments(invite)).toBe(false);
  });

  it('invite with empty array should not trigger linking', () => {
    const invite: InviteRow = {
      org_id: 'org-1',
      department_ids: [],
      role: 'member',
    };
    expect(shouldLinkDepartments(invite)).toBe(false);
  });

  it('invite insert includes department_ids when provided', () => {
    const insert = buildInviteInsert('org-1', 'test@test.com', 'member', ['dept-a', 'dept-b']);
    expect(insert).toHaveProperty('department_ids', ['dept-a', 'dept-b']);
  });

  it('invite insert omits department_ids when not provided', () => {
    const insert = buildInviteInsert('org-1', 'test@test.com', 'member');
    expect(insert).not.toHaveProperty('department_ids');
  });

  it('invite insert omits department_ids when empty array', () => {
    const insert = buildInviteInsert('org-1', 'test@test.com', 'member', []);
    expect(insert).not.toHaveProperty('department_ids');
  });
});
