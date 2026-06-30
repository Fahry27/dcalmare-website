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
    default: "dCalmare | Summer-Inspired Graphic Tees",
    template: "%s | dCalmare"
  },
  description:
    "Premium local fashion brand creating summer-inspired oversized white graphic tees with nostalgic words and calm luxury streetwear energy.",
  metadataBase: new URL("https://dcalmare.local"),
  openGraph: {
    title: "dCalmare",
    description: "One summer can change everything.",
    type: "website"
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
