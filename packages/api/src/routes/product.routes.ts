import { Router } from "express";
import { ProductService } from "../services/product.service";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductSchema,
  getProductBySlugSchema,
} from "../schemas/product.schema";

const router = Router();

// Public route: Get product by slug
router.get(
  "/:slug",
  validate(getProductBySlugSchema),
  async (req: any, res: any) => {
    const product = await ProductService.getSingleProduct(req.params.slug);
    res.json(product);
  },
);

// Protected route: Admin create product
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  validate(createProductSchema),
  async (req, res) => {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

export default router;
