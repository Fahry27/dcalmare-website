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
  metadataBase: new URL("https://dcalmare-website.vercel.app"),
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png"
  },
  openGraph: {
    title: "dCalmare | One summer can change everything.",
    description: "Summer-inspired graphic tees made to remind you to slow down, feel present, and wear the moment.",
    url: "/",
    images: [
      {
        url: "/products/bottle-collection-tee-lifestyle.jpg",
        width: 1079,
        height: 1349,
        alt: "dCalmare first drop graphic tee"
      }
    ],
    type: "website",
    siteName: "dCalmare"
  },
  twitter: {
    card: "summary_large_image",
    title: "dCalmare | One summer can change everything.",
    description: "Summer-inspired graphic tees made to remind you to slow down, feel present, and wear the moment.",
    images: ["/products/bottle-collection-tee-lifestyle.jpg"]
  }
};

import AnimatePage from "@/components/AnimatePage";
import CartDrawer from "@/components/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-offwhite text-ink antialiased">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <AnimatePage>{children}</AnimatePage>
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
