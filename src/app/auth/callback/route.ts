import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const type = searchParams.get('type');

  if (code) {
    const redirectTo = new URL('/orgs', request.url);
    const response = NextResponse.redirect(redirectTo);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      // Detect recovery flow: check URL type param or recent recovery_sent_at
      if (user) {
        const isRecovery = type === 'recovery' ||
          (user.recovery_sent_at && Date.now() - new Date(user.recovery_sent_at).getTime() < 5 * 60 * 1000);

        if (isRecovery) {
          return NextResponse.redirect(new URL('/update-password', request.url), {
            headers: response.headers,
          });
        }

        // Find user's first org and redirect there
        const { data: memberships } = await supabase
          .from('org_members')
          .select('org_id, organizations(slug)')
          .eq('user_id', user.id)
          .limit(1);
        if (memberships?.length && memberships[0].organizations) {
          const org = memberships[0].organizations as unknown as { slug: string };
          return NextResponse.redirect(new URL(`/org/${org.slug}/priorities`, request.url), {
            headers: response.headers,
          });
        }
      }
      return response;
    }
  }

  // Code exchange failed or no code — redirect to login with error
  return NextResponse.redirect(new URL('/login?error=link_expired', request.url));
}
