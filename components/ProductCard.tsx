import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import type { Product } from "@/data/products";
import { formatRupiah } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-burgundy/10 bg-white transition hover:-translate-y-1 hover:border-burgundy/25 hover:shadow-xl hover:shadow-burgundy/10">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-cream">
          <SafeImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-7 transition duration-500 group-hover:scale-[1.03]"
            fallbackLabel={product.name}
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.isBestSeller ? (
              <span className="bg-burgundy px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                Best Seller
              </span>
            ) : null}
            {product.isNewArrival ? (
              <span className="bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-burgundy">
                New
              </span>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy">
          {product.category}
        </p>
        <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-2 text-sm font-semibold text-muted">
          {formatRupiah(product.price)}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-6 inline-flex min-h-11 items-center justify-center border border-burgundy px-5 text-sm font-semibold uppercase tracking-[0.16em] text-burgundy transition hover:bg-burgundy hover:text-white"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
