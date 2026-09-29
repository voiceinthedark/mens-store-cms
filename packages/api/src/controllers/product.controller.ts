// filepath: packages/api/src/controllers/product.controller.ts

import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

/**
 * ProductController handles catalog browsing (public) and
 * product management (admin/CMS) endpoints.
 */
export class ProductController {
  /** Public: list all products with category, variants, and images. */
  static async list(_req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /** Public: get a single product by its storefront slug. */
  static async getBySlug(req: Request, res: Response) {
    try {
      const product = await ProductService.getSingleProduct(
        req.params.slug,
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /** Admin/CMS: get a single product by its id. */
  static async getById(req: Request, res: Response) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /** Admin: create a new product, optionally with variants/images. */
  static async create(req: Request, res: Response) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Admin: update an existing product's fields. */
  static async update(req: Request, res: Response) {
    try {
      const product = await ProductService.updateProduct(
        req.params.id,
        req.body,
      );
      res.status(200).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** Admin: delete a product. */
  static async remove(req: Request, res: Response) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}