// filepath: apps/cms/src/api/client.ts

const API_BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  // Handle empty responses (e.g. 204 No Content)
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export interface Variant {
  id?: string;
  sku: string;
  size: string;
  color: string;
  stockQty: number;
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  categoryId: string;
  isFeatured: boolean;
  category?: { name: string };
  variants: Variant[];
  images: { url: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Order {
  id: string;
  customer: string;
  item: string;
  status: string;
  total: string;
}

export const api = {
  // Products
  getProducts: () => request<Product[]>("/products"),
  getProduct: (id: string) => request<Product>(`/products/${id}`),
  createProduct: (data: Record<string, unknown>) =>
    request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: Record<string, unknown>) =>
    request<Product>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: string) =>
    request<void>(`/products/${id}`, { method: "DELETE" }),

  // Categories
  getCategories: () => request<Category[]>("/categories"),

  // Orders
  getOrders: () => request<Order[]>("/orders"),

  // Media
  uploadImages: async (files: File[]): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload images");
    return res.json();
  },
};
