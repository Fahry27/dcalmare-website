import type { Metadata } from "next";
import FAQSection from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about dCalmare orders and products."
};

export default function FAQPage() {
  return <FAQSection />;
}
