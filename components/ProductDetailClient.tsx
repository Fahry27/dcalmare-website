"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import SafeImage from "@/components/SafeImage";
import type { Product } from "@/data/products";
import { products } from "@/data/products";
import { clampQuantity, cn, formatRupiah } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

type ProductDetailClientProps = {
  product: Product;
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);

  const relatedProducts = useMemo(
    () => products.filter((item) => item.slug !== product.slug).slice(0, 2),
    [product.slug]
  );

  function updateQuantity(nextQuantity: number) {
    setQuantity(clampQuantity(nextQuantity));
  }

  function continueToCheckout() {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }

    const params = new URLSearchParams({
      product: product.slug,
      size: selectedSize,
      qty: String(quantity)
    });

    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <>
      <section className="bg-offwhite py-10 md:py-16">
        <div className="container-pad">
          <Link href="/shop" className="text-sm font-semibold text-burgundy">
            Back to shop
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="grid gap-4">
              <div className="relative aspect-[4/5] border border-burgundy/10 bg-cream">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-8 md:p-12"
                  fallbackLabel={product.name}
                />
              </div>
              <div className="relative aspect-[4/5] border border-burgundy/10 bg-cream">
                <SafeImage
                  src={product.lifestyleImage}
                  alt={`${product.name} lifestyle styling`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  fallbackLabel={`${product.name} lifestyle`}
                />
              </div>
            </div>

            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-burgundy">
                {product.category}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-ink md:text-6xl">
                {product.name}
              </h1>
              <p className="mt-4 text-xl font-semibold text-burgundy">
                {formatRupiah(product.price)}
              </p>
              <p className="mt-6 text-base leading-8 text-muted">
                {product.description}
              </p>

              <dl className="mt-8 grid gap-3 border-y border-burgundy/10 py-6 text-sm">
                <div className="flex justify-between gap-6">
                  <dt className="font-semibold text-ink">Material</dt>
                  <dd className="text-right text-muted">{product.material}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="font-semibold text-ink">Fit</dt>
                  <dd className="text-right text-muted">{product.fit}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="font-semibold text-ink">Color</dt>
                  <dd className="text-right text-muted">{product.color}</dd>
                </div>
              </dl>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold text-ink">Select size</label>
                  <Link href="/size-guide" className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">
                    Size guide
                  </Link>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={cn(
                        "min-h-12 border text-sm font-semibold transition",
                        selectedSize === size
                          ? "border-burgundy bg-burgundy text-white"
                          : "border-burgundy/20 bg-white text-ink hover:border-burgundy"
                      )}
                      onClick={() => {
                        setSelectedSize(size);
                        setShowSizeError(false);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {showSizeError ? (
                  <p className="mt-3 text-sm font-medium text-burgundy">
                    Please select a size before continuing to checkout.
                  </p>
                ) : null}
              </div>

              <div className="mt-7">
                <label htmlFor="quantity" className="text-sm font-semibold text-ink">
                  Quantity
                </label>
                <div className="mt-3 inline-flex border border-burgundy/20 bg-white">
                  <button
                    type="button"
                    className="h-12 w-12 text-xl text-burgundy transition hover:bg-cream"
                    onClick={() => updateQuantity(quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => updateQuantity(Number(event.target.value))}
                    className="h-12 w-16 border-x border-burgundy/20 bg-white text-center text-sm font-semibold outline-none"
                  />
                  <button
                    type="button"
                    className="h-12 w-12 text-xl text-burgundy transition hover:bg-cream"
                    onClick={() => updateQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={continueToCheckout}
                className="mt-8 flex min-h-13 w-full items-center justify-center bg-burgundy px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-burgundy-dark"
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="container-pad">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Related products
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
