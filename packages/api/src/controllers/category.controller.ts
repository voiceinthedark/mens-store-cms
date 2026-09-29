// filepath: packages/api/src/controllers/category.controller.ts

import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  /** Public: list all categories. */
  static async list(_req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /** Admin: create a new category. */
  static async create(req: Request, res: Response) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
