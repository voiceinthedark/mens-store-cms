// filepath: packages/api/src/schemas/review.schema.ts

import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    variantId: z.string().uuid("Invalid Variant ID format"),
    rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z.string().max(1000, "Comment is too long").optional(),
  }),
});

export const updateReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Review ID format"),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().max(1000, "Comment is too long").optional(),
  }),
});

export const deleteReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Review ID format"),
  }),
});

export const getReviewsByVariantSchema = z.object({
  params: z.object({
    variantId: z.string().uuid("Invalid Variant ID format"),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>["body"];
