import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "dCalmare | One summer can change everything.",
    template: "%s | dCalmare"
  },
  description:
    "Summer-inspired graphic tees made to remind you to slow down, feel present, and wear the moment.",
  metadataBase: new URL("https://dcalmare.local"),
  openGraph: {
    title: "dCalmare | One summer can change everything.",
    description: "Summer-inspired graphic tees made to remind you to slow down, feel present, and wear the moment.",
    type: "website",
    siteName: "dCalmare"
  },
  twitter: {
    card: "summary_large_image",
    title: "dCalmare | One summer can change everything.",
    description: "Summer-inspired graphic tees made to remind you to slow down, feel present, and wear the moment."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
