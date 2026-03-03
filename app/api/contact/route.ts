import { z } from 'zod';
import { NextResponse } from 'next/server';

// Define input schema for sanitization and validation
const ContactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long").trim(),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    message: z.string()
        .min(10, "Message must be at least 10 characters")
        .max(1000, "Message is too long")
        .trim(),
    listingId: z.string().uuid("Invalid listing ID format"),
});

// Simple in-memory rate limiting map definition
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5; // requests
const TIME_WINDOW = 60 * 1000; // 1 minute in milliseconds

export async function POST(request: Request) {
    try {
        // RATE LIMITING
        const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
        const now = Date.now();
        const clientData = rateLimitMap.get(ip);

        if (clientData) {
            if (now - clientData.lastReset > TIME_WINDOW) {
                rateLimitMap.set(ip, { count: 1, lastReset: now });
            } else if (clientData.count >= RATE_LIMIT) {
                return NextResponse.json({ error: "Too many requests, slow down." }, { status: 429 });
            } else {
                clientData.count++;
            }
        } else {
            rateLimitMap.set(ip, { count: 1, lastReset: now });
        }

        const rawBody = await request.json();

        // 1. INPUT VALIDATION & SANITIZATION
        const parsed = ContactSchema.safeParse(rawBody);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid input", details: parsed.error.issues },
                { status: 400 }
            );
        }

        const sanitizedData = parsed.data;
        console.log(`[API] Processing Inquiry for ${sanitizedData.listingId} from ${sanitizedData.email}`);

        // 2. Here we would normally connect to Supabase/SendGrid to send an email.
        // E.g. await supabase.from('inquiries').insert([sanitizedData]);

        return NextResponse.json({ success: true, message: "Inquiry sent securely." }, { status: 200 });
    } catch (err) {
        console.error("API Error: ", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
