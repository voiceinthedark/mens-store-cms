// filepath: packages/api/src/services/order.service.ts

import { prisma } from "@store/db";
import { CreateOrderInput } from "../schemas/order.schema";

export class OrderService {
  /**
   * Creates an order for the given user in a single transaction.
   * Validates stock availability, decrements it, and computes the
   * total amount server-side (never trust client-sent prices).
   */
  static async createOrder(userId: string, data: CreateOrderInput) {
    const { addressId, items } = data;

    return prisma.$transaction(async (tx) => {
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

      const order = await tx.order.create({
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

  static async updateOrderStatus(
    id: string,
    data: { status?: string; paymentStatus?: string },
  ) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new Error("Order not found");
    }

    return prisma.order.update({
      where: { id },
      data: data as any,
    });
  }
}
