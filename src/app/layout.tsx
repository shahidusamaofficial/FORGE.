import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "aangan. — Wear the Courtyard.",
  description:
    "AANGAN is a minimal-premium everyday apparel brand from Lahore, Pakistan. Hoodies, tees, sweatshirts, polos, mugs, and notebooks in earth tones inspired by the Pakistani aangan.",
  keywords: [
    "AANGAN",
    "Pakistani clothing brand",
    "minimal premium",
    "earth tones",
    "hoodies",
    "t-shirts",
    "polo shirts",
    "Lahore",
  ],
  authors: [{ name: "AANGAN Brand Studio" }],
  openGraph: {
    title: "aangan. — Wear the Courtyard.",
    description: "Minimal-premium everyday apparel from Lahore, Pakistan.",
    siteName: "AANGAN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
