import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic auth guard. It only checks that a session cookie exists, which is
 * enough to send signed-out visitors to sign-in while remembering the page
 * they were trying to open. Pages should still validate the session
 * server-side before exposing private data.
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set(
    "redirect",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/profile"],
};
