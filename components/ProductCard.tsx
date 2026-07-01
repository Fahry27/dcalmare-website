import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import type { Product } from "@prisma/client";
import { formatRupiah } from "@/lib/utils";
import WishlistButton from "./WishlistButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
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
            className="object-contain p-5 transition duration-500 group-hover:scale-[1.03] sm:p-7"
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
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="break-words text-xs font-semibold uppercase tracking-[0.16em] text-burgundy sm:tracking-[0.18em]">
          {product.category}
        </p>
        <h3 className="mt-3 break-words font-serif text-2xl font-semibold leading-tight text-ink">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-muted">
          {formatRupiah(product.price)}
        </p>
        <span className="mt-6 inline-flex min-h-11 w-full items-center justify-center border border-burgundy px-5 text-sm font-semibold uppercase tracking-[0.12em] text-burgundy transition group-hover:bg-burgundy group-hover:text-white group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-burgundy group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-white sm:tracking-[0.16em]">
          View Details
        </span>
      </div>
      </article>
    </Link>
  );
}
