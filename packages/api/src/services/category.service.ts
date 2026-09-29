// filepath: packages/api/src/services/category.service.ts

import { prisma } from "@store/db";

export class CategoryService {
  static async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async createCategory(data: { name: string; slug: string }) {
    return prisma.category.create({ data });
  }
}
