// filepath: packages/api/src/services/product.service.ts

import { prisma } from "@store/db";

export class ProductService {
  static async getAllProducts() {
    return prisma.product.findMany({
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });
  }

  static async createProduct(data: {
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    categoryId: string;
  }) {
    return prisma.product.create({
      data,
      include: { category: true },
    });
  }

  /** Fetches a single product by its slug, including its category,
   * variants, and images.
   * Also returns a computed average rating based on review counts and ratings if available.
   * @param slug - The unique slug identifier for the product.
   * */
  static async getSingleProduct(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    if (!product) return null;

    const variantIds = product.variants.map((v) => v.id);
    const ratingStats = await prisma.review.aggregate({
      where: { variantId: { in: variantIds } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      ...product,
      averageRating: ratingStats._avg.rating ?? null,
      reviewCount: ratingStats._count.rating,
    };
  }
}
