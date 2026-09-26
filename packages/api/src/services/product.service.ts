// filepath: packages/api/src/services/product.service.ts

import { prisma } from "@store/db";

export class ProductService {
  static async getAllProducts() {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    if (products.length === 0) return products;

    // Map each variantId to its parent productId for a single batched lookup
    const variantToProduct = new Map<string, string>();
    for (const product of products) {
      for (const variant of product.variants) {
        variantToProduct.set(variant.id, product.id);
      }
    }

    const allVariantIds = Array.from(variantToProduct.keys());

    // Single query to fetch every relevant review's rating + variantId
    const reviews = await prisma.review.findMany({
      where: { variantId: { in: allVariantIds } },
      select: { variantId: true, rating: true },
    });

    // Aggregate ratings per product in-memory (avoids N+1 aggregate queries)
    const statsByProduct = new Map<string, { sum: number; count: number }>();
    for (const review of reviews) {
      const productId = variantToProduct.get(review.variantId);
      if (!productId) continue;
      const stats = statsByProduct.get(productId) ?? { sum: 0, count: 0 };
      stats.sum += review.rating;
      stats.count += 1;
      statsByProduct.set(productId, stats);
    }

    return products.map((product) => {
      const stats = statsByProduct.get(product.id);
      return {
        ...product,
        averageRating: stats ? stats.sum / stats.count : null,
        reviewCount: stats?.count ?? 0,
      };
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
