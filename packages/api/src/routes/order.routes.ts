// filepath: packages/api/src/routes/order.routes.ts

import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createOrderSchema,
  getOrderByIdSchema,
  updateOrderStatusSchema,
} from "../schemas/order.schema";

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Customer: create a new order (pay-on-delivery)
router.post("/", validate(createOrderSchema), OrderController.create);

// Customer: view own order history
router.get("/mine", OrderController.listMine);

// Admin/Staff: view all orders
router.get("/", authorize(["ADMIN", "STAFF"]), OrderController.listAll);

// Customer/Admin/Staff: view a single order (ownership checked in controller)
router.get("/:id", validate(getOrderByIdSchema), OrderController.getById);

// Admin/Staff: update order/payment status
router.patch(
  "/:id/status",
  authorize(["ADMIN", "STAFF"]),
  validate(updateOrderStatusSchema),
  OrderController.updateStatus,
);

export default router;
