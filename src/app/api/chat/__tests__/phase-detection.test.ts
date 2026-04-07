import { describe, it, expect } from 'vitest';
import {
  createDetectionState,
  detectPhaseAndTopicTags,
  detectPhaseKeywordFallback,
  stripPhaseTags,
} from '@/lib/phase-config';

describe('detectPhaseAndTopicTags', () => {
  it('detects a phase tag in the buffer', () => {
    const state = createDetectionState();
    const buffer = 'Some text before <phase>3</phase> and after';
    const events = detectPhaseAndTopicTags(buffer, state);

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      type: 'phase',
      phase_number: 3,
      phase_title: 'Tools & Systems',
      sub_progress: { current: 0, total: 5 },
    });
    expect(state.currentPhase).toBe(3);
    expect(state.detectedPhases.has(3)).toBe(true);
  });

  it('does not re-emit an already detected phase', () => {
    const state = createDetectionState();
    const buffer = 'Text <phase>2</phase> more text';
    detectPhaseAndTopicTags(buffer, state);

    // Reset lastCheckedIndex to rescan same content
    state.lastCheckedIndex = 0;
    const events = detectPhaseAndTopicTags(buffer, state);
    expect(events).toHaveLength(0);
  });

  it('ignores partial/incomplete phase tag (split across chunks)', () => {
    const state = createDetectionState();
    // Simulate a partial tag -- the closing tag hasn't arrived yet
    const partialBuffer = 'Some text <phase>4</pha';
    const events = detectPhaseAndTopicTags(partialBuffer, state);
    expect(events).toHaveLength(0);
    expect(state.detectedPhases.size).toBe(0);
  });

  it('detects the tag once the partial chunk completes', () => {
    const state = createDetectionState();
    // First chunk: partial
    const partial = 'Some text <phase>4</pha';
    detectPhaseAndTopicTags(partial, state);

    // Second chunk completes the tag
    const full = 'Some text <phase>4</phase> rest';
    const events = detectPhaseAndTopicTags(full, state);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: 'phase', phase_number: 4 });
  });

  it('ignores malformed phase tag with non-numeric content', () => {
    const state = createDetectionState();
    const buffer = 'Text <phase>abc</phase> more';
    const events = detectPhaseAndTopicTags(buffer, state);
    expect(events).toHaveLength(0);
  });

  it('detects two phase transitions in one response', () => {
    const state = createDetectionState();
    const buffer =
      'Covered identity <phase>1</phase> now people <phase>2</phase>';
    const events = detectPhaseAndTopicTags(buffer, state);

    const phaseEvents = events.filter((e) => e.type === 'phase');
    expect(phaseEvents).toHaveLength(2);
    expect(phaseEvents[0]).toMatchObject({ phase_number: 1 });
    expect(phaseEvents[1]).toMatchObject({ phase_number: 2 });
    expect(state.currentPhase).toBe(2);
  });

  it('detects a topic tag and associates it with the current phase', () => {
    const state = createDetectionState(3);
    const buffer = 'Covered tools overview <topic>2</topic> next';
    const events = detectPhaseAndTopicTags(buffer, state);

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      type: 'topic',
      phase_number: 3,
      sub_progress: { current: 2, total: 5 },
    });
  });

  it('detects phase then topic in same buffer', () => {
    const state = createDetectionState();
    const buffer = 'Done <phase>5</phase> first topic <topic>1</topic>';
    const events = detectPhaseAndTopicTags(buffer, state);

    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({ type: 'phase', phase_number: 5 });
    expect(events[1]).toMatchObject({
      type: 'topic',
      phase_number: 5,
      sub_progress: { current: 1, total: 4 },
    });
  });

  it('ignores phase numbers out of range', () => {
    const state = createDetectionState();
    const buffer = '<phase>0</phase> <phase>9</phase> <phase>99</phase>';
    const events = detectPhaseAndTopicTags(buffer, state);
    expect(events).toHaveLength(0);
  });
});

describe('detectPhaseKeywordFallback', () => {
  it('detects "Let me move into Phase 4"', () => {
    const result = detectPhaseKeywordFallback(
      "Great, let me move into Phase 4 to talk about workflows.",
    );
    expect(result).toMatchObject({ phase_number: 4 });
  });

  it('detects "let\'s move on to Phase 3"', () => {
    const result = detectPhaseKeywordFallback(
      "Now let's move on to Phase 3.",
    );
    expect(result).toMatchObject({ phase_number: 3 });
  });

  it('detects "moving to Phase 6"', () => {
    const result = detectPhaseKeywordFallback('moving to Phase 6 now');
    expect(result).toMatchObject({ phase_number: 6 });
  });

  it('detects "wraps up" variant', () => {
    const result = detectPhaseKeywordFallback(
      'That wraps up Phase 2 nicely.',
    );
    expect(result).toMatchObject({ phase_number: 2 });
  });

  it('detects "let me shift on to Phase 7"', () => {
    const result = detectPhaseKeywordFallback(
      'let me shift on to Phase 7',
    );
    expect(result).toMatchObject({ phase_number: 7 });
  });

  it('returns null when no keyword match', () => {
    const result = detectPhaseKeywordFallback(
      'This is a normal response with no phase transition.',
    );
    expect(result).toBeNull();
  });

  it('returns null for out-of-range phase number', () => {
    const result = detectPhaseKeywordFallback(
      "Let's move on to Phase 9.",
    );
    expect(result).toBeNull();
  });
});

describe('stripPhaseTags', () => {
  it('removes phase and topic tags from content', () => {
    const input =
      'Hello <phase>3</phase> world <topic>1</topic> end';
    expect(stripPhaseTags(input)).toBe('Hello  world  end');
  });

  it('handles content with no tags', () => {
    const input = 'Just regular text here.';
    expect(stripPhaseTags(input)).toBe(input);
  });

  it('removes multiple tags', () => {
    const input = '<phase>1</phase><phase>2</phase><topic>3</topic>';
    expect(stripPhaseTags(input)).toBe('');
  });
});
