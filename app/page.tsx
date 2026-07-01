import type { Metadata } from "next";
import Link from "next/link";
import BrandManifesto from "@/components/BrandManifesto";
import FAQSection from "@/components/FAQSection";
import HeroSection from "@/components/HeroSection";
import HowToOrder from "@/components/HowToOrder";
import ProductGrid from "@/components/ProductGrid";
import SafeImage from "@/components/SafeImage";
import prisma from "@/lib/prisma";
import { publicProductWhere } from "@/lib/product-visibility";

export const metadata: Metadata = {
  title: "dCalmare | One summer can change everything",
  description:
    "Shop dCalmare's first drop of summer-inspired oversized white graphic tees."
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: publicProductWhere,
    orderBy: { createdAt: "asc" }
  });
  const highlightedProduct = products[0];

  return (
    <>
      <HeroSection />

      <section className="bg-offwhite py-12 md:py-24">
        <div className="container-pad">
          <div className="flex min-w-0 flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
                First Drop
              </p>
              <h2 className="mt-4 break-words font-serif text-3xl font-semibold leading-tight text-ink min-[360px]:text-4xl md:text-5xl">
                Oversized white graphic tees.
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.12em] text-burgundy transition hover:text-burgundy-soft sm:tracking-[0.18em]"
            >
              Shop all
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid products={products} limit={3} />
          </div>
        </div>
      </section>

      <BrandManifesto />

      <section className="bg-burgundy-dark py-12 text-offwhite md:py-24">
        <div className="container-pad grid min-w-0 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/5] max-h-[430px] min-w-0 overflow-hidden bg-cream md:max-h-none">
            <SafeImage
              src={highlightedProduct.lifestyleImage}
              alt={`${highlightedProduct.name} styled flat lay`}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              fallbackLabel={highlightedProduct.name}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream sm:tracking-[0.24em]">
              Product Highlight
            </p>
            <h2 className="mt-4 break-words font-serif text-3xl font-semibold leading-tight text-white min-[360px]:text-4xl md:text-6xl">
              {highlightedProduct.name}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-offwhite/75 md:leading-8">
              {highlightedProduct.description}
            </p>
            <dl className="mt-8 grid gap-3 text-sm text-offwhite/75">
              <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 border-b border-white/10 pb-3">
                <dt>Material</dt>
                <dd className="break-words text-right">{highlightedProduct.material}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 border-b border-white/10 pb-3">
                <dt>Fit</dt>
                <dd className="break-words text-right">{highlightedProduct.fit}</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 border-b border-white/10 pb-3">
                <dt>Color</dt>
                <dd className="break-words text-right">{highlightedProduct.color}</dd>
              </div>
            </dl>
            <Link
              href={`/product/${highlightedProduct.slug}`}
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center bg-offwhite px-5 text-center text-sm font-semibold uppercase tracking-[0.1em] text-burgundy transition hover:bg-white hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy-dark sm:w-auto sm:px-7 sm:tracking-[0.18em]"
            >
              View Details
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-offwhite py-12 md:py-24">
        <div className="container-pad">
          <div className="max-w-2xl min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
              Why dCalmare
            </p>
            <h2 className="mt-4 break-words font-serif text-3xl font-semibold leading-tight text-ink min-[360px]:text-4xl md:text-5xl">
              Calm, nostalgic, and made with meaning.
            </h2>
          </div>
          <div className="mt-8 grid min-w-0 gap-5 md:mt-10 md:grid-cols-3">
            {[
              "Summer-inspired lifestyle graphics",
              "Clean front, meaningful back print",
              "Premium local streetwear energy"
            ].map((item) => (
              <article key={item} className="min-w-0 border border-burgundy/12 bg-white p-5 sm:p-6">
                <h3 className="break-words font-serif text-2xl font-semibold leading-tight text-ink">
                  {item}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted md:text-sm md:leading-7">
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
