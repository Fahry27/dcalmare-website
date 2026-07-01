import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { publicProductWhere } from "@/lib/product-visibility";

const siteUrl = "https://dcalmare-website.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/shop", "/about", "/size-guide", "/faq", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7
  }));

  const products = await prisma.product.findMany({
    where: publicProductWhere,
    select: {
      slug: true,
      updatedAt: true
    }
  }).catch((error) => {
    console.warn("Failed to load products for sitemap.", error);
    return [];
  });

  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  return [...staticRoutes, ...productRoutes];
}
