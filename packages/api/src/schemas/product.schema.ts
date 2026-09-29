// filepath: packages/api/src/schemas/product.schema.ts

import { z } from "zod";

const variantSchema = z.object({
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  stockQty: z.number().min(0, "Stock cannot be negative"),
  priceDelta: z.number().optional().default(0),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    slug: z
      .string()
      .min(2)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lower-case and hyphenated",
      ),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    basePrice: z.number().positive("Base price must be greater than 0"),
    categoryId: z.string().uuid("Invalid Category ID format"),
    isFeatured: z.boolean().optional().default(false),
    variants: z
      .array(variantSchema)
      .min(1, "At least one variant is required"),
    images: z.array(z.string().url()).optional().default([]),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Product ID format"),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    basePrice: z.number().positive().optional(),
    categoryId: z.string().uuid().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export const getProductBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug parameter is required"),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Product ID format"),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
