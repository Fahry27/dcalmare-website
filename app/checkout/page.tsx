import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutForm from "@/components/CheckoutForm";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your dCalmare order, pay manually with GoPay Merchant QR, and confirm through WhatsApp after payment."
};

export default async function CheckoutPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login?redirect=/checkout");
  }

  return (
    <Suspense
      fallback={
        <section className="bg-offwhite py-16">
          <div className="container-pad text-muted">Loading checkout...</div>
        </section>
      }
    >
      <CheckoutForm initialUser={session} />
    </Suspense>
  );
}
