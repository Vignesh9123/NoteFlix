import { NextRequest, NextResponse } from "next/server";
import {kv} from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";


const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, "60s"),
});
interface NextRequestWithIp extends NextRequest {
    ip: string | undefined;
}
export async function apiRateLimitMiddleware(req: NextRequestWithIp) {
    const forwarded = req.headers.get("x-forwarded-for")
    console.log("Forwarded", forwarded);
  const ip = forwarded ? forwarded.split(/, /)[0] : '127.0.0.1'
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)
    console.log("Remaining", remaining, ip);
    if (remaining === 0) {
      return new Response(
        JSON.stringify({
          error: 'Too many API calls', 
        }),
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      )
    }
    return NextResponse.next();
  }
  
export function middleware(req: NextRequestWithIp) {
    const pathname = req.nextUrl.pathname;
    const isPublicPath = pathname === "/login" || pathname === "/register" ;
    const token = req.cookies.get("token")?.value;
    if(pathname.startsWith("/api")) {
        return apiRateLimitMiddleware(req);
    }
    if(!isPublicPath && !token && pathname !== "/") {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if(isPublicPath && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|videos/NoteFlix.mp4|[a-z]*.txt|logo.webp|favicon.ico).*)']
}
