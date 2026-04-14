/**
 * One-off admin script to:
 * 1. Delete a user by email (so they can re-test the join flow)
 * 2. List existing invites for the wevend org
 * 3. Create a memorable invite code if none matches
 *
 * Run with: npx tsx scripts/admin-invite-reset.ts
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const TARGET_EMAIL = 'pkuperman@wevend.com';
const ORG_SLUG = 'wevend';
const DESIRED_CODE = 'wevend2026';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // 1. Find user by email
  console.log(`\n=== Looking up user ${TARGET_EMAIL} ===`);
  const { data: usersPage, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) throw listErr;
  const user = usersPage.users.find((u) => u.email?.toLowerCase() === TARGET_EMAIL.toLowerCase());

  if (user) {
    console.log(`Found user ${user.id}. Deleting org_members + auth user...`);
    const { error: memberErr } = await supabase.from('org_members').delete().eq('user_id', user.id);
    if (memberErr) console.warn('org_members delete warning:', memberErr.message);
    const { error: deleteErr } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteErr) throw deleteErr;
    console.log('User deleted.');
  } else {
    console.log('No user with that email — already clean.');
  }

  // 2. Look up org
  console.log(`\n=== Looking up org ${ORG_SLUG} ===`);
  const { data: org, error: orgErr } = await supabase.from('organizations').select('*').eq('slug', ORG_SLUG).single();
  if (orgErr || !org) throw orgErr ?? new Error('Org not found');
  console.log(`Found org: ${org.name} (${org.id})`);

  // 3. List existing invites
  console.log(`\n=== Existing invites for ${ORG_SLUG} ===`);
  const { data: invites } = await supabase.from('invites').select('code, email, role, use_count, max_uses, expires_at').eq('org_id', org.id);
  console.table(invites ?? []);

  // 4. Check whether the desired code exists
  const existing = invites?.find((i) => i.code === DESIRED_CODE);
  if (existing) {
    console.log(`\nInvite code "${DESIRED_CODE}" already exists.`);
  } else {
    console.log(`\n=== Creating invite code "${DESIRED_CODE}" ===`);
    const { error: insErr } = await supabase.from('invites').insert({
      org_id: org.id,
      code: DESIRED_CODE,
      email: null,
      role: 'member',
      max_uses: null, // unlimited
      created_by: null,
    });
    if (insErr) throw insErr;
    console.log('Created.');
  }

  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
