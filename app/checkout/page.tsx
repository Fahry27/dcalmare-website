import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your dCalmare order, pay manually with GoPay Merchant QR, and confirm through WhatsApp after payment."
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-offwhite py-16">
          <div className="container-pad text-muted">Loading checkout...</div>
        </section>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
