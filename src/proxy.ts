import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { isPlatformAdmin } from '@/lib/admin/is-platform-admin';
import {
  IMPERSONATION_COOKIE,
  decodeImpersonationCookie,
  isExpired,
} from '@/lib/admin/impersonation';

const publicPaths = ['/', '/login', '/signup', '/signup-success', '/join', '/forgot-password', '/update-password'];
const publicPrefixes = ['/invite/', '/auth/', '/wevend', '/csuite'];

function isPublicPath(pathname: string): boolean {
  if (publicPaths.includes(pathname)) return true;
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

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

  const { data: { user } } = await supabase.auth.getUser();

  // Impersonation cookie: if present but expired (or tampered), clear and redirect to
  // the target's detail page with a notice. Valid cookies flow through; the banner
  // in the root layout handles display.
  const rawImp = request.cookies.get(IMPERSONATION_COOKIE)?.value;
  if (rawImp) {
    const decoded = decodeImpersonationCookie(rawImp);
    if (!decoded || isExpired(decoded)) {
      const targetId = decoded?.targetUserId;
      const url = new URL(
        targetId ? `/admin/users/${targetId}` : '/admin/users',
        request.url
      );
      url.searchParams.set('impersonation', 'expired');
      const redirect = NextResponse.redirect(url);
      redirect.cookies.set(IMPERSONATION_COOKIE, '', { path: '/', maxAge: 0 });
      return redirect;
    }
  }

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // /admin: gate with isPlatformAdmin, bypass onboarding. 404 (not 403) so the
  // surface is invisible to non-admins per requirements R3.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const allowed = await isPlatformAdmin(user.id, user.email);
    if (!allowed) {
      return new NextResponse(null, { status: 404 });
    }
    return response;
  }

  // /orgs page — authenticated but no org membership check needed
  if (pathname === '/orgs') {
    return response;
  }

  if (pathname.startsWith('/org/')) {
    const orgSlug = pathname.split('/')[2];
    if (orgSlug) {
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', orgSlug)
        .single();

      if (!org) {
        return NextResponse.redirect(new URL('/join', request.url));
      }

      const { data: membership } = await supabase
        .from('org_members')
        .select('id')
        .eq('org_id', org.id)
        .eq('user_id', user.id)
        .single();

      if (!membership) {
        return NextResponse.redirect(new URL('/join', request.url));
      }

      // Redirect users with no department links to /team (self-serve flow)
      const teamPath = `/org/${orgSlug}/team`;
      const settingsPath = `/org/${orgSlug}/settings`;
      const isExempt = pathname === teamPath || pathname.startsWith(`${teamPath}/`)
        || pathname === settingsPath || pathname.startsWith(`${settingsPath}/`);

      if (!isExempt) {
        const { count } = await supabase
          .from('member_departments')
          .select('id, department:departments!inner(org_id)', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('department.org_id', org.id);

        if (count === 0) {
          return NextResponse.redirect(new URL(teamPath, request.url));
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.css|.*\\.js|.*\\.html).*)',
  ],
};
