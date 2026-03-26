import { describe, it, expect } from 'vitest';
import { getMilestones, getStatuses, getDepartmentSlugs, parsePriorities, parseProfile } from '../parser';

describe('getMilestones', () => {
  it('returns 4 milestone configs', () => {
    const milestones = getMilestones();
    expect(milestones).toHaveLength(4);
    expect(milestones[0].name).toBe('Not Started');
    expect(milestones[3].name).toBe('Dept Head Confirmed');
  });
});

describe('getStatuses', () => {
  it('returns 17 status entries', () => {
    const statuses = getStatuses();
    expect(Object.keys(statuses)).toHaveLength(17);
  });

  it('sales-ops priority-1 is at milestone 1', () => {
    const statuses = getStatuses();
    expect(statuses['sales-operations/priority-1'].milestone).toBe(1);
  });
});

describe('getDepartmentSlugs', () => {
  it('discovers accounting and sales-operations', () => {
    const slugs = getDepartmentSlugs();
    expect(slugs).toContain('accounting');
    expect(slugs).toContain('sales-operations');
    expect(slugs.length).toBeGreaterThanOrEqual(2);
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
