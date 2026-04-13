import { describe, it, expect } from 'vitest';

// Pure logic tests for the RLS access model decisions.
// These validate the access rules without hitting Supabase.

type Role = 'owner' | 'admin' | 'member';

interface AccessCheck {
  userRole: Role;
  linkedDepartments: string[];
  targetDepartment: string;
}

// SELECT access: owners/admins see all org departments, members see only linked
function canSelectDepartment(check: AccessCheck): boolean {
  if (check.userRole === 'owner' || check.userRole === 'admin') return true;
  return check.linkedDepartments.includes(check.targetDepartment);
}

// UPDATE access on priorities: owners see all, members/admins only linked
function canUpdatePriority(check: AccessCheck): boolean {
  if (check.userRole === 'owner') return true;
  return check.linkedDepartments.includes(check.targetDepartment);
}

// DELETE on priorities: owner only
function canDeletePriority(role: Role): boolean {
  return role === 'owner';
}

// Self-unlink: member can delete own member_departments row
function canSelfUnlink(userId: string, rowUserId: string): boolean {
  return userId === rowUserId;
}

// Note delete: can delete own notes
function canDeleteNote(userId: string, noteUserId: string, role: Role): boolean {
  if (role === 'owner') return true;
  return userId === noteUserId;
}

// RPC validation: assign_member_departments
function validateAssignDepartments(
  callerRole: Role | null,
  targetIsOrgMember: boolean,
  allDeptsInOrg: boolean,
  deptCount: number
): { valid: boolean; error?: string } {
  if (!callerRole || !['owner', 'admin'].includes(callerRole)) {
    return { valid: false, error: 'Only owners and admins can assign departments' };
  }
  if (!targetIsOrgMember) {
    return { valid: false, error: 'Target user is not a member of this organization' };
  }
  if (deptCount > 50) {
    return { valid: false, error: 'Cannot assign more than 50 departments at once' };
  }
  if (!allDeptsInOrg) {
    return { valid: false, error: 'One or more department IDs do not belong to this organization' };
  }
  return { valid: true };
}

// RPC validation: self_select_departments
function validateSelfSelect(
  isOrgMember: boolean,
  allDeptsInOrg: boolean,
  deptCount: number
): { valid: boolean; error?: string } {
  if (!isOrgMember) {
    return { valid: false, error: 'Not a member of this organization' };
  }
  if (deptCount > 50) {
    return { valid: false, error: 'Cannot select more than 50 departments at once' };
  }
  if (!allDeptsInOrg) {
    return { valid: false, error: 'One or more department IDs do not belong to this organization' };
  }
  return { valid: true };
}

describe('Department SELECT access', () => {
  it('owner can read all departments', () => {
    expect(canSelectDepartment({
      userRole: 'owner', linkedDepartments: [], targetDepartment: 'dept-a'
    })).toBe(true);
  });

  it('admin can read all departments', () => {
    expect(canSelectDepartment({
      userRole: 'admin', linkedDepartments: [], targetDepartment: 'dept-a'
    })).toBe(true);
  });

  it('member linked to dept-a can read dept-a', () => {
    expect(canSelectDepartment({
      userRole: 'member', linkedDepartments: ['dept-a'], targetDepartment: 'dept-a'
    })).toBe(true);
  });

  it('member linked to dept-a cannot read dept-b', () => {
    expect(canSelectDepartment({
      userRole: 'member', linkedDepartments: ['dept-a'], targetDepartment: 'dept-b'
    })).toBe(false);
  });

  it('member with zero links sees no departments', () => {
    expect(canSelectDepartment({
      userRole: 'member', linkedDepartments: [], targetDepartment: 'dept-a'
    })).toBe(false);
  });
});

describe('Priority UPDATE access', () => {
  it('owner can edit any priority', () => {
    expect(canUpdatePriority({
      userRole: 'owner', linkedDepartments: [], targetDepartment: 'dept-a'
    })).toBe(true);
  });

  it('member linked to dept-a can edit dept-a priorities', () => {
    expect(canUpdatePriority({
      userRole: 'member', linkedDepartments: ['dept-a'], targetDepartment: 'dept-a'
    })).toBe(true);
  });

  it('member linked to dept-a cannot edit dept-b priorities', () => {
    expect(canUpdatePriority({
      userRole: 'member', linkedDepartments: ['dept-a'], targetDepartment: 'dept-b'
    })).toBe(false);
  });

  it('admin can edit only linked department priorities', () => {
    expect(canUpdatePriority({
      userRole: 'admin', linkedDepartments: ['dept-a'], targetDepartment: 'dept-a'
    })).toBe(true);
    expect(canUpdatePriority({
      userRole: 'admin', linkedDepartments: ['dept-a'], targetDepartment: 'dept-b'
    })).toBe(false);
  });
});

describe('Priority DELETE access', () => {
  it('only owner can delete priorities', () => {
    expect(canDeletePriority('owner')).toBe(true);
    expect(canDeletePriority('admin')).toBe(false);
    expect(canDeletePriority('member')).toBe(false);
  });
});

describe('Self-unlink from department', () => {
  it('member can unlink themselves', () => {
    expect(canSelfUnlink('user-1', 'user-1')).toBe(true);
  });

  it('member cannot unlink others', () => {
    expect(canSelfUnlink('user-1', 'user-2')).toBe(false);
  });
});

describe('Priority note deletion', () => {
  it('member can delete own note', () => {
    expect(canDeleteNote('user-1', 'user-1', 'member')).toBe(true);
  });

  it('member cannot delete others notes', () => {
    expect(canDeleteNote('user-1', 'user-2', 'member')).toBe(false);
  });

  it('owner can delete any note', () => {
    expect(canDeleteNote('user-1', 'user-2', 'owner')).toBe(true);
  });
});

describe('assign_member_departments RPC validation', () => {
  it('owner can assign departments to a member', () => {
    expect(validateAssignDepartments('owner', true, true, 3).valid).toBe(true);
  });

  it('admin can assign departments to a member', () => {
    expect(validateAssignDepartments('admin', true, true, 3).valid).toBe(true);
  });

  it('member cannot assign departments', () => {
    const result = validateAssignDepartments('member', true, true, 3);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Only owners and admins');
  });

  it('null role cannot assign departments', () => {
    const result = validateAssignDepartments(null, true, true, 3);
    expect(result.valid).toBe(false);
  });

  it('rejects if target user is not an org member', () => {
    const result = validateAssignDepartments('owner', false, true, 3);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('not a member');
  });

  it('rejects if any department is from a different org', () => {
    const result = validateAssignDepartments('owner', true, false, 3);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('do not belong');
  });

  it('rejects if more than 50 departments', () => {
    const result = validateAssignDepartments('owner', true, true, 51);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('50');
  });
});

describe('self_select_departments RPC validation', () => {
  it('org member can self-select departments', () => {
    expect(validateSelfSelect(true, true, 3).valid).toBe(true);
  });

  it('non-org-member cannot self-select', () => {
    const result = validateSelfSelect(false, true, 3);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Not a member');
  });

  it('rejects cross-org department IDs', () => {
    const result = validateSelfSelect(true, false, 3);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('do not belong');
  });

  it('rejects more than 50 departments', () => {
    const result = validateSelfSelect(true, true, 51);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('50');
  });
});
