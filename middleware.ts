import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { hostname, pathname, search } = request.nextUrl;

  // ── WWW 통일: non-www → www 301 영구 리디렉션 ──────────────────────────
  // 프로덕션 환경(hangul-tajawang.com)에서만 적용하여 로컬 개발 환경 안전 보장
  if (hostname === 'hangul-tajawang.com') {
    const wwwUrl = new URL(request.url);
    wwwUrl.hostname = 'www.hangul-tajawang.com';
    return NextResponse.redirect(wwwUrl, {
      status: 301,
      headers: { 'Cache-Control': 'public, max-age=31536000' },
    });
  }
  // ────────────────────────────────────────────────────────────────────────

  // ── /adminsangwon: 허용 IP 외에는 존재 자체를 숨긴다 (404) ──────────────
  if (pathname.startsWith('/adminsangwon')) {
    const allowed = (process.env.ADMIN_ALLOWED_IPS || '193.186.4.174')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const clientIp = (request.headers.get('x-forwarded-for') || '')
      .split(',')[0]
      .trim();
    const isLocalDev =
      process.env.NODE_ENV === 'development' &&
      (clientIp === '' || clientIp === '::1' || clientIp === '127.0.0.1');
    if (!isLocalDev && !allowed.includes(clientIp)) {
      return new NextResponse(null, { status: 404 });
    }
    // 허용 IP → 세션 갱신을 위해 아래 Supabase 처리로 진행
  }

  // 보호된 라우트(예: /mypage, /adminsangwon)가 아니면 Supabase API 호출을 생략하여 트래픽 최적화
  if (!pathname.startsWith('/mypage') && !pathname.startsWith('/adminsangwon')) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // auth issues.
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, app-ads.txt, manifest.json
     * - auth/callback (handled by route handler)
     * - Any path with a dot (likely a static file with an extension, including query params)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|app-ads.txt|manifest.json|auth/callback|.*\\..*).*)',
  ],
}
