import { describe, it, expect } from 'vitest';
import {
  getPhaseStatus,
  getPhaseTitle,
  getSubProgressLabel,
} from '../PhaseProgressBar';
import { PHASE_TITLES, PHASE_TOPICS } from '@/lib/phase-config';

/* ------------------------------------------------------------------ */
/*  getPhaseStatus                                                     */
/* ------------------------------------------------------------------ */

describe('getPhaseStatus', () => {
  it('marks Phase 1 as current on a new interview (currentPhase = 1)', () => {
    expect(getPhaseStatus(1, 1)).toBe('current');
    expect(getPhaseStatus(2, 1)).toBe('future');
    expect(getPhaseStatus(8, 1)).toBe('future');
  });

  it('marks phases 1-2 as completed, 3 as current, 4-8 as future when currentPhase = 3', () => {
    expect(getPhaseStatus(1, 3)).toBe('completed');
    expect(getPhaseStatus(2, 3)).toBe('completed');
    expect(getPhaseStatus(3, 3)).toBe('current');
    expect(getPhaseStatus(4, 3)).toBe('future');
    expect(getPhaseStatus(8, 3)).toBe('future');
  });

  it('marks phases 1-4 as completed and 5 as current when resuming at Phase 5', () => {
    expect(getPhaseStatus(1, 5)).toBe('completed');
    expect(getPhaseStatus(2, 5)).toBe('completed');
    expect(getPhaseStatus(3, 5)).toBe('completed');
    expect(getPhaseStatus(4, 5)).toBe('completed');
    expect(getPhaseStatus(5, 5)).toBe('current');
    expect(getPhaseStatus(6, 5)).toBe('future');
  });

  it('marks all phases as completed when currentPhase > 8 (all done)', () => {
    // When currentPhase is 9 (beyond last phase), all are completed
    for (let p = 1; p <= 8; p++) {
      expect(getPhaseStatus(p, 9)).toBe('completed');
    }
  });
});

/* ------------------------------------------------------------------ */
/*  getPhaseTitle                                                      */
/* ------------------------------------------------------------------ */

describe('getPhaseTitle', () => {
  it('returns correct titles for all 8 phases', () => {
    for (let p = 1; p <= 8; p++) {
      expect(getPhaseTitle(p)).toBe(PHASE_TITLES[p]);
    }
  });

  it('falls back to "Phase N" for unknown phase numbers', () => {
    expect(getPhaseTitle(99)).toBe('Phase 99');
  });
});

/* ------------------------------------------------------------------ */
/*  getSubProgressLabel                                                */
/* ------------------------------------------------------------------ */

describe('getSubProgressLabel', () => {
  it('shows correct count for 2/5 topics', () => {
    expect(getSubProgressLabel({ current: 2, total: 5 })).toBe('2/5 topics');
  });

  it('shows 0/N at the start of a phase', () => {
    expect(getSubProgressLabel({ current: 0, total: 6 })).toBe('0/6 topics');
  });

  it('shows N/N when a phase is fully covered', () => {
    expect(getSubProgressLabel({ current: 5, total: 5 })).toBe('5/5 topics');
  });

  it('reflects actual PHASE_TOPICS totals', () => {
    // Phase 4 has 6 topics, phase 5 has 4
    expect(getSubProgressLabel({ current: 3, total: PHASE_TOPICS[4] })).toBe('3/6 topics');
    expect(getSubProgressLabel({ current: 2, total: PHASE_TOPICS[5] })).toBe('2/4 topics');
  });
});

/* ------------------------------------------------------------------ */
/*  Integration: status across all 8 phases                            */
/* ------------------------------------------------------------------ */

describe('full progress scenarios', () => {
  it('Phase 8 active: phases 1-7 completed, 8 current', () => {
    for (let p = 1; p <= 7; p++) {
      expect(getPhaseStatus(p, 8)).toBe('completed');
    }
    expect(getPhaseStatus(8, 8)).toBe('current');
  });

  it('all 8 phases complete when currentPhase exceeds 8', () => {
    const statuses = Array.from({ length: 8 }, (_, i) => getPhaseStatus(i + 1, 9));
    expect(statuses.every((s) => s === 'completed')).toBe(true);
  });

  it('Phase 1 new interview: only phase 1 is current, rest future', () => {
    const statuses = Array.from({ length: 8 }, (_, i) => getPhaseStatus(i + 1, 1));
    expect(statuses[0]).toBe('current');
    expect(statuses.slice(1).every((s) => s === 'future')).toBe(true);
  });
});
