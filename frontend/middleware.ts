import { NextRequest, NextResponse } from "next/server";

const roleAccess: Record<string, string[]> = {
  "/student/dashboard": ["SUPER_ADMIN", "COLLEGE_ADMIN", "STUDENT"],
  "/faculty/dashboard": ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY"],
  "/students": ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY"],
  "/faculty": ["SUPER_ADMIN", "COLLEGE_ADMIN"],
  "/departments": ["SUPER_ADMIN", "COLLEGE_ADMIN"],
  "/attendance": ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY", "STUDENT"],
  "/placements": ["SUPER_ADMIN", "COLLEGE_ADMIN", "STUDENT"],
  "/ai": ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY", "STUDENT"],
  "/analytics": ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY"],
  "/school-pulse": ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY"],
  "/email-campaigns": ["SUPER_ADMIN", "COLLEGE_ADMIN"],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access")?.value;
  const role = request.cookies.get("role")?.value || "";

  const protectedRoutes = [
    "/dashboard",
    "/student",
    "/faculty",
    "/students",
    "/departments",
    "/attendance",
    "/placements",
    "/ai",
    "/analytics",
  ];

  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check role-based access
  for (const [route, allowedRoles] of Object.entries(roleAccess)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/student/:path*",
    "/faculty/:path*",
    "/students/:path*",
    "/departments/:path*",
    "/attendance/:path*",
    "/placements/:path*",
    "/ai/:path*",
    "/analytics/:path*",
    "/school-pulse/:path*",
    "/email-campaigns/:path*",
  ],
};
