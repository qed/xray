import { describe, it, expect } from 'vitest';
import { parseTimeSavings } from '../parser';

describe('parseTimeSavings', () => {
  describe('valid hours/week patterns', () => {
    it('parses single value: "10 hours/week"', () => {
      const result = parseTimeSavings('10 hours/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(10);
        expect(result.max).toBe(10);
        expect(result.midpoint).toBe(10);
      }
    });

    it('parses range: "5-15 hours/week"', () => {
      const result = parseTimeSavings('5-15 hours/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(5);
        expect(result.max).toBe(15);
        expect(result.midpoint).toBe(10);
      }
    });

    it('parses en-dash range: "5\u201315 hrs/wk"', () => {
      const result = parseTimeSavings('5\u201315 hrs/wk');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(5);
        expect(result.max).toBe(15);
        expect(result.midpoint).toBe(10);
      }
    });

    it('parses "hours per week" variant', () => {
      const result = parseTimeSavings('About 8 hours per week recovered');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(8);
        expect(result.max).toBe(8);
        expect(result.midpoint).toBe(8);
      }
    });

    it('parses "hrs/wk" variant', () => {
      const result = parseTimeSavings('Saves 3-5 hrs/wk');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(3);
        expect(result.max).toBe(5);
        expect(result.midpoint).toBe(4);
      }
    });

    it('parses "h/week" variant', () => {
      const result = parseTimeSavings('12h/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(12);
        expect(result.max).toBe(12);
        expect(result.midpoint).toBe(12);
      }
    });

    it('parses decimal values', () => {
      const result = parseTimeSavings('1.5-2.5 hours/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(1.5);
        expect(result.max).toBe(2.5);
        expect(result.midpoint).toBe(2);
      }
    });

    it('handles hours/week embedded in longer text', () => {
      const result = parseTimeSavings(
        'Various improvements estimated at 4-8 hours/week in total savings across the team'
      );
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(4);
        expect(result.max).toBe(8);
        expect(result.midpoint).toBe(6);
      }
    });

    it('produces display string for single value', () => {
      const result = parseTimeSavings('10 hours/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.display).toBe('10 hrs/wk');
      }
    });

    it('produces display string for range', () => {
      const result = parseTimeSavings('5-15 hours/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.display).toBe('5\u201315 hrs/wk');
      }
    });
  });

  describe('non-standard unit detection', () => {
    it('flags days: "1-3 days off the reconciliation"', () => {
      const result = parseTimeSavings(
        'Estimated to shave 1\u20133 days off the reconciliation start date monthly'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('non-standard unit');
      }
    });

    it('flags minutes/day: "30-60 minutes/day"', () => {
      const result = parseTimeSavings(
        'Spreadsheet maintenance: estimated 30-60 minutes/day across the team'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('non-standard unit');
      }
    });

    it('flags hours/month: "167 hours/month"', () => {
      const result = parseTimeSavings('167 hours/month recovered');
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('non-standard unit');
      }
    });

    it('flags minutes per merchant', () => {
      const result = parseTimeSavings('~20 minutes per merchant');
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('non-standard unit');
      }
    });

    it('flags hours/daily: "1-2 hours of daily time"', () => {
      const result = parseTimeSavings(
        'Estimated to represent 1\u20132 hours of Kylies daily time'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('non-standard unit');
      }
    });
  });

  describe('not quantified detection', () => {
    it('flags "Not quantified" text', () => {
      const result = parseTimeSavings(
        'Not quantified \u2014 but impacts every deal processed.'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('not quantified');
      }
    });

    it('flags "to be quantified" text', () => {
      const result = parseTimeSavings(
        'Depends on current audit time (to be quantified).'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('not quantified');
      }
    });
  });

  describe('no numeric value detection', () => {
    it('flags vague text with no numbers', () => {
      const result = parseTimeSavings(
        'Material reduction in payout error risk and compliance exposure'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('no numeric value found');
      }
    });

    it('flags empty string', () => {
      const result = parseTimeSavings('');
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('no numeric value found');
      }
    });

    it('flags text like "several hours per week" (no specific number)', () => {
      const result = parseTimeSavings(
        'Follow-up and tracking time is estimated at several hours per week across the team.'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('no numeric value found');
      }
    });
  });

  describe('rawText preserved on invalid', () => {
    it('includes the original text in rawText', () => {
      const input = 'Material reduction in risk';
      const result = parseTimeSavings(input);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.rawText).toBe(input);
      }
    });
  });
});
