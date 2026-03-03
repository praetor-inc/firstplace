import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirstPlace — Find Your First Apartment",
  description: "The smartest way for students and school graduates to find, evaluate and secure their first apartment. AI-powered scores, interactive maps, and real contact details.",
  keywords: ["student apartments", "first apartment", "rent finder", "student housing", "university accommodation"],
  openGraph: {
    title: "FirstPlace — Find Your First Apartment",
    description: "AI-powered apartment finder for students and school graduates",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
