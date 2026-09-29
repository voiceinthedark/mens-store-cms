// filepath: packages/api/src/routes/product.routes.ts

import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductBySlugSchema,
  getProductByIdSchema,
} from "../schemas/product.schema";

const router = Router();

// Public route: list all products (storefront + CMS catalog view)
router.get("/", ProductController.list);

// Public route: get product by slug (storefront product page)
router.get(
  "/slug/:slug",
  validate(getProductBySlugSchema),
  ProductController.getBySlug,
);

// Protected route: Admin/Staff get product by id (CMS edit page)
router.get(
  "/:id",
  authenticate,
  authorize(["ADMIN", "STAFF"]),
  validate(getProductByIdSchema),
  ProductController.getById,
);

// Protected route: Admin create product
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  validate(createProductSchema),
  ProductController.create,
);

// Protected route: Admin update product
router.patch(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validate(updateProductSchema),
  ProductController.update,
);

// Protected route: Admin delete product
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validate(getProductByIdSchema),
  ProductController.remove,
);

export default router;
