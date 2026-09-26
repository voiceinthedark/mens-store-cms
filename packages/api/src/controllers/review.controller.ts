// filepath: packages/api/src/controllers/review.controller.ts

import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { ReviewService } from "../services/review.service";

/**
 * ReviewController handles product reviews left by customers.
 */
export class ReviewController {
  /** Authenticated user creates a review for a product variant. */
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const review = await ReviewService.createReview(req.user!.userId, req.body);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Public: list all reviews for a given product variant. */
  static async listForVariant(req: AuthenticatedRequest, res: Response) {
    try {
      const reviews = await ReviewService.getReviewsForVariant(req.params.variantId);
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Authenticated user lists their own reviews. */
  static async listMine(req: AuthenticatedRequest, res: Response) {
    try {
      const reviews = await ReviewService.getReviewsForUser(req.user!.userId);
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Author updates their own review. */
  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const review = await ReviewService.updateReview(
        req.params.id,
        req.user!.userId,
        req.body,
      );
      res.status(200).json(review);
    } catch (error: any) {
      const status = error.message.startsWith("Forbidden") ? 403 : 400;
      res.status(status).json({ error: error.message });
    }
  }

  /** Author or Admin/Staff deletes a review. */
  static async remove(req: AuthenticatedRequest, res: Response) {
    try {
      const isAdminOrStaff = req.user!.role === "ADMIN" || req.user!.role === "STAFF";
      await ReviewService.deleteReview(req.params.id, req.user!.userId, isAdminOrStaff);
      res.status(204).send();
    } catch (error: any) {
      const status = error.message.startsWith("Forbidden") ? 403 : 400;
      res.status(status).json({ error: error.message });
    }
  }
}
