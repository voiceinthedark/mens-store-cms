// filepath: packages/api/src/routes/auth.routes.ts

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  bootstrapAdminSchema,
} from "../schemas/auth.schema";

const router = Router();
router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);

// Temporary: one-time ADMIN bootstrap, gated by ADMIN_BOOTSTRAP_KEY.
// Remove this route (and the env var) once your first admin exists.
router.post(
  "/bootstrap-admin",
  validate(bootstrapAdminSchema),
  AuthController.bootstrapAdmin,
);

export default router;
