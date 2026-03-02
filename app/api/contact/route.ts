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

export async function POST(request: Request) {
    try {
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

        // 2. Here we would normally connect to Supabase/SendGrid to send an email.
        // E.g. await supabase.from('inquiries').insert([sanitizedData]);

        return NextResponse.json({ success: true, message: "Inquiry sent securely." }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
