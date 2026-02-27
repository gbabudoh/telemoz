import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const user = req.nextauth.token;

    // If user is authenticated and attempts to access landing, login, or register
    if (user && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
      const userType = user.userType as string;
      const dashboard = userType === "admin" ? "/admin" : userType === "client" ? "/client" : "/pro";
      return NextResponse.redirect(new URL(dashboard, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Define public routes that don't need authentication
        const isPublicRoute = 
          pathname === "/" || 
          pathname === "/login" || 
          pathname === "/register" || 
          pathname === "/marketplace" ||
          pathname.startsWith("/api/auth");

        if (isPublicRoute) return true;

        // Require token for everything else (protected routes)
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
    "/marketplace",
  ],
};
