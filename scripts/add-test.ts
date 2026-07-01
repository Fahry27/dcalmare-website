import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // 7 days from now

  const testProduct = await prisma.product.upsert({
    where: { slug: "testing-product-rp-1" },
    update: {},
    create: {
      name: "Testing Product Rp 1",
      slug: "testing-product-rp-1",
      category: "Test Category",
      price: 1,
      description: "Ini adalah produk percobaan untuk testing flow checkout dan Midtrans. Harganya cuma Rp 1 perak saja! Ayo dicoba.",
      material: "100% Cotton Digital",
      fit: "Oversized Testing Fit",
      color: "White",
      sizes: ["S", "M", "L", "XL"],
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200",
      lifestyleImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200",
      isBestSeller: true,
      isNewArrival: true,
      isPreOrder: true,
      preOrderEnd: endDate,
      preOrderQuota: 100,
      preOrderSold: 2
    },
  });

  console.log("Added Testing Product:", testProduct);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
