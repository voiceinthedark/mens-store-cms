// filepath: packages/api/src/controllers/order.controller.ts

import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { OrderService } from "../services/order.service";

/**
 * OrderController handles order creation and retrieval for the
 * pay-on-delivery checkout flow.
 */
export class OrderController {
  /** Customer creates a new order from their cart/selected items. */
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const order = await OrderService.createOrder(userId, req.body);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Customer checks out using the items currently in their cart. */
  static async checkout(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { addressId } = req.body;
      const order = await OrderService.checkoutFromCart(userId, addressId);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Customer lists their own order history. */
  static async listMine(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const orders = await OrderService.getOrdersForUser(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Admin/Staff lists all orders. */
  static async listAll(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Retrieve a single order by ID. Customers can only view their own. */
  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const isAdminOrStaff =
        req.user!.role === "ADMIN" || req.user!.role === "STAFF";
      const order = await OrderService.getOrderById(
        req.params.id,
        userId,
        isAdminOrStaff,
      );
      res.status(200).json(order);
    } catch (error: any) {
      const status = error.message.startsWith("Forbidden") ? 403 : 404;
      res.status(status).json({ error: error.message });
    }
  }

  /** Admin/Staff updates order status and/or payment status. */
  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const order = await OrderService.updateOrderStatus(
        req.params.id,
        req.body,
      );
      res.status(200).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
