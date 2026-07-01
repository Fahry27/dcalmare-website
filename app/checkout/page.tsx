import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutForm from "@/components/CheckoutForm";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your dCalmare order, pay with dynamic QRIS, and confirm payment for admin verification."
};

export default async function CheckoutPage() {
  const session = await getSession();

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
