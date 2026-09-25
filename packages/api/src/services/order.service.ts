// filepath: packages/api/src/services/order.service.ts

import { prisma } from "@store/db";
import { CreateOrderInput } from "../schemas/order.schema";

export class OrderService {
  /**
   * Core transactional logic shared by direct order creation and
   * cart checkout. Validates stock, decrements it, computes the total
   * server-side, and creates the Order + OrderItems.
   */
  private static async buildOrderInTransaction(
    tx: any,
    userId: string,
    addressId: string,
    items: { variantId: string; quantity: number }[],
  ) {
    const address = await tx.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) {
      throw new Error("Invalid delivery address");
    }

    let totalAmount = 0;
    const orderItemsData: {
      variantId: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of items) {
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new Error(`Product variant ${item.variantId} not found`);
      }
      if (!variant.product.isActive) {
        throw new Error(
          `Product "${variant.product.name}" is no longer available`,
        );
      }
      if (variant.stockQty < item.quantity) {
        throw new Error(
          `Insufficient stock for "${variant.product.name}" (${variant.size}/${variant.color})`,
        );
      }

      const unitPrice =
        Number(variant.product.basePrice) + Number(variant.priceDelta);
      totalAmount += unitPrice * item.quantity;

      orderItemsData.push({
        variantId: variant.id,
        quantity: item.quantity,
        price: unitPrice,
      });

      await tx.productVariant.update({
        where: { id: variant.id },
        data: { stockQty: { decrement: item.quantity } },
      });
    }

    return tx.order.create({
      data: {
        userId,
        addressId,
        totalAmount,
        items: { create: orderItemsData },
      },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        address: true,
      },
    });
  }

  /**
   * Creates an order for the given user in a single transaction.
   * Validates stock availability, decrements it, and computes the
   * total amount server-side (never trust client-sent prices).
   */
  static async createOrder(userId: string, data: CreateOrderInput) {
    const { addressId, items } = data;

    return prisma.$transaction((tx) =>
      OrderService.buildOrderInTransaction(tx, userId, addressId, items),
    );
  }

  /**
   * Places an order from the user's current cart. On success, the
   * cart is cleared within the same transaction.
   */
  static async checkoutFromCart(userId: string, addressId: string) {
    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Your cart is empty");
      }

      const items = cart.items.map(
        (item: { variantId: string; quantity: number }) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        }),
      );

      const order = await OrderService.buildOrderInTransaction(
        tx,
        userId,
        addressId,
        items,
      );

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });
  }

  static async getOrdersForUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllOrders() {
    return prisma.order.findMany({
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        items: { include: { variant: { include: { product: true } } } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getOrderById(
    id: string,
    userId: string,
    isAdminOrStaff: boolean,
  ) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        address: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }
    if (!isAdminOrStaff && order.userId !== userId) {
      throw new Error("Forbidden: You do not have access to this order");
    }

    return order;
  }

  /**
   * Updates order/payment status. If the order is being cancelled
   * (and wasn't already cancelled), restores stock for each item.
   */
  static async updateOrderStatus(
    id: string,
    data: { status?: string; paymentStatus?: string },
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!order) {
        throw new Error("Order not found");
      }

      // Prevent only status changes after delivery and cancellation
      const isFinalized =
        order.status === "DELIVERED" || order.status === "CANCELLED";
      const isChangingStatus =
        data.status !== undefined && data.status !== order.status;

      if (isFinalized && isChangingStatus) {
        throw new Error(
          `Cannot change the status of an order that is already ${order.status.toLowerCase()}`,
        );
      }

      const isCancelling =
        data.status === "CANCELLED" && order.status !== "CANCELLED";

      if (isCancelling) {
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQty: { increment: item.quantity } },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: data as any,
      });
    });
  }
}
