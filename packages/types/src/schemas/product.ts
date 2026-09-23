import { z } from "zod";

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
  }),
});

export const getProductBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug parameter is required"),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
