// filepath: packages/api/src/schemas/wishlist.schema.ts

import { z } from "zod";

export const addWishlistItemSchema = z.object({
  body: z.object({
    variantId: z.string().uuid("Invalid Variant ID format"),
  }),
});

export const removeWishlistItemSchema = z.object({
  params: z.object({
    variantId: z.string().uuid("Invalid Variant ID format"),
  }),
});

export type AddWishlistItemInput = z.infer<typeof addWishlistItemSchema>["body"];
