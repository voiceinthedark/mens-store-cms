// filepath: packages/api/src/schemas/order.schema.ts

import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    addressId: z.string().uuid("Invalid Address ID format"),
    items: z
      .array(
        z.object({
          variantId: z.string().uuid("Invalid Variant ID format"),
          quantity: z.number().int().positive("Quantity must be at least 1"),
        }),
      )
      .min(1, "Order must contain at least one item"),
  }),
});

export const checkoutSchema = z.object({
  body: z.object({
    addressId: z.string().uuid("Invalid Address ID format"),
  }),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Order ID format"),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Order ID format"),
  }),
  body: z.object({
    status: z
      .enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
      .optional(),
    paymentStatus: z
      .enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"])
      .optional(),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
export type CheckoutInput = z.infer<typeof checkoutSchema>["body"];
export type UpdateOrderStatusInput = z.infer<
  typeof updateOrderStatusSchema
>["body"];
