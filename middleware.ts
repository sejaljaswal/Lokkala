import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Define protected routes
    const protectedRoutes = ["/dashboard", "/profile", "/upload"];

    // If the user is trying to access a protected route and has no token, redirect to login
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!token) {
            const url = new URL("/login", request.url);
            return NextResponse.redirect(url);
        }
    }

    // If the user has a token and tries to access login or signup, redirect them to dashboard
    if (token && (pathname === "/login" || pathname === "/signup")) {
        const url = new URL("/dashboard", request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/upload/:path*", "/login", "/signup"],
};
