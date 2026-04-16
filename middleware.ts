import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const userType = token?.userType as string | undefined;

    // Redirect authenticated users away from public auth pages
    if (token && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
      const dashboard = userType === "admin" ? "/admin" : userType === "client" ? "/client" : "/pro";
      return NextResponse.redirect(new URL(dashboard, req.url));
    }

    // ── Role-based access control ──────────────────────────────────────────
    // Admin-only paths
    if (pathname.startsWith("/admin") && userType !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Pro-only paths
    if (pathname.startsWith("/pro") && userType !== "pro") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Client-only paths
    if (pathname.startsWith("/client") && userType !== "client") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes — no token required
        const isPublicRoute =
          pathname === "/" ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/marketplace" ||
          pathname.startsWith("/marketplace/") ||
          pathname.startsWith("/api/auth") ||
          pathname === "/privacy" ||
          pathname === "/terms" ||
          pathname === "/cookie-policy" ||
          pathname === "/refund-policy" ||
          pathname === "/acceptable-use" ||
          pathname === "/about" ||
          pathname === "/how-it-works" ||
          pathname === "/blog" ||
          pathname === "/support" ||
          pathname.startsWith("/documentation");

        if (isPublicRoute) return true;

        // Everything else requires authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/client/:path*",
    "/pro/:path*",
    "/admin/:path*",
    "/marketplace/:path*",
    "/messaging/:path*",
  ],
};
