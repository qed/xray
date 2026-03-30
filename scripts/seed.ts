// Run with: npx tsx scripts/seed.ts
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { parseProfile, parsePriorities, type ParsedProfile } from '../src/lib/parse-markdown';

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
    const code = org.slug.replace(/-/g, '') + '2026';
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
        let profile: ParsedProfile | null = null;

        if (fs.existsSync(profilePath)) {
          const parsed = parseProfile(readFile(profilePath));
          deptName = parsed.name || deptName;
          profile = parsed;
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
          const priorities = parsePriorities(priorityText);

          await supabase.from('priorities').delete().eq('department_id', dept.id);

          if (priorities.length > 0) {
            const { data: inserted } = await supabase
              .from('priorities')
              .insert(priorities.map((p) => ({
                department_id: dept.id,
                rank: p.rank,
                name: p.name,
                effort: p.effort,
                complexity: p.complexity,
                what_to_automate: p.whatToAutomate,
                current_state: p.currentState,
                why_it_matters: p.whyItMatters,
                estimated_time_savings: p.estimatedTimeSavings,
                suggested_approach: p.suggestedApproach,
                success_criteria: p.successCriteria,
                dependencies: p.dependencies,
                status: p.status,
              })))
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
    const code = org.slug.replace(/-/g, '') + '2026';
    console.log(`  ${org.name}: ${code}`);
  }
}

seed().catch(console.error);
