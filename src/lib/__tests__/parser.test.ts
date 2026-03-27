import { describe, it, expect } from 'vitest';
import { getMilestones, getStatuses, getDepartmentSlugs, parsePriorities, parseProfile, getDepartment, getAllDepartments } from '../parser';

describe('getMilestones', () => {
  it('returns 4 milestone configs', () => {
    const milestones = getMilestones();
    expect(milestones).toHaveLength(4);
    expect(milestones[0].name).toBe('Not Started');
    expect(milestones[3].name).toBe('Dept Head Confirmed');
  });
});

describe('getStatuses', () => {
  it('returns 35 status entries', () => {
    const statuses = getStatuses();
    expect(Object.keys(statuses)).toHaveLength(35);
  });

  it('sales-ops priority-1 is at milestone 1', () => {
    const statuses = getStatuses();
    expect(statuses['sales-operations/priority-1'].milestone).toBe(1);
  });
});

describe('getDepartmentSlugs', () => {
  it('discovers all 4 departments', () => {
    const slugs = getDepartmentSlugs();
    expect(slugs).toContain('accounting');
    expect(slugs).toContain('sales-operations');
    expect(slugs).toContain('infrastructure-compliance');
    expect(slugs).toContain('operations');
    expect(slugs.length).toBeGreaterThanOrEqual(4);
  });
});

describe('parsePriorities — Accounting', () => {
  const priorities = parsePriorities('accounting');

  it('parses 9 priorities', () => {
    expect(priorities).toHaveLength(9);
  });

  it('priority 1 has correct name', () => {
    expect(priorities[0].name).toBe('Sales Orders & Invoicing — System-Generated POs');
  });

  it('priority 1 has correct effort/complexity/impact', () => {
    expect(priorities[0].effort).toBe('Low');
    expect(priorities[0].complexity).toBe('Low');
    expect(priorities[0].impact).toBe('High');
  });

  it('priority 5 has High complexity and Very High impact', () => {
    expect(priorities[4].complexity).toBe('High');
    expect(priorities[4].impact).toBe('Very High');
  });

  it('priority 9 has Critical impact', () => {
    expect(priorities[8].impact).toBe('Critical');
  });

  it('has whatToAutomate populated', () => {
    expect(priorities[0].whatToAutomate.length).toBeGreaterThan(10);
  });

  it('has suggestedApproach populated', () => {
    expect(priorities[0].suggestedApproach.length).toBeGreaterThan(10);
  });

  it('has dependencies as array', () => {
    expect(Array.isArray(priorities[0].dependencies)).toBe(true);
    expect(priorities[0].dependencies.length).toBeGreaterThan(0);
  });

  it('sets departmentSlug', () => {
    expect(priorities[0].departmentSlug).toBe('accounting');
  });
});

describe('parsePriorities — Sales Operations', () => {
  const priorities = parsePriorities('sales-operations');

  it('parses 8 priorities', () => {
    expect(priorities).toHaveLength(8);
  });

  it('priority 1 has correct name', () => {
    expect(priorities[0].name).toBe(
      'Eliminate Duplicate Data Entry Across Merchant Onboarding Systems'
    );
  });

  it('priority 1 has status containing "In Progress"', () => {
    expect(priorities[0].status).toMatch(/In Progress/);
  });

  it('priority 2 has status "Not started"', () => {
    expect(priorities[1].status).toMatch(/Not started/i);
  });

  it('has whatToAutomate populated', () => {
    expect(priorities[0].whatToAutomate.length).toBeGreaterThan(10);
  });

  it('defaults suggestedApproach to empty when missing', () => {
    expect(priorities[0].suggestedApproach).toBe('');
  });

  it('sets departmentSlug', () => {
    expect(priorities[0].departmentSlug).toBe('sales-operations');
  });
});

describe('parsePriorities — Infrastructure & Compliance', () => {
  const priorities = parsePriorities('infrastructure-compliance');

  it('parses 7 priorities', () => {
    expect(priorities).toHaveLength(7);
  });

  it('priority 1 has correct name', () => {
    expect(priorities[0].name).toBe('Alert Noise Reduction');
  });

  it('priority 1 has correct complexity and impact from summary table', () => {
    expect(priorities[0].complexity).toBe('Low');
    expect(priorities[0].impact).toBe('High');
  });

  it('has whatToAutomate populated', () => {
    expect(priorities[0].whatToAutomate.length).toBeGreaterThan(10);
  });

  it('has suggestedApproach populated', () => {
    expect(priorities[0].suggestedApproach.length).toBeGreaterThan(10);
  });

  it('sets departmentSlug', () => {
    expect(priorities[0].departmentSlug).toBe('infrastructure-compliance');
  });
});

describe('parsePriorities — Operations', () => {
  const priorities = parsePriorities('operations');

  it('parses 11 priorities', () => {
    expect(priorities).toHaveLength(11);
  });

  it('priority 1 has correct name', () => {
    expect(priorities[0].name).toBe('Daily Operational Digest');
  });

  it('priority 1 has correct complexity and impact from summary table', () => {
    expect(priorities[0].impact).toBe('High');
  });

  it('priority 10 has Critical impact', () => {
    expect(priorities[9].impact).toBe('Critical');
  });

  it('has whatToAutomate populated', () => {
    expect(priorities[0].whatToAutomate.length).toBeGreaterThan(10);
  });

  it('sets departmentSlug', () => {
    expect(priorities[0].departmentSlug).toBe('operations');
  });
});

describe('parseProfile — Accounting', () => {
  const profile = parseProfile('accounting');

  it('has correct slug and name', () => {
    expect(profile.slug).toBe('accounting');
    expect(profile.name).toBe('Accounting');
  });

  it('has mission populated', () => {
    expect(profile.mission.length).toBeGreaterThan(10);
    expect(profile.mission).toMatch(/recording all business transactions/i);
  });

  it('has team members', () => {
    expect(profile.teamMembers.length).toBeGreaterThanOrEqual(2);
    expect(profile.teamMembers[0].name).toMatch(/Nancy/);
  });

  it('has tools', () => {
    expect(profile.tools.length).toBeGreaterThan(0);
    expect(profile.tools.some((t) => t.match(/QuickBooks/i))).toBe(true);
  });

  it('has single points of failure', () => {
    expect(profile.singlePointsOfFailure.length).toBeGreaterThan(0);
  });

  it('has pain points', () => {
    expect(profile.painPoints.length).toBeGreaterThan(0);
  });

  it('has tribal knowledge risks', () => {
    expect(profile.tribalKnowledgeRisks.length).toBeGreaterThan(0);
  });
});

describe('parseProfile — Sales Operations', () => {
  const profile = parseProfile('sales-operations');

  it('has correct slug and name', () => {
    expect(profile.slug).toBe('sales-operations');
    expect(profile.name).toBe('Sales Operations');
  });

  it('has mission populated', () => {
    expect(profile.mission.length).toBeGreaterThan(10);
  });

  it('has team members', () => {
    expect(profile.teamMembers.length).toBeGreaterThanOrEqual(2);
    expect(profile.teamMembers[0].name).toMatch(/Layal/);
  });

  it('has tools', () => {
    expect(profile.tools.length).toBeGreaterThan(0);
    expect(profile.tools.some((t) => t.match(/WeTrack/i))).toBe(true);
  });

  it('has tribal knowledge risks', () => {
    expect(profile.tribalKnowledgeRisks.length).toBeGreaterThan(0);
  });
});

describe('parseProfile — Infrastructure & Compliance', () => {
  const profile = parseProfile('infrastructure-compliance');

  it('has correct slug and name', () => {
    expect(profile.slug).toBe('infrastructure-compliance');
    expect(profile.name).toBe('Infrastructure & Compliance');
  });

  it('has mission populated', () => {
    expect(profile.mission.length).toBeGreaterThan(10);
  });

  it('has team members', () => {
    expect(profile.teamMembers.length).toBeGreaterThanOrEqual(2);
    expect(profile.teamMembers[0].name).toMatch(/Reza/);
  });

  it('has tools', () => {
    expect(profile.tools.length).toBeGreaterThan(0);
  });

  it('has single points of failure', () => {
    expect(profile.singlePointsOfFailure.length).toBeGreaterThan(0);
  });

  it('has pain points', () => {
    expect(profile.painPoints.length).toBeGreaterThan(0);
  });
});

describe('parseProfile — Operations', () => {
  const profile = parseProfile('operations');

  it('has correct slug and name', () => {
    expect(profile.slug).toBe('operations');
    expect(profile.name).toBe('Operations');
  });

  it('has mission populated', () => {
    expect(profile.mission.length).toBeGreaterThan(10);
  });

  it('has team members', () => {
    expect(profile.teamMembers.length).toBeGreaterThanOrEqual(5);
  });

  it('has tools', () => {
    expect(profile.tools.length).toBeGreaterThan(0);
  });

  it('has single points of failure', () => {
    expect(profile.singlePointsOfFailure.length).toBeGreaterThan(0);
  });

  it('has pain points', () => {
    expect(profile.painPoints.length).toBeGreaterThan(0);
  });

  it('has tribal knowledge risks', () => {
    expect(profile.tribalKnowledgeRisks.length).toBeGreaterThan(0);
  });
});

describe('getDepartment', () => {
  it('returns Accounting with profile and 9 priorities', () => {
    const dept = getDepartment('accounting');
    expect(dept.profile.name).toBe('Accounting');
    expect(dept.priorities).toHaveLength(9);
  });

  it('returns Sales Operations with profile and 8 priorities', () => {
    const dept = getDepartment('sales-operations');
    expect(dept.profile.name).toBe('Sales Operations');
    expect(dept.priorities).toHaveLength(8);
  });

  it('Accounting has quickWins', () => {
    const dept = getDepartment('accounting');
    expect(dept.quickWins).toBeDefined();
    expect(dept.quickWins!.length).toBeGreaterThan(0);
  });

  it('Accounting has thirtyDayTargets', () => {
    const dept = getDepartment('accounting');
    expect(dept.thirtyDayTargets).toBeDefined();
    expect(dept.thirtyDayTargets!.length).toBeGreaterThan(0);
  });

  it('Accounting has ninetyDayTargets', () => {
    const dept = getDepartment('accounting');
    expect(dept.ninetyDayTargets).toBeDefined();
    expect(dept.ninetyDayTargets!.length).toBeGreaterThan(0);
  });

  it('Accounting has scalingRisks', () => {
    const dept = getDepartment('accounting');
    expect(dept.scalingRisks).toBeDefined();
    expect(dept.scalingRisks!.length).toBeGreaterThan(0);
    expect(dept.scalingRisks![0].area).toBeDefined();
  });
});

describe('getAllDepartments', () => {
  it('returns at least 4 departments', () => {
    const departments = getAllDepartments();
    expect(departments.length).toBeGreaterThanOrEqual(4);
  });

  it('each department has profile', () => {
    const departments = getAllDepartments();
    for (const dept of departments) {
      expect(dept.profile.slug).toBeTruthy();
    }
  });
});
