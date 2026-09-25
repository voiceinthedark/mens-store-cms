// filepath: packages/api/src/routes/cart.routes.ts

import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  addCartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../schemas/cart.schema";

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get("/", CartController.getCart);
router.post("/items", validate(addCartItemSchema), CartController.addItem);
router.patch(
  "/items/:variantId",
  validate(updateCartItemSchema),
  CartController.updateItem,
);
router.delete(
  "/items/:variantId",
  validate(removeCartItemSchema),
  CartController.removeItem,
);
router.delete("/", CartController.clearCart);

export default router;
