import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: org } = await sb.from('organizations').select('id').eq('slug', 'wevend').single();
  if (!org) { console.log('No wevend org'); return; }

  const { data: dept } = await sb.from('departments').select('id, name, slug').eq('org_id', org.id).eq('slug', 'sales').single();
  if (!dept) { console.log('No old sales department found — already clean'); return; }

  console.log('Found old department:', dept.name, `(slug: ${dept.slug})`);

  // Delete milestones for its priorities
  const { data: prios } = await sb.from('priorities').select('id').eq('department_id', dept.id);
  if (prios && prios.length > 0) {
    for (const p of prios) {
      await sb.from('milestones').delete().eq('priority_id', p.id);
    }
    await sb.from('priorities').delete().eq('department_id', dept.id);
    console.log(`Deleted ${prios.length} priorities and their milestones`);
  }

  await sb.from('team_members').delete().eq('department_id', dept.id);
  await sb.from('departments').delete().eq('id', dept.id);
  console.log('Deleted old "sales" department');
}

main().catch(console.error);
