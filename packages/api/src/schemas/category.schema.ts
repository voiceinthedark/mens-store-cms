// filepath: packages/api/src/schemas/category.schema.ts

import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
    slug: z
      .string()
      .min(2)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lower-case and hyphenated",
      ),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"];
