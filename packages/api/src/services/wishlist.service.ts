// filepath: packages/api/src/services/wishlist.service.ts

import { prisma } from "@store/db";

const wishlistInclude = {
  items: {
    include: {
      variant: { include: { product: true } },
    },
  },
} as const;

export class WishlistService {
  /** Fetches the user's wishlist, creating an empty one if it doesn't exist yet. */
  static async getOrCreateWishlist(userId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: wishlistInclude,
    });

    if (wishlist) return wishlist;

    return prisma.wishlist.create({
      data: { userId },
      include: wishlistInclude,
    });
  }

  /** Adds a variant to the wishlist if it isn't already present. */
  static async addItem(userId: string, variantId: string) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) {
      throw new Error("Product variant not found");
    }

    const wishlist = await WishlistService.getOrCreateWishlist(userId);

    const existing = wishlist.items.find((item) => item.variantId === variantId);
    if (existing) {
      return wishlist;
    }

    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, variantId },
    });

    return prisma.wishlist.findUnique({ where: { userId }, include: wishlistInclude });
  }

  /** Removes a variant from the wishlist. */
  static async removeItem(userId: string, variantId: string) {
    const wishlist = await WishlistService.getOrCreateWishlist(userId);
    const item = wishlist.items.find((i) => i.variantId === variantId);
    if (!item) {
      throw new Error("Item not found in wishlist");
    }

    await prisma.wishlistItem.delete({ where: { id: item.id } });

    return prisma.wishlist.findUnique({ where: { userId }, include: wishlistInclude });
  }

  /** Clears all items from the wishlist. */
  static async clearWishlist(userId: string) {
    const wishlist = await WishlistService.getOrCreateWishlist(userId);
    await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id } });
    return prisma.wishlist.findUnique({ where: { userId }, include: wishlistInclude });
  }
}
