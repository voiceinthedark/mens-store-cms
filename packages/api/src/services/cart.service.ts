// filepath: packages/api/src/services/cart.service.ts

import { prisma } from "@store/db";

const cartInclude = {
  items: {
    include: {
      variant: { include: { product: true } },
    },
  },
} as const;

export class CartService {
  /** Fetches the user's cart, creating an empty one if it doesn't exist yet. */
  static async getOrCreateCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });

    if (cart) return cart;

    return prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  }

  /** Adds a variant to the cart, or increments quantity if it's already present. */
  static async addItem(userId: string, variantId: string, quantity: number) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });
    if (!variant) {
      throw new Error("Product variant not found");
    }
    if (!variant.product.isActive) {
      throw new Error(`Product "${variant.product.name}" is no longer available`);
    }
    if (variant.stockQty < quantity) {
      throw new Error(`Insufficient stock for "${variant.product.name}"`);
    }

    const cart = await CartService.getOrCreateCart(userId);

    const existingItem = cart.items.find((item) => item.variantId === variantId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (variant.stockQty < newQuantity) {
        throw new Error(`Insufficient stock for "${variant.product.name}"`);
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, variantId, quantity },
      });
    }

    return prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  }

  /** Sets the exact quantity for a cart line item. */
  static async updateItemQuantity(userId: string, variantId: string, quantity: number) {
    const cart = await CartService.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.variantId === variantId);
    if (!item) {
      throw new Error("Item not found in cart");
    }

    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant || variant.stockQty < quantity) {
      throw new Error("Insufficient stock for requested quantity");
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  }

  /** Removes a single line item from the cart. */
  static async removeItem(userId: string, variantId: string) {
    const cart = await CartService.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.variantId === variantId);
    if (!item) {
      throw new Error("Item not found in cart");
    }

    await prisma.cartItem.delete({ where: { id: item.id } });

    return prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  }

  /** Clears all items from the user's cart. */
  static async clearCart(userId: string) {
    const cart = await CartService.getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  }
}
