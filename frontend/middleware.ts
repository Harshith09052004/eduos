import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access")?.value;

  const protectedRoutes = [
    "/dashboard",
    "/students",
    "/faculty",
    "/departments",
    "/attendance",
    "/placements",
    "/settings",
    "/assistant",
  ];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/students/:path*",
    "/faculty/:path*",
    "/departments/:path*",
    "/attendance/:path*",
    "/placements/:path*",
    "/settings/:path*",
    "/assistant/:path*",
  ],
};