import type { Prisma } from "@prisma/client";

export const publicProductWhere: Prisma.ProductWhereInput = {
  NOT: [
    { slug: { startsWith: "testing-" } },
    { category: { equals: "Test Category", mode: "insensitive" } }
  ]
};

export function publicProductBySlug(slug: string): Prisma.ProductWhereInput {
  return {
    slug,
    AND: [publicProductWhere]
  };
}
