// filepath: packages/api/src/services/product.service.ts

import { prisma } from "@store/db";

export class ProductService {
  static async getAllProducts() {
    return prisma.product.findMany({
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });
  }

  static async createProduct(data: {
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    categoryId: string;
  }) {
    return prisma.product.create({
      data,
      include: { category: true },
    });
  }

  static async getSingleProduct(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });
  }
}
