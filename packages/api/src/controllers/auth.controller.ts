// filepath: packages/api/src/controllers/auth.controller.ts

import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { env } from "../config/env";

/**
 * AuthController handles user authentication requests such as registration and login.
 */
export class AuthController {
  /** Function to handle user registration
   * @param req - Express request object containing user registration data
   * @param res - Express response object to send back the result
   * */
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const result = await AuthService.register(
        email,
        password,
        firstName,
        lastName,
      );
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Function to handle user login
   * @param req - Express request object containing user login data
   * @param res - Express response object to send back the result
   * */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * Temporary: bootstraps the very first ADMIN account. Requires the
   * `x-bootstrap-key` header to match ADMIN_BOOTSTRAP_KEY, and refuses
   * to run once any ADMIN user already exists. Safe to remove this
   * route (and the env var) after initial setup.
   */
  static async bootstrapAdmin(req: Request, res: Response) {
    const providedKey = req.header("x-bootstrap-key");

    if (!env.ADMIN_BOOTSTRAP_KEY) {
      return res
        .status(403)
        .json({ error: "Admin bootstrap is not configured on this server" });
    }

    if (!providedKey || providedKey !== env.ADMIN_BOOTSTRAP_KEY) {
      return res.status(403).json({ error: "Invalid or missing bootstrap key" });
    }

    try {
      const { email, password, firstName, lastName } = req.body;
      const result = await AuthService.bootstrapAdmin(
        email,
        password,
        firstName,
        lastName,
      );
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
