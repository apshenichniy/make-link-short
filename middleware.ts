import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isOnAccountPage = req.nextUrl.pathname.startsWith("/account");

  if (isOnAccountPage) {
    if (isLoggedIn) return null;
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
