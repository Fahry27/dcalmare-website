import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import prisma from "@/lib/prisma";
import { publicProductBySlug, publicProductWhere } from "@/lib/product-visibility";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({ where: publicProductBySlug(slug) });

  if (!product) {
    return {
      title: "Product Not Found"
    };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/product/${product.slug}`
    },
    openGraph: {
      title: `${product.name} | dCalmare`,
      description: product.description,
      url: `/product/${product.slug}`,
      images: [
        {
          url: product.image,
          alt: product.name
        }
      ],
      type: "website"
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({ where: publicProductBySlug(slug) });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      AND: [
        publicProductWhere,
        { slug: { not: slug } }
      ]
    },
    take: 2,
    orderBy: { createdAt: "desc" }
  });

  return <ProductDetailClient product={product as any} relatedProducts={relatedProducts as any} />;
}
