import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialProducts = [
  {
    name: "500 Million Tee",
    slug: "500-million-tee",
    category: "Statement Tee",
    price: 218888,
    description: "Oversized white tee with raw handwritten back print. A bold reminder that sometimes all you need is a dream big enough to move you.",
    material: "Cotton combed",
    fit: "Oversized / boxy",
    color: "White",
    sizes: ["M", "L", "XL"],
    image: "/products/500-million-tee.jpg",
    lifestyleImage: "/products/500-million-tee-lifestyle.jpg",
    isBestSeller: true,
    isNewArrival: true,
    isPreOrder: true,
    preOrderEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    preOrderQuota: 50,
    preOrderSold: 12
  },
  {
    name: "Bottle Collection Tee",
    slug: "bottle-collection-tee",
    category: "Art Graphic Tee",
    price: 218888,
    description: "An oversized white tee featuring summer-inspired bottle artwork. Clean from the front, nostalgic from the back.",
    material: "Cotton combed",
    fit: "Oversized / boxy",
    color: "White",
    sizes: ["M", "L", "XL"],
    image: "/products/bottle-collection-tee.jpg",
    lifestyleImage: "/products/bottle-collection-tee-lifestyle.jpg",
    isBestSeller: false,
    isNewArrival: true,
    isPreOrder: true,
    preOrderEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    preOrderQuota: 30,
    preOrderSold: 28
  },
  {
    name: "Matcha Champagne Tee",
    slug: "matcha-champagne-tee",
    category: "Statement Graphic Tee",
    price: 218888,
    description: "A playful graphic tee combining champagne imagery, handwritten words, and everyday culture into one expressive back print.",
    material: "Cotton combed",
    fit: "Oversized / boxy",
    color: "White",
    sizes: ["M", "L", "XL"],
    image: "/products/matcha-champagne-tee.jpg",
    lifestyleImage: "/products/matcha-champagne-tee-lifestyle.jpg",
    isBestSeller: true,
    isNewArrival: true,
    isPreOrder: true,
    preOrderEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    preOrderQuota: 40,
    preOrderSold: 15
  }
];

async function main() {
  console.log("Start seeding products...");
  
  for (const product of initialProducts) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    
    if (!existing) {
      await prisma.product.create({
        data: product
      });
      console.log(`Created product: ${product.name}`);
    } else {
      console.log(`Product already exists: ${product.name}, updating...`);
      await prisma.product.update({
        where: { slug: product.slug },
        data: product
      });
    }
  }
  
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
