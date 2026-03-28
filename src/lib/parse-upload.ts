import type { TeamMember } from '@/lib/types';

export interface ParsedProfile {
  name: string;
  mission: string;
  scope: string;
  teamMembers: TeamMember[];
  tools: string[];
  singlePointsOfFailure: string[];
  painPoints: string[];
  tribalKnowledgeRisks: string[];
}

export interface ParsedPriority {
  rank: number;
  name: string;
  effort: string;
  complexity: string;
  impact: string;
  whatToAutomate: string;
  currentState: string;
  whyItMatters: string;
  estimatedTimeSavings: string;
  suggestedApproach: string;
  successCriteria: string;
  dependencies: string[];
  status: string;
}

export function parseProfileFromText(text: string): ParsedProfile {
  const lines = text.split('\n');

  function extractSection(heading: string): string[] {
    const items: string[] = [];
    let inSection = false;
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) {
        inSection = true;
        continue;
      }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.startsWith('- ')) {
        items.push(line.replace(/^-\s*/, '').trim());
      }
    }
    return items;
  }

  function extractText(heading: string): string {
    let inSection = false;
    const parts: string[] = [];
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) {
        inSection = true;
        continue;
      }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.trim()) parts.push(line.trim());
    }
    return parts.join(' ');
  }

  const teamMembers: TeamMember[] = [];
  let inTeamSection = false;
  let pastHeader = false;
  for (const line of lines) {
    if (line.match(/^#{1,3}\s.*team/i)) { inTeamSection = true; continue; }
    if (inTeamSection && /^#{1,3}\s/.test(line) && !line.match(/team/i)) break;
    if (inTeamSection && line.includes('|') && line.includes('---')) { pastHeader = true; continue; }
    if (inTeamSection && pastHeader && line.includes('|')) {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        teamMembers.push({
          name: cols[0],
          title: cols[1] ?? '',
          responsibilities: cols[2] ?? '',
        });
      }
    }
  }

  const name = (lines.find((l) => /^#\s/.test(l)) ?? '').replace(/^#\s*/, '').replace(/department\s*profile/i, '').trim();

  return {
    name,
    mission: extractText('mission') || extractText('purpose'),
    scope: extractText('scope'),
    teamMembers,
    tools: extractSection('tools') || extractSection('software'),
    singlePointsOfFailure: extractSection('single point'),
    painPoints: extractSection('pain point'),
    tribalKnowledgeRisks: extractSection('tribal knowledge'),
  };
}

export function parsePrioritiesFromText(text: string): ParsedPriority[] {
  const priorities: ParsedPriority[] = [];
  const sections = text.split(/^##\s+(?:Priority\s+)?(\d+)/mi);

  for (let i = 1; i < sections.length; i += 2) {
    const rank = parseInt(sections[i], 10);
    const content = sections[i + 1] ?? '';
    const contentLines = content.split('\n');

    function findField(pattern: RegExp): string {
      for (const line of contentLines) {
        const match = line.match(pattern);
        if (match) return match[1]?.trim() ?? '';
      }
      return '';
    }

    function findSection(heading: string): string {
      let inSection = false;
      const parts: string[] = [];
      for (const line of contentLines) {
        if (line.match(new RegExp(`^###?\\s.*${heading}`, 'i'))) { inSection = true; continue; }
        if (inSection && /^###?\s/.test(line)) break;
        if (inSection && line.trim()) parts.push(line.trim());
      }
      return parts.join('\n');
    }

    function findList(heading: string): string[] {
      let inSection = false;
      const items: string[] = [];
      for (const line of contentLines) {
        if (line.match(new RegExp(`^###?\\s.*${heading}`, 'i'))) { inSection = true; continue; }
        if (inSection && /^###?\s/.test(line)) break;
        if (inSection && /^[-*]\s/.test(line.trim())) {
          items.push(line.trim().replace(/^[-*]\s*/, ''));
        }
      }
      return items;
    }

    const nameMatch = contentLines[0]?.match(/^[:\s\u2014\u2013-]*(.+)/);
    const name = nameMatch?.[1]?.trim() ?? `Priority ${rank}`;

    priorities.push({
      rank,
      name,
      effort: findField(/\*?\*?effort\*?\*?[:\s]+(.+)/i),
      complexity: findField(/\*?\*?complexity\*?\*?[:\s]+(.+)/i),
      impact: findField(/\*?\*?impact\*?\*?[:\s]+(.+)/i),
      whatToAutomate: findSection('what to automate') || findSection('automate'),
      currentState: findSection('current state') || findSection('current process'),
      whyItMatters: findSection('why it matters') || findSection('why'),
      estimatedTimeSavings: findField(/\*?\*?estimated time saving\*?\*?s?[:\s]+(.+)/i) || findField(/\*?\*?time saving\*?\*?s?[:\s]+(.+)/i),
      suggestedApproach: findSection('suggested approach') || findSection('approach'),
      successCriteria: findSection('success criteria') || findSection('success'),
      dependencies: findList('dependencies') || findList('depends on'),
      status: findField(/\*?\*?status\*?\*?[:\s]+(.+)/i),
    });
  }

  return priorities;
}
