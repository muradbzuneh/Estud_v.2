import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    // Check for Better Auth session token cookie
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    // If unauthenticated, redirect to the main auth page with callbackUrl
    if (!sessionToken) {
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("callbackUrl", pathname);
      authUrl.searchParams.set("adminRequired", "true");
      return NextResponse.redirect(authUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
