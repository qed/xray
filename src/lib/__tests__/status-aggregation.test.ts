import { describe, it, expect } from 'vitest';
import { STATUS_TRANSITIONS, type PriorityStatus } from '@/lib/constants';

// Pure logic tests for status-based aggregation and transition rules.

// Mirror the aggregation logic from db.ts
function bucketByStatus(statuses: string[]) {
  const byStatus: Record<string, number> = {};
  for (const s of statuses) {
    byStatus[s] = (byStatus[s] ?? 0) + 1;
  }
  return byStatus;
}

function countCompleted(statuses: string[]): number {
  return statuses.filter((s) => s === 'complete').length;
}

function countInProgress(statuses: string[]): number {
  return statuses.filter((s) => s === 'in_progress').length;
}

function countNotStarted(statuses: string[]): number {
  return statuses.filter((s) => s === 'not_started' || s === 'approved').length;
}

function isRealized(status: string): boolean {
  return status === 'in_progress' || status === 'complete';
}

function canTransition(from: PriorityStatus, to: PriorityStatus): boolean {
  return (STATUS_TRANSITIONS[from] ?? []).includes(to);
}

describe('Status-based aggregation', () => {
  const sample = ['proposed', 'not_started', 'not_started', 'in_progress', 'complete', 'rejected', 'approved'];

  it('buckets statuses correctly', () => {
    const result = bucketByStatus(sample);
    expect(result).toEqual({
      proposed: 1,
      not_started: 2,
      in_progress: 1,
      complete: 1,
      rejected: 1,
      approved: 1,
    });
  });

  it('counts completed correctly', () => {
    expect(countCompleted(sample)).toBe(1);
  });

  it('counts in_progress correctly', () => {
    expect(countInProgress(sample)).toBe(1);
  });

  it('counts not_started including approved', () => {
    // approved is a transient gate that counts as not_started for display
    expect(countNotStarted(sample)).toBe(3); // 2 not_started + 1 approved
  });

  it('proposed priorities are excluded from time savings (not realized)', () => {
    expect(isRealized('proposed')).toBe(false);
  });

  it('rejected priorities are excluded from time savings', () => {
    expect(isRealized('rejected')).toBe(false);
  });

  it('not_started priorities are not realized', () => {
    expect(isRealized('not_started')).toBe(false);
  });

  it('in_progress priorities are realized', () => {
    expect(isRealized('in_progress')).toBe(true);
  });

  it('complete priorities are realized', () => {
    expect(isRealized('complete')).toBe(true);
  });
});

describe('Status transition validation', () => {
  it('proposed → approved is valid', () => {
    expect(canTransition('proposed', 'approved')).toBe(true);
  });

  it('proposed → rejected is valid', () => {
    expect(canTransition('proposed', 'rejected')).toBe(true);
  });

  it('proposed → in_progress is invalid (must go through approved first)', () => {
    expect(canTransition('proposed', 'in_progress')).toBe(false);
  });

  it('approved → not_started is valid', () => {
    expect(canTransition('approved', 'not_started')).toBe(true);
  });

  it('not_started → in_progress is valid', () => {
    expect(canTransition('not_started', 'in_progress')).toBe(true);
  });

  it('in_progress → complete is valid', () => {
    expect(canTransition('in_progress', 'complete')).toBe(true);
  });

  it('complete → not_started is invalid (no backward transition)', () => {
    expect(canTransition('complete', 'not_started')).toBe(false);
  });

  it('rejected is terminal (no transitions out)', () => {
    expect(STATUS_TRANSITIONS.rejected).toEqual([]);
  });

  it('complete is terminal (no transitions out)', () => {
    expect(STATUS_TRANSITIONS.complete).toEqual([]);
  });

  it('in_progress → not_started is invalid (no backward)', () => {
    expect(canTransition('in_progress', 'not_started')).toBe(false);
  });
});

describe('Approved auto-transition', () => {
  // When a lead approves a proposed priority, the API auto-transitions
  // approved → not_started in the same PATCH
  it('approved is a transient gate, not a resting state', () => {
    // The API converts 'approved' to 'not_started' before saving
    const apiStatusTransform = (status: string): string => {
      if (status === 'approved') return 'not_started';
      return status;
    };
    expect(apiStatusTransform('approved')).toBe('not_started');
    expect(apiStatusTransform('in_progress')).toBe('in_progress');
  });
});
