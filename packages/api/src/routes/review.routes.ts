// filepath: packages/api/src/routes/review.routes.ts

import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createReviewSchema,
  updateReviewSchema,
  deleteReviewSchema,
  getReviewsByVariantSchema,
} from "../schemas/review.schema";

const router = Router();

// Public: view reviews for a product variant
router.get(
  "/variant/:variantId",
  validate(getReviewsByVariantSchema),
  ReviewController.listForVariant,
);

// Everything below requires authentication
router.use(authenticate);

router.post("/", validate(createReviewSchema), ReviewController.create);
router.get("/mine", ReviewController.listMine);
router.patch("/:id", validate(updateReviewSchema), ReviewController.update);
router.delete("/:id", validate(deleteReviewSchema), ReviewController.remove);

export default router;
