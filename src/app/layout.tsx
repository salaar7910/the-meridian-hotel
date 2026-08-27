import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Meridian — Luxury Hotel & Residences",
    template: "%s | The Meridian",
  },
  description:
    "Experience quiet luxury at The Meridian. Beautifully appointed rooms and suites with world-class service in the heart of the city.",
  keywords: ["luxury hotel", "hotel rooms", "suites", "reservations", "fine dining"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "The Meridian",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
