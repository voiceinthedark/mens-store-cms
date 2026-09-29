// filepath: packages/api/src/routes/category.routes.ts

import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema } from "../schemas/category.schema";

const router = Router();

// Public route: list all categories (used by storefront filters + CMS)
router.get("/", CategoryController.list);

// Protected route: Admin creates a new category
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  validate(createCategorySchema),
  CategoryController.create,
);

export default router;
