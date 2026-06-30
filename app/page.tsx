import type { Metadata } from "next";
import Link from "next/link";
import BrandManifesto from "@/components/BrandManifesto";
import FAQSection from "@/components/FAQSection";
import HeroSection from "@/components/HeroSection";
import HowToOrder from "@/components/HowToOrder";
import ProductGrid from "@/components/ProductGrid";
import SafeImage from "@/components/SafeImage";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "dCalmare | One summer can change everything",
  description:
    "Shop dCalmare's first drop of summer-inspired oversized white graphic tees."
};

export default function HomePage() {
  const highlightedProduct = products[0];

  return (
    <>
      <HeroSection />

      <section className="bg-offwhite py-16 md:py-24">
        <div className="container-pad">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-burgundy">
                First Drop
              </p>
              <h2 className="mt-4 font-serif text-4xl font-semibold text-ink md:text-5xl">
                Oversized white graphic tees.
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-burgundy transition hover:text-burgundy-soft"
            >
              Shop all
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid />
          </div>
        </div>
      </section>

      <BrandManifesto />

      <section className="bg-burgundy-dark py-16 text-offwhite md:py-24">
        <div className="container-pad grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/5] bg-cream">
            <SafeImage
              src={highlightedProduct.lifestyleImage}
              alt={`${highlightedProduct.name} styled flat lay`}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              fallbackLabel={highlightedProduct.name}
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cream">
              Product Highlight
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white md:text-6xl">
              {highlightedProduct.name}
            </h2>
            <p className="mt-5 text-base leading-8 text-offwhite/75">
              {highlightedProduct.description}
            </p>
            <dl className="mt-8 grid gap-3 text-sm text-offwhite/75">
              <div className="flex justify-between gap-5 border-b border-white/10 pb-3">
                <dt>Material</dt>
                <dd>{highlightedProduct.material}</dd>
              </div>
              <div className="flex justify-between gap-5 border-b border-white/10 pb-3">
                <dt>Fit</dt>
                <dd>{highlightedProduct.fit}</dd>
              </div>
              <div className="flex justify-between gap-5 border-b border-white/10 pb-3">
                <dt>Color</dt>
                <dd>{highlightedProduct.color}</dd>
              </div>
            </dl>
            <Link
              href={`/product/${highlightedProduct.slug}`}
              className="mt-8 inline-flex min-h-12 items-center justify-center bg-offwhite px-7 text-sm font-semibold uppercase tracking-[0.18em] text-burgundy transition hover:bg-cream"
            >
              View Details
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-offwhite py-16 md:py-24">
        <div className="container-pad">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-burgundy">
              Why dCalmare
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-ink md:text-5xl">
              Calm, nostalgic, and made with meaning.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Summer-inspired lifestyle graphics",
              "Clean front, meaningful back print",
              "Premium local streetwear energy"
            ].map((item) => (
              <article key={item} className="border border-burgundy/12 bg-white p-6">
                <h3 className="font-serif text-2xl font-semibold text-ink">
                  {item}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Built for slow afternoons, weekend plans, and memories that
                  feel warmer every time you wear them.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HowToOrder />
      <FAQSection limit={4} showLink />
    </>
  );
}
