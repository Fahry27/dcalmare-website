import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import type { Product } from "@prisma/client";
import { formatRupiah } from "@/lib/utils";
import { getActiveProductPrice, REGULAR_PRICE } from "@/lib/pricing";
import WishlistButton from "./WishlistButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const activePrice = getActiveProductPrice(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block h-full min-w-0 overflow-hidden border border-burgundy/10 bg-white transition hover:-translate-y-1 hover:border-burgundy/25 hover:shadow-xl hover:shadow-burgundy/10"
    >
      <article className="flex h-full min-w-0 flex-col">
        <div className="relative aspect-[4/5] bg-cream">
          <SafeImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-3 transition duration-500 group-hover:scale-[1.03] sm:p-7"
            fallbackLabel={product.name}
          />
          <div className="absolute left-3 right-3 top-3 flex items-start justify-between sm:left-4 sm:right-4 sm:top-4">
            <div className="flex flex-wrap gap-2">
              {product.isBestSeller ? (
                <span className="bg-burgundy px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:px-3 sm:tracking-[0.18em]">
                  Best Seller
                </span>
              ) : null}
              {product.isNewArrival ? (
                <span className="bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-burgundy sm:px-3 sm:tracking-[0.18em]">
                  New
                </span>
              ) : null}
            </div>
            <WishlistButton 
              product={product as any} 
              className="bg-white rounded-full p-2 shadow-sm"
              iconClassName="w-4 h-4"
            />
          </div>
        </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="break-words text-[10px] font-semibold uppercase tracking-[0.12em] text-burgundy sm:text-xs sm:tracking-[0.18em]">
          {product.category}
        </p>
        <h3 className="mt-2 break-words font-serif text-lg font-semibold leading-tight text-ink sm:mt-3 sm:text-2xl">
          {product.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-burgundy">
            {formatRupiah(activePrice)}
          </p>
          {product.isPreOrder ? (
            <p className="text-xs font-medium text-muted line-through">
              {formatRupiah(REGULAR_PRICE)}
            </p>
          ) : null}
        </div>
        <span className="mt-4 inline-flex min-h-10 w-full items-center justify-center border border-burgundy px-3 text-xs font-semibold uppercase tracking-[0.08em] text-burgundy transition group-hover:bg-burgundy group-hover:text-white group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-burgundy group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-white sm:mt-6 sm:min-h-11 sm:px-5 sm:text-sm sm:tracking-[0.16em]">
          Pilih Produk
        </span>
      </div>
      </article>
    </Link>
  );
}
