import { NextRequest, NextResponse } from "next/server";

import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";

/** Every route is gated except the sign-in page itself and Next's own static assets. */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (await verifySessionToken(token)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
