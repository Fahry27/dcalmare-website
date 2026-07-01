"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);

  return (
    <section className="bg-offwhite py-12 md:py-24 min-h-[70vh]">
      <div className="container-pad">
        <div className="max-w-2xl min-w-0 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
            Your Favorites
          </p>
          <h1 className="mt-4 break-words font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Wishlist.
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-burgundy/10 bg-white">
            <p className="text-muted mb-6">Belum ada produk di wishlist Anda.</p>
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center bg-burgundy px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-burgundy-dark sm:tracking-[0.18em]"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.1}>
                <ProductCard product={product as any} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
