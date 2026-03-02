import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// In-memory token store for very simple rate limiting
// For a production vercel deployment, Redis (eg. Upstash) is recommended
const requestCounts = new Map<string, { count: number, resetTime: number }>();

function ipRateLimit(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 30;     // limit each IP to 30 requests per window

    const record = requestCounts.get(ip);
    if (!record || now > record.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
        return null;
    }

    record.count += 1;
    if (record.count > maxRequests) {
        return NextResponse.json(
            { error: "Too many requests, please try again later." },
            { status: 429 }
        );
    }
    return null;
}

export async function middleware(request: NextRequest) {
    // Apply rate limiting for API routes first
    if (request.nextUrl.pathname.startsWith('/api')) {
        const rateLimitResponse = ipRateLimit(request);
        if (rateLimitResponse) return rateLimitResponse;
    }

    // Then update supabase auth session cookies
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
