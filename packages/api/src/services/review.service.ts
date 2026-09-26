// filepath: packages/api/src/services/review.service.ts

import { prisma } from "@store/db";

export class ReviewService {
  /**
   * Creates a review for a product variant. A user may only review
   * a given variant once (enforced here at the application level),
   * and only if they have a delivered order containing that variant.
   */
  static async createReview(
    userId: string,
    data: { variantId: string; rating: number; comment?: string },
  ) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: data.variantId },
    });
    if (!variant) {
      throw new Error("Product variant not found");
    }

    const existing = await prisma.review.findFirst({
      where: { userId, variantId: data.variantId },
    });
    if (existing) {
      throw new Error("You have already reviewed this product");
    }

    const verifiedPurchase = await prisma.orderItem.findFirst({
      where: {
        variantId: data.variantId,
        order: { userId, status: "DELIVERED" },
      },
    });
    if (!verifiedPurchase) {
      throw new Error(
        "You can only review products from a delivered order",
      );
    }

    return prisma.review.create({
      data: {
        userId,
        variantId: data.variantId,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }

  /** Lists all reviews for a given product variant, most recent first. */
  static async getReviewsForVariant(variantId: string) {
    return prisma.review.findMany({
      where: { variantId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Lists the authenticated user's own reviews. */
  static async getReviewsForUser(userId: string) {
    return prisma.review.findMany({
      where: { userId },
      include: {
        variant: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Updates a review. Only the review's author may update it. */
  static async updateReview(
    id: string,
    userId: string,
    data: { rating?: number; comment?: string },
  ) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new Error("Review not found");
    }
    if (review.userId !== userId) {
      throw new Error("Forbidden: You can only edit your own reviews");
    }

    return prisma.review.update({ where: { id }, data });
  }

  /** Deletes a review. The author or an Admin/Staff may delete it. */
  static async deleteReview(id: string, userId: string, isAdminOrStaff: boolean) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new Error("Review not found");
    }
    if (!isAdminOrStaff && review.userId !== userId) {
      throw new Error("Forbidden: You can only delete your own reviews");
    }

    await prisma.review.delete({ where: { id } });
  }
}
