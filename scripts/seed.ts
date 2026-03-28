// Run with: npx tsx scripts/seed.ts
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ORGS = [
  { name: 'Helix', slug: 'helix' },
  { name: 'The Printing House', slug: 'the-printing-house' },
  { name: 'Winters Instruments', slug: 'winters-instruments' },
  { name: 'Connect CPA', slug: 'connect-cpa' },
  { name: 'WeVend', slug: 'wevend' },
];

const ARTIFACTS_DIR = path.join(process.cwd(), 'artifacts', 'WeVend X-Ray');

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function parseDepartmentProfile(text: string) {
  const lines = text.split('\n');

  function extractSection(heading: string): string[] {
    const items: string[] = [];
    let inSection = false;
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) { inSection = true; continue; }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.startsWith('- ')) items.push(line.replace(/^-\s*/, '').trim());
    }
    return items;
  }

  function extractText(heading: string): string {
    let inSection = false;
    const parts: string[] = [];
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) { inSection = true; continue; }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.trim()) parts.push(line.trim());
    }
    return parts.join(' ');
  }

  const teamMembers: { name: string; title: string; responsibilities: string }[] = [];
  let inTeam = false;
  let pastHeader = false;
  for (const line of lines) {
    if (line.match(/^#{1,3}\s.*team/i)) { inTeam = true; continue; }
    if (inTeam && /^#{1,3}\s/.test(line) && !line.match(/team/i)) break;
    if (inTeam && line.includes('---')) { pastHeader = true; continue; }
    if (inTeam && pastHeader && line.includes('|')) {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        teamMembers.push({ name: cols[0], title: cols[1] ?? '', responsibilities: cols[2] ?? '' });
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

async function seed() {
  console.log('Seeding organizations...\n');

  for (const org of ORGS) {
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .upsert({ name: org.name, slug: org.slug }, { onConflict: 'slug' })
      .select()
      .single();

    if (orgError) { console.error(`Failed to create ${org.name}:`, orgError.message); continue; }
    console.log(`Created org: ${org.name}`);

    // Create invite code
    const code = org.slug.toUpperCase().replace(/-/g, '') + '2026';
    await supabase
      .from('invites')
      .upsert({ org_id: orgData.id, code, created_by: null }, { onConflict: 'code' });
    console.log(`  Invite code: ${code}`);

    // Import WeVend data
    if (org.slug === 'wevend') {
      console.log('  Importing WeVend department data...');

      if (!fs.existsSync(ARTIFACTS_DIR)) {
        console.log('  Warning: artifacts/WeVend X-Ray not found, skipping data import');
        continue;
      }

      const deptDirs = fs.readdirSync(ARTIFACTS_DIR);

      for (const dir of deptDirs) {
        const deptPath = path.join(ARTIFACTS_DIR, dir);
        if (!fs.statSync(deptPath).isDirectory()) continue;

        const slug = dir;
        const profilePath = path.join(deptPath, 'department_profile.md');
        const prioritiesPath = path.join(deptPath, 'automation_priorities.md');

        let deptName = dir.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        let profile: ReturnType<typeof parseDepartmentProfile> | null = null;

        if (fs.existsSync(profilePath)) {
          profile = parseDepartmentProfile(readFile(profilePath));
          deptName = profile.name || deptName;
        }

        // Upsert department
        const { data: dept, error: deptError } = await supabase
          .from('departments')
          .upsert({
            org_id: orgData.id,
            slug,
            name: deptName,
            mission: profile?.mission ?? '',
            scope: profile?.scope ?? '',
            tools: profile?.tools ?? [],
            single_points_of_failure: profile?.singlePointsOfFailure ?? [],
            pain_points: profile?.painPoints ?? [],
            tribal_knowledge_risks: profile?.tribalKnowledgeRisks ?? [],
          }, { onConflict: 'org_id,slug' })
          .select()
          .single();

        if (deptError) { console.error(`  Failed to create dept ${slug}:`, deptError.message); continue; }
        console.log(`  Department: ${deptName}`);

        // Insert team members
        if (profile?.teamMembers?.length) {
          await supabase.from('team_members').delete().eq('department_id', dept.id);
          await supabase.from('team_members').insert(
            profile.teamMembers.map((tm) => ({
              department_id: dept.id,
              name: tm.name,
              title: tm.title,
              responsibilities: tm.responsibilities,
            }))
          );
          console.log(`    ${profile.teamMembers.length} team members`);
        }

        // Import priorities
        if (fs.existsSync(prioritiesPath)) {
          const priorityText = readFile(prioritiesPath);
          const sections = priorityText.split(/^##\s+(?:Priority\s+)?(\d+)/mi);

          const priorities: { rank: number; name: string; [key: string]: unknown }[] = [];
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
                if (inSection && /^[-*]\s/.test(line.trim())) items.push(line.trim().replace(/^[-*]\s*/, ''));
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
              what_to_automate: findSection('what to automate') || findSection('automate'),
              current_state: findSection('current state') || findSection('current process'),
              why_it_matters: findSection('why it matters') || findSection('why'),
              estimated_time_savings: findField(/\*?\*?estimated time saving\*?\*?s?[:\s]+(.+)/i),
              suggested_approach: findSection('suggested approach') || findSection('approach'),
              success_criteria: findSection('success criteria') || findSection('success'),
              dependencies: findList('dependencies') || findList('depends on'),
              status: findField(/\*?\*?status\*?\*?[:\s]+(.+)/i),
            });
          }

          // Delete existing, insert new
          await supabase.from('priorities').delete().eq('department_id', dept.id);

          if (priorities.length > 0) {
            const { data: inserted } = await supabase
              .from('priorities')
              .insert(priorities.map((p) => ({ department_id: dept.id, ...p })))
              .select();

            if (inserted) {
              await supabase.from('milestones').insert(
                inserted.map((p) => ({ priority_id: p.id, stage: 0 }))
              );
            }
            console.log(`    ${priorities.length} priorities`);
          }
        }
      }
    }
  }

  console.log('\nSeeding complete!');
  console.log('\nInvite codes:');
  for (const org of ORGS) {
    const code = org.slug.toUpperCase().replace(/-/g, '') + '2026';
    console.log(`  ${org.name}: ${code}`);
  }
}

seed().catch(console.error);
