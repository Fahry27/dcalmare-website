import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop dCalmare's first drop of oversized white graphic tees."
};

export default function ShopPage() {
  return (
    <section className="bg-offwhite py-12 md:py-20">
      <div className="container-pad">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-burgundy">
            The First Drop
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Graphic tees for slower summer days.
          </h1>
          <p className="mt-5 text-base leading-8 text-muted">
            Oversized white tees with nostalgic back prints, thoughtful words,
            and calm streetwear energy.
          </p>
        </div>
        <div className="mt-10">
          <ProductGrid />
        </div>
      </div>
    </section>
  );
}
