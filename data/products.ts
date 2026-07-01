export type Product = {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  material: string;
  fit: string;
  color: string;
  sizes: string[];
  image: string;
  lifestyleImage: string;
  isBestSeller: boolean;
  isNewArrival: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: "500 Million Tee",
    slug: "500-million-tee",
    category: "Statement Tee",
    price: 218888,
    description:
      "Oversized white tee with raw handwritten back print. A bold reminder that sometimes all you need is a dream big enough to move you.",
    material: "Cotton combed",
    fit: "Oversized / boxy",
    color: "White",
    sizes: ["M", "L", "XL"],
    image: "/products/500-million-tee.jpg",
    lifestyleImage: "/products/500-million-tee-lifestyle.jpg",
    isBestSeller: true,
    isNewArrival: true
  },
  {
    id: 2,
    name: "Bottle Collection Tee",
    slug: "bottle-collection-tee",
    category: "Art Graphic Tee",
    price: 218888,
    description:
      "An oversized white tee featuring summer-inspired bottle artwork. Clean from the front, nostalgic from the back.",
    material: "Cotton combed",
    fit: "Oversized / boxy",
    color: "White",
    sizes: ["M", "L", "XL"],
    image: "/products/bottle-collection-tee.jpg",
    lifestyleImage: "/products/bottle-collection-tee-lifestyle.jpg",
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: 3,
    name: "Matcha Champagne Tee",
    slug: "matcha-champagne-tee",
    category: "Statement Graphic Tee",
    price: 218888,
    description:
      "A playful graphic tee combining champagne imagery, handwritten words, and everyday culture into one expressive back print.",
    material: "Cotton combed",
    fit: "Oversized / boxy",
    color: "White",
    sizes: ["M", "L", "XL"],
    image: "/products/matcha-champagne-tee.jpg",
    lifestyleImage: "/products/matcha-champagne-tee-lifestyle.jpg",
    isBestSeller: true,
    isNewArrival: true
  }
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
