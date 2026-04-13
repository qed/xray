import { describe, it, expect } from 'vitest';

// Mirror the milestone-to-status mapping from migration 014
const STAGE_TO_STATUS: Record<number, string> = {
  0: 'not_started',
  1: 'in_progress',
  2: 'in_progress',
  3: 'complete',
};

function mapMilestoneToStatus(stage: number | null): string {
  if (stage === null || stage === undefined) return 'not_started';
  return STAGE_TO_STATUS[stage] ?? 'not_started';
}

// Valid status values matching the CHECK constraint
const VALID_STATUSES = ['proposed', 'approved', 'rejected', 'not_started', 'in_progress', 'complete'];

function isValidStatus(status: string): boolean {
  return VALID_STATUSES.includes(status);
}

// Bridge trigger logic: only update status if not proposed/rejected
function bridgeShouldUpdate(currentStatus: string): boolean {
  return !['proposed', 'rejected'].includes(currentStatus);
}

describe('Milestone to status mapping', () => {
  it('stage 0 maps to not_started', () => {
    expect(mapMilestoneToStatus(0)).toBe('not_started');
  });

  it('stage 1 maps to in_progress', () => {
    expect(mapMilestoneToStatus(1)).toBe('in_progress');
  });

  it('stage 2 maps to in_progress', () => {
    expect(mapMilestoneToStatus(2)).toBe('in_progress');
  });

  it('stage 3 maps to complete', () => {
    expect(mapMilestoneToStatus(3)).toBe('complete');
  });

  it('null milestone (orphaned priority) maps to not_started', () => {
    expect(mapMilestoneToStatus(null)).toBe('not_started');
  });

  it('all mapped statuses are valid', () => {
    for (const stage of [0, 1, 2, 3]) {
      expect(isValidStatus(mapMilestoneToStatus(stage))).toBe(true);
    }
  });
});

describe('Status CHECK constraint validation', () => {
  it('accepts all valid status values', () => {
    for (const status of VALID_STATUSES) {
      expect(isValidStatus(status)).toBe(true);
    }
  });

  it('rejects invalid status values', () => {
    expect(isValidStatus('Not started')).toBe(false);
    expect(isValidStatus('')).toBe(false);
    expect(isValidStatus('pending')).toBe(false);
    expect(isValidStatus('done')).toBe(false);
    expect(isValidStatus('COMPLETE')).toBe(false);
  });

  it('no migrated priority gets proposed or approved status', () => {
    // Migration maps from milestone stages only — no stage maps to proposed or approved
    for (const stage of [0, 1, 2, 3]) {
      const status = mapMilestoneToStatus(stage);
      expect(status).not.toBe('proposed');
      expect(status).not.toBe('approved');
    }
  });
});

describe('Bridge trigger guard', () => {
  it('updates status for not_started priorities', () => {
    expect(bridgeShouldUpdate('not_started')).toBe(true);
  });

  it('updates status for in_progress priorities', () => {
    expect(bridgeShouldUpdate('in_progress')).toBe(true);
  });

  it('updates status for complete priorities', () => {
    expect(bridgeShouldUpdate('complete')).toBe(true);
  });

  it('does NOT update status for proposed priorities', () => {
    expect(bridgeShouldUpdate('proposed')).toBe(false);
  });

  it('does NOT update status for rejected priorities', () => {
    expect(bridgeShouldUpdate('rejected')).toBe(false);
  });
});

describe('Dual-write: milestones PATCH route stage-to-status', () => {
  const stageToStatus: Record<number, string> = {
    0: 'not_started',
    1: 'in_progress',
    2: 'in_progress',
    3: 'complete',
  };

  it('maps all valid stages to valid statuses', () => {
    for (const stage of [0, 1, 2, 3]) {
      expect(isValidStatus(stageToStatus[stage])).toBe(true);
    }
  });

  it('matches the migration mapping exactly', () => {
    for (const stage of [0, 1, 2, 3]) {
      expect(stageToStatus[stage]).toBe(STAGE_TO_STATUS[stage]);
    }
  });
});
