"use client";

import Link from "next/link";
import { useState } from "react";
import SafeImage from "@/components/SafeImage";
import type { Product } from "@prisma/client";
import { clampQuantity, cn, formatRupiah } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { useCartStore } from "@/store/useCartStore";
import WishlistButton from "./WishlistButton";
import PreOrderProgress from "./PreOrderProgress";

type ProductDetailClientProps = {
  product: Product;
  relatedProducts: Product[];
};

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);

  function updateQuantity(nextQuantity: number) {
    setQuantity(clampQuantity(nextQuantity));
  }

  function handleAddToCart() {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    
    addItem(product, selectedSize, quantity);
  }

  return (
    <>
      <section className="bg-offwhite pb-24 pt-5 md:py-16">
        <div className="container-pad">
          <Link href="/shop" className="inline-flex min-h-11 items-center text-sm font-semibold text-burgundy transition hover:text-burgundy-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite">
            Kembali ke katalog
          </Link>

          <div className="mt-4 grid min-w-0 gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="relative aspect-square max-h-[360px] min-w-0 overflow-hidden border border-burgundy/10 bg-cream sm:aspect-[4/5] sm:max-h-none lg:col-start-1 lg:row-start-1">
              <SafeImage
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-5 sm:p-8 md:p-12"
                fallbackLabel={product.name}
              />
            </div>

            <div className="min-w-0 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div className="mb-3 flex flex-wrap gap-2">
                {product.isBestSeller ? (
                  <span className="bg-burgundy px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:px-3 sm:tracking-[0.18em]">
                    Best Seller
                  </span>
                ) : null}
                {product.isNewArrival ? (
                  <span className="border border-burgundy/20 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-burgundy sm:px-3 sm:tracking-[0.18em]">
                    First Drop
                  </span>
                ) : null}
              </div>
              <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.22em]">
                {product.category}
              </p>
              <h1 className="mt-3 break-words font-serif text-3xl font-semibold leading-tight text-ink min-[360px]:text-4xl md:mt-4 md:text-6xl">
                {product.name}
              </h1>
              <div className="mt-4 flex items-center gap-4">
                <p className="text-xl font-semibold text-burgundy">
                  {formatRupiah(product.price)}
                </p>
                <WishlistButton 
                  product={product} 
                  className="bg-white border border-burgundy/20 rounded-full p-2.5 shadow-sm hover:border-burgundy"
                  iconClassName="w-5 h-5"
                />
              </div>
              <p className="mt-5 text-base leading-relaxed text-muted md:mt-6 md:leading-8">
                {product.description}
              </p>

              {product.isPreOrder && (
                <PreOrderProgress 
                  endDate={product.preOrderEnd}
                  quota={product.preOrderQuota}
                  sold={product.preOrderSold}
                />
              )}

              <dl className="mt-8 grid gap-3 border-y border-burgundy/10 py-6 text-sm">
                <div className="grid grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] gap-4">
                  <dt className="font-semibold text-ink">Material</dt>
                  <dd className="break-words text-right text-muted">{product.material}</dd>
                </div>
                <div className="grid grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] gap-4">
                  <dt className="font-semibold text-ink">Fit</dt>
                  <dd className="break-words text-right text-muted">{product.fit}</dd>
                </div>
                <div className="grid grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] gap-4">
                  <dt className="font-semibold text-ink">Color</dt>
                  <dd className="break-words text-right text-muted">{product.color}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs italic text-muted">
                Oversized fit. Cek panduan ukuran sebelum memesan.
              </p>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold text-ink">Pilih ukuran</label>
                  <Link href="/size-guide" className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.12em] text-burgundy sm:tracking-[0.16em]">
                    Panduan Ukuran
                  </Link>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
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
                    Pilih ukuran terlebih dahulu sebelum lanjut ke pembayaran.
                  </p>
                ) : null}
              </div>

              <div className="mt-7">
                <label htmlFor="quantity" className="text-sm font-semibold text-ink">
                  Jumlah
                </label>
                <div className="mt-3 inline-flex max-w-full border border-burgundy/20 bg-white">
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
                onClick={handleAddToCart}
                className="mt-8 flex min-h-14 w-full items-center justify-center bg-burgundy px-4 text-center text-sm font-semibold uppercase leading-5 tracking-[0.08em] text-white transition hover:bg-burgundy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite sm:px-6 sm:tracking-[0.18em]"
              >
                Add to Cart
              </button>
              
              <p className="mt-4 text-center text-xs text-muted">
                Stok dan ukuran akan dikonfirmasi oleh admin setelah pembayaran.
              </p>

              <div className="mt-8 border border-burgundy/10 bg-white p-5 text-sm">
                <p className="font-semibold text-ink">Cara pemesanan</p>
                <ol className="mt-3 grid gap-2 text-muted">
                  <li className="flex gap-2"><span className="font-semibold text-burgundy">1.</span> Pilih produk</li>
                  <li className="flex gap-2"><span className="font-semibold text-burgundy">2.</span> Checkout sebagai tamu atau member</li>
                  <li className="flex gap-2"><span className="font-semibold text-burgundy">3.</span> Bayar dengan QRIS dan klik Saya Sudah Bayar</li>
                </ol>
              </div>
            </div>

            <div className="relative aspect-[4/5] max-h-[430px] min-w-0 overflow-hidden border border-burgundy/10 bg-cream sm:max-h-none lg:col-start-1 lg:row-start-2">
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
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-burgundy/10 bg-offwhite/95 px-4 py-3 shadow-[0_-12px_30px_rgba(32,20,18,0.12)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-md items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink">{product.name}</p>
              <p className="text-sm font-bold text-burgundy">{formatRupiah(product.price)}</p>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="min-h-11 shrink-0 bg-burgundy px-4 text-xs font-bold uppercase tracking-[0.08em] text-white"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </section>

      <section className="bg-cream py-12 md:py-24">
        <div className="container-pad">
          <h2 className="break-words font-serif text-3xl font-semibold text-ink sm:text-4xl">
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
