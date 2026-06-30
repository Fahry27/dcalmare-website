import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

type ProductGridProps = {
  limit?: number;
};

export default function ProductGrid({ limit }: ProductGridProps) {
  const visibleProducts =
    typeof limit === "number" ? products.slice(0, limit) : products;

  return (
    <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
