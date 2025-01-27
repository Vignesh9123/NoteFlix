import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const isPublicPath = pathname === "/login" || pathname === "/register" ;
    const token = req.cookies.get("token")?.value;
    if(!isPublicPath && !token && pathname !== "/") {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if(isPublicPath && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|videos/NoteFlix.mp4|[a-z]*.txt|logo.webp|favicon.ico).*)']
}
