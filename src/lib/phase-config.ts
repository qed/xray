export const PHASE_TITLES: Record<number, string> = {
  1: 'Department Identity',
  2: 'People & Roles',
  3: 'Tools & Systems',
  4: 'Workflows & Processes',
  5: 'Handoffs & Dependencies',
  6: 'Pain Points & Bottlenecks',
  7: 'Wrap-Up & Prioritization',
  8: 'Time Savings Deep-Dive',
};

export const PHASE_TOPICS: Record<number, number> = {
  1: 5,
  2: 5,
  3: 5,
  4: 6,
  5: 4,
  6: 6,
  7: 4,
  8: 6,
};

// Regex for detecting phase tags in streaming buffer
export const PHASE_TAG_REGEX = /<phase>(\d+)<\/phase>/g;

// Regex for detecting topic tags in streaming buffer
export const TOPIC_TAG_REGEX = /<topic>(\d+)<\/topic>/g;

// Keyword fallback regex for phase transitions
export const PHASE_KEYWORD_REGEX =
  /(?:wraps? up|move (?:on |in)?to|moving to|let(?:'s| me) (?:move|shift|transition) (?:on |in)?to) Phase (\d)/i;

export interface PhaseEvent {
  type: 'phase';
  phase_number: number;
  phase_title: string;
  sub_progress: { current: number; total: number };
}

export interface TopicEvent {
  type: 'topic';
  phase_number: number;
  sub_progress: { current: number; total: number };
}

export interface DetectionState {
  lastCheckedIndex: number;
  currentPhase: number;
  detectedPhases: Set<number>;
  detectedTopics: Map<number, Set<number>>; // phase -> set of topic numbers
}

export function createDetectionState(initialPhase?: number): DetectionState {
  return {
    lastCheckedIndex: 0,
    currentPhase: initialPhase ?? 0,
    detectedPhases: new Set(),
    detectedTopics: new Map(),
  };
}

/**
 * Scan the buffer from lastCheckedIndex for phase and topic tags.
 * Returns any newly detected events and updates state in place.
 */
export function detectPhaseAndTopicTags(
  buffer: string,
  state: DetectionState,
): (PhaseEvent | TopicEvent)[] {
  const events: (PhaseEvent | TopicEvent)[] = [];
  const unchecked = buffer.substring(state.lastCheckedIndex);

  // Detect phase tags
  const phaseRegex = /<phase>(\d+)<\/phase>/g;
  let match: RegExpExecArray | null;

  while ((match = phaseRegex.exec(unchecked)) !== null) {
    const phaseNum = parseInt(match[1], 10);
    if (isNaN(phaseNum) || phaseNum < 1 || phaseNum > 8) continue;
    if (state.detectedPhases.has(phaseNum)) continue;

    state.detectedPhases.add(phaseNum);
    state.currentPhase = phaseNum;
    events.push({
      type: 'phase',
      phase_number: phaseNum,
      phase_title: PHASE_TITLES[phaseNum] || `Phase ${phaseNum}`,
      sub_progress: { current: 0, total: PHASE_TOPICS[phaseNum] || 0 },
    });

    // Update lastCheckedIndex to after this match
    const matchEnd = state.lastCheckedIndex + match.index + match[0].length;
    if (matchEnd > state.lastCheckedIndex) {
      state.lastCheckedIndex = matchEnd;
    }
  }

  // Re-scan from (possibly updated) lastCheckedIndex for topic tags
  const uncheckedForTopics = buffer.substring(state.lastCheckedIndex);
  const topicRegex = /<topic>(\d+)<\/topic>/g;

  while ((match = topicRegex.exec(uncheckedForTopics)) !== null) {
    const topicNum = parseInt(match[1], 10);
    if (isNaN(topicNum) || topicNum < 1) continue;

    const phase = state.currentPhase;
    if (!state.detectedTopics.has(phase)) {
      state.detectedTopics.set(phase, new Set());
    }
    const topicSet = state.detectedTopics.get(phase)!;
    if (topicSet.has(topicNum)) continue;

    topicSet.add(topicNum);
    events.push({
      type: 'topic',
      phase_number: phase,
      sub_progress: { current: topicNum, total: PHASE_TOPICS[phase] || 0 },
    });

    const matchEnd = state.lastCheckedIndex + match.index + match[0].length;
    if (matchEnd > state.lastCheckedIndex) {
      state.lastCheckedIndex = matchEnd;
    }
  }

  // If no tags found, still advance lastCheckedIndex but leave room for partial tags
  // A partial tag could be up to ~20 chars: </phase> is 8, <phase>99</phase> is 17
  if (events.length === 0) {
    const safeIndex = Math.max(0, buffer.length - 20);
    if (safeIndex > state.lastCheckedIndex) {
      state.lastCheckedIndex = safeIndex;
    }
  }

  return events;
}

/**
 * Keyword fallback: detect phase transitions from natural language.
 * Only call this after streaming is complete if no phase tags were detected.
 */
export function detectPhaseKeywordFallback(
  buffer: string,
): { phase_number: number } | null {
  const match = buffer.match(PHASE_KEYWORD_REGEX);
  if (!match) return null;
  const phaseNum = parseInt(match[1], 10);
  if (isNaN(phaseNum) || phaseNum < 1 || phaseNum > 8) return null;
  return { phase_number: phaseNum };
}

/**
 * Strip phase and topic tags from content before saving to DB.
 */
export function stripPhaseTags(content: string): string {
  return content
    .replace(/<phase>\d+<\/phase>/g, '')
    .replace(/<topic>\d+<\/topic>/g, '');
}
