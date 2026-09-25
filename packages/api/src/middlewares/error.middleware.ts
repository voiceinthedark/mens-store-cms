// filepath: packages/api/src/middlewares/error.middleware.ts

import { Request, Response, NextFunction } from "express";

/**
 * Catch-all handler for routes that don't match any defined endpoint.
 * Must be registered after all routes, before the error handler.
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
};

/**
 * Global error handler. Must be registered last, after all routes
 * and the notFoundHandler. Catches errors passed via next(error).
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.error(err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({ error: message });
};