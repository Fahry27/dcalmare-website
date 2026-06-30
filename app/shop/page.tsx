import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Shop First Drop",
  description: "Shop dCalmare's first drop of oversized white graphic tees."
};

export default function ShopPage() {
  return (
    <section className="bg-offwhite py-10 md:py-20">
      <div className="container-pad">
        <div className="max-w-2xl min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
            The First Drop
          </p>
          <h1 className="mt-4 break-words font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">
            Graphic tees for slower summer days.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted md:leading-8">
            Oversized white tees with nostalgic back prints, thoughtful words,
            and calm streetwear energy.
          </p>
        </div>
        <div className="mt-8 md:mt-10">
          <ProductGrid />
        </div>
      </div>
    </section>
  );
}
