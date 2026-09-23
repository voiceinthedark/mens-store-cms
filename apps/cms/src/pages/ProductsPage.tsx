import React, { useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Eye, ExternalLink } from "lucide-react";
import { CMSLayout } from "../components/layout/CMSLayout";

interface Variant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stockQty: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: string;
  isFeatured: boolean;
  category: { name: string };
  variants: Variant[];
  images: { url: string }[];
}

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getTotalStock = (variants: Variant[]) =>
    variants?.reduce((acc, curr) => acc + curr.stockQty, 0) || 0;

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Products Catalog
            </h1>
            <p className="text-sm text-gray-500">
              Manage apparel items, variants, and stock levels
            </p>
          </div>
          <a
            href="/products/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
          >
            <Plus size={18} /> Add Product
          </a>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200 space-y-3">
            <p className="text-gray-500 font-medium">No products found.</p>
            <a href="/products/new" className="text-sm text-black underline">
              Create your first product
            </a>
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredProducts.map((product) => {
                const totalStock = getTotalStock(product.variants);
                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 p-4 rounded-xl flex gap-4"
                  >
                    <img
                      src={
                        product.images[0]?.url ||
                        "https://via.placeholder.com/100"
                      }
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {product.category?.name || "Uncategorized"}
                      </span>
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-900">
                        ${product.basePrice}
                      </p>
                      <div className="flex items-center justify-between pt-2 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium ${totalStock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {totalStock > 0
                            ? `${totalStock} in stock`
                            : "Out of stock"}
                        </span>
                        <div className="flex items-center gap-2 text-gray-600">
                          <a
                            href={`/products/${product.id}/edit`}
                            className="p-1 hover:text-black"
                          >
                            <Edit3 size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Total Stock</th>
                    <th className="px-6 py-3">Variants</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const totalStock = getTotalStock(product.variants);
                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50/50 transition"
                      >
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={
                              product.images[0]?.url ||
                              "https://via.placeholder.com/50"
                            }
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {product.slug}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {product.category?.name || "—"}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ${product.basePrice}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${totalStock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            {totalStock > 0
                              ? `${totalStock} in stock`
                              : "Out of stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {product.variants?.length || 0} Size/Color options
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-gray-500">
                            <a
                              href={`/products/${product.id}/edit`}
                              className="p-1.5 hover:text-black"
                            >
                              <Edit3 size={18} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </CMSLayout>
  );
};
