// filepath: packages/api/src/routes/product.routes.ts

import { Router } from 'express';
import { ProductService } from '../services/product.service';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public route for storefront
router.get('/', async (req, res) => {
  const products = await ProductService.getAllProducts();
  res.json(products);
});

// Admin-protected route for CMS management
router.post('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
