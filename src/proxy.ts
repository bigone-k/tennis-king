import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth/token";

/**
 * Optimistic gate: anything without a valid session cookie is bounced to
 * /gate. This is a pre-filter, not the only defence — Route Handlers verify
 * the session again via `hasValidSession()`.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (verifyToken(token)) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  // API clients can't follow a redirect to an HTML login page — a fetch would
  // silently receive markup instead of JSON. Answer with a status they can act on.
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.json(
      { error: "세션이 만료되었습니다. 페이지를 새로고침해 주세요." },
      { status: 401 },
    );
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = "/gate";
  url.search =
    pathname === "/" ? "" : `?next=${encodeURIComponent(pathname + search)}`;

  const response = NextResponse.redirect(url);
  // Clear expired/tampered cookies so the browser stops resending them.
  if (token) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export const config = {
  matcher: [
    "/((?!gate|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|svg|ico|webp|gif)$).*)",
  ],
};
