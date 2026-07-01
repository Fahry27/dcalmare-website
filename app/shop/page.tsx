import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";
import ShopFilter from "@/components/ShopFilter";
import { Suspense } from "react";
import { Prisma } from "@prisma/client";
import { publicProductWhere } from "@/lib/product-visibility";

export const metadata: Metadata = {
  title: "Shop First Drop",
  description: "Shop dCalmare's first drop of oversized white graphic tees.",
  alternates: {
    canonical: "/shop"
  }
};

export const dynamic = "force-dynamic";

type ShopPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;

  const where: Prisma.ProductWhereInput = {
    AND: [publicProductWhere]
  };
  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }
  if (category) {
    where.category = category;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy
  });

  return (
    <section className="bg-offwhite py-7 md:py-20 min-h-screen">
      <div className="container-pad">
        <div className="max-w-2xl min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
            The First Drop
          </p>
          <h1 className="mt-3 break-words font-serif text-3xl font-semibold leading-tight text-ink min-[360px]:text-4xl sm:text-5xl md:text-6xl">
            Graphic tees for slower summer days.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base md:leading-8">
            Oversized white tees with nostalgic back prints, thoughtful words,
            and calm streetwear energy.
          </p>
        </div>
        
        <div className="mt-6 md:mt-12">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ShopFilter />
          </Suspense>

          {products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted">Tidak ada produk yang cocok dengan pencarian Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-4">
              {products.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 0.1}>
                  <ProductCard product={product as any} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
