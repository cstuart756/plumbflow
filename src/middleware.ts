import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // 1. Force HTTPS in production
    if (
      process.env.NODE_ENV === "production" &&
      req.headers.get("x-forwarded-proto") !== "https"
    ) {
      const url = req.nextUrl.clone();
      url.protocol = "https:";
      url.host = req.headers.get("host") || url.host;
      return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 2. Only require authentication for /app routes
        if (req.nextUrl.pathname.startsWith("/app")) {
          return !!token;
        }
        // Allow public access to everything else (landing page, booking pages, login, register)
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};