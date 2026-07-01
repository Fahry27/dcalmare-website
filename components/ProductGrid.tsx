import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

import ScrollReveal from "@/components/ScrollReveal";

type ProductGridProps = {
  limit?: number;
};

export default function ProductGrid({ limit }: ProductGridProps) {
  const visibleProducts =
    typeof limit === "number" ? products.slice(0, limit) : products;

  return (
    <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibleProducts.map((product, index) => (
        <ScrollReveal key={product.id} delay={index * 0.1}>
          <ProductCard product={product} />
        </ScrollReveal>
      ))}
    </div>
  );
}
