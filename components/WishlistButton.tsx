"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import { Product } from "@prisma/client";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type WishlistButtonProps = {
  product: Product;
  className?: string;
  iconClassName?: string;
};

export default function WishlistButton({ product, className = "", iconClassName = "" }: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className={`flex items-center justify-center ${className}`}>
        <Heart className={`opacity-30 ${iconClassName}`} />
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlist) {
          removeItem(product.id);
        } else {
          addItem(product);
        }
      }}
      className={`flex items-center justify-center transition hover:scale-110 active:scale-95 ${className}`}
      aria-label="Toggle Wishlist"
    >
      <Heart
        className={`transition ${iconClassName} ${
          isInWishlist ? "fill-burgundy text-burgundy" : "text-burgundy/50 hover:text-burgundy"
        }`}
      />
    </button>
  );
}
