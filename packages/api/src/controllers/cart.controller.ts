// filepath: packages/api/src/controllers/cart.controller.ts

import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CartService } from "../services/cart.service";

/**
 * CartController handles the authenticated user's shopping cart.
 */
export class CartController {
  /** Get the current user's cart (auto-creates if none exists). */
  static async getCart(req: AuthenticatedRequest, res: Response) {
    try {
      const cart = await CartService.getOrCreateCart(req.user!.userId);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Add an item to the cart (or increment quantity if already present). */
  static async addItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { variantId, quantity } = req.body;
      const cart = await CartService.addItem(req.user!.userId, variantId, quantity);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Update the quantity of a specific cart item. */
  static async updateItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { variantId } = req.params;
      const { quantity } = req.body;
      const cart = await CartService.updateItemQuantity(req.user!.userId, variantId, quantity);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Remove a specific item from the cart. */
  static async removeItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { variantId } = req.params;
      const cart = await CartService.removeItem(req.user!.userId, variantId);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Clear all items from the cart. */
  static async clearCart(req: AuthenticatedRequest, res: Response) {
    try {
      const cart = await CartService.clearCart(req.user!.userId);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
