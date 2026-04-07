import { describe, it, expect } from 'vitest';
import { getCompletenessScore, PHASE8_FIELDS } from '../db';

/** Helper: returns a priority record with all standard fields filled. */
function fullStandardPriority(): Record<string, unknown> {
  return {
    name: 'Invoice Processing',
    what_to_automate: 'Manual invoice entry',
    current_state: 'All manual',
    why_it_matters: 'Saves 10 hours/week',
    estimated_time_savings: '10 hours/week',
    complexity: 'Medium',
    suggested_approach: 'Use OCR + integration',
    success_criteria: '90% auto-processed',
    dependencies: ['Accounting system'],
  };
}

describe('getCompletenessScore', () => {
  describe('standard fields only (backward-compatible)', () => {
    it('returns 9/9 for a fully filled priority', () => {
      const result = getCompletenessScore(fullStandardPriority());
      expect(result.score).toBe(9);
      expect(result.total).toBe(9);
      expect(result.missing).toEqual([]);
    });

    it('counts missing fields correctly', () => {
      const p = fullStandardPriority();
      delete p.suggested_approach;
      delete p.success_criteria;
      const result = getCompletenessScore(p);
      expect(result.score).toBe(7);
      expect(result.total).toBe(9);
      expect(result.missing).toEqual(['suggested_approach', 'success_criteria']);
    });

    it('treats empty string as missing', () => {
      const p = fullStandardPriority();
      p.name = '';
      const result = getCompletenessScore(p);
      expect(result.missing).toContain('name');
      expect(result.score).toBe(8);
    });

    it('treats empty dependencies array as missing', () => {
      const p = fullStandardPriority();
      p.dependencies = [];
      const result = getCompletenessScore(p);
      expect(result.missing).toContain('dependencies');
    });

    it('marks estimated_time_savings missing when not parseable', () => {
      const p = fullStandardPriority();
      p.estimated_time_savings = 'not quantified';
      const result = getCompletenessScore(p);
      expect(result.missing).toContain('estimated_time_savings');
      expect(result.score).toBe(8);
    });

    it('ignores Phase 8 fields when none are set (total stays 9)', () => {
      const p = fullStandardPriority();
      // No Phase 8 fields at all
      const result = getCompletenessScore(p);
      expect(result.total).toBe(9);
    });
  });

  describe('Phase 8 fields', () => {
    it('includes Phase 8 fields when ANY Phase 8 field is filled', () => {
      const p = { ...fullStandardPriority(), frequency: 'Daily' };
      const result = getCompletenessScore(p);
      expect(result.total).toBe(9 + PHASE8_FIELDS.length);
      // Only frequency is filled, the other 5 Phase 8 fields are missing
      expect(result.score).toBe(9 + 1);
      expect(result.missing).toContain('hands_on_time');
      expect(result.missing).toContain('waiting_overhead');
      expect(result.missing).toContain('hidden_costs');
      expect(result.missing).toContain('automation_percentage');
      expect(result.missing).toContain('employees_affected');
    });

    it('returns 15/15 when all standard and Phase 8 fields are filled', () => {
      const p = {
        ...fullStandardPriority(),
        frequency: 'Daily',
        hands_on_time: '2 hours',
        waiting_overhead: '1 hour',
        hidden_costs: 'Overtime pay',
        automation_percentage: '80%',
        employees_affected: '5',
      };
      const result = getCompletenessScore(p);
      expect(result.score).toBe(15);
      expect(result.total).toBe(15);
      expect(result.missing).toEqual([]);
    });

    it('does not count Phase 8 fields when they are all empty strings', () => {
      const p = {
        ...fullStandardPriority(),
        frequency: '',
        hands_on_time: '',
      };
      const result = getCompletenessScore(p);
      expect(result.total).toBe(9);
      expect(result.score).toBe(9);
    });

    it('does not count Phase 8 fields when they are whitespace-only', () => {
      const p = {
        ...fullStandardPriority(),
        frequency: '   ',
        hands_on_time: '  ',
      };
      const result = getCompletenessScore(p);
      expect(result.total).toBe(9);
    });
  });

  describe('value dimension fields (informational)', () => {
    it('does not include revenue_opportunity in scoring', () => {
      const p = { ...fullStandardPriority(), revenue_opportunity: '$50K' };
      const result = getCompletenessScore(p);
      expect(result.total).toBe(9);
      expect(result.missing).not.toContain('revenue_opportunity');
    });

    it('does not include growth_potential in scoring', () => {
      const p = { ...fullStandardPriority(), growth_potential: 'High' };
      const result = getCompletenessScore(p);
      expect(result.total).toBe(9);
      expect(result.missing).not.toContain('growth_potential');
    });
  });

  describe('PHASE8_FIELDS constant', () => {
    it('exports 6 Phase 8 field names', () => {
      expect(PHASE8_FIELDS).toHaveLength(6);
      expect(PHASE8_FIELDS).toContain('frequency');
      expect(PHASE8_FIELDS).toContain('hands_on_time');
      expect(PHASE8_FIELDS).toContain('waiting_overhead');
      expect(PHASE8_FIELDS).toContain('hidden_costs');
      expect(PHASE8_FIELDS).toContain('automation_percentage');
      expect(PHASE8_FIELDS).toContain('employees_affected');
    });

    it('does not include value dimension fields', () => {
      expect(PHASE8_FIELDS).not.toContain('revenue_opportunity');
      expect(PHASE8_FIELDS).not.toContain('growth_potential');
    });
  });
});
