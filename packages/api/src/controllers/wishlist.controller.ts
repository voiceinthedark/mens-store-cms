// filepath: packages/api/src/controllers/wishlist.controller.ts

import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { WishlistService } from "../services/wishlist.service";

/**
 * WishlistController handles the authenticated user's wishlist.
 */
export class WishlistController {
  /** Get the current user's wishlist (auto-creates if none exists). */
  static async getWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      const wishlist = await WishlistService.getOrCreateWishlist(req.user!.userId);
      res.status(200).json(wishlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Add a variant to the wishlist. */
  static async addItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { variantId } = req.body;
      const wishlist = await WishlistService.addItem(req.user!.userId, variantId);
      res.status(200).json(wishlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Remove a variant from the wishlist. */
  static async removeItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { variantId } = req.params;
      const wishlist = await WishlistService.removeItem(req.user!.userId, variantId);
      res.status(200).json(wishlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Clear the wishlist entirely. */
  static async clearWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      const wishlist = await WishlistService.clearWishlist(req.user!.userId);
      res.status(200).json(wishlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
