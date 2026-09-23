import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

/**
 * Middleware to validate request data against a Zod schema.
 * @param schema - The Zod schema to validate against.
 * @returns An Express middleware function.
 */
export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body, query, and params against the schema
      /* @type {Promise<ZodObject>} */
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign sanitized data back to the request
      req.body = parsed.body;
      req.query = parsed.query as any;
      req.params = parsed.params as any;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.issues.map((err) => ({
            field: err.path.join(".").replace(/^(body|query|params)\./, ""),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};
