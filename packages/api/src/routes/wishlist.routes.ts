// filepath: packages/api/src/routes/wishlist.routes.ts

import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  addWishlistItemSchema,
  removeWishlistItemSchema,
} from "../schemas/wishlist.schema";

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

router.get("/", WishlistController.getWishlist);
router.post("/items", validate(addWishlistItemSchema), WishlistController.addItem);
router.delete(
  "/items/:variantId",
  validate(removeWishlistItemSchema),
  WishlistController.removeItem,
);
router.delete("/", WishlistController.clearWishlist);

export default router;
