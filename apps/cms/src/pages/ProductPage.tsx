import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { CMSLayout } from "../components/layout/CMSLayout";
import { api, type Product } from "../api/client";

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .getProduct(id)
      .then(setProduct)
      .catch((err) => console.error("Failed to load product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id || !product) return;
    try {
      setSaving(true);
      await api.updateProduct(id, {
        name: product.name,
        description: product.description,
        basePrice: Number(product.basePrice),
        isFeatured: product.isFeatured,
      });
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.deleteProduct(id);
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <CMSLayout>
        <div className="p-8 text-center text-gray-500">Loading product...</div>
      </CMSLayout>
    );
  }

  if (!product) {
    return (
      <CMSLayout>
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 space-y-3">
          <p className="text-gray-500 font-medium">Product not found.</p>
          <Link to="/products" className="text-sm text-black underline">
            Back to products
          </Link>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/products"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Edit Product
            </h1>
            <p className="text-sm text-gray-500">{product.slug}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Title
            </label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={product.basePrice}
              onChange={(e) =>
                setProduct({ ...product, basePrice: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={product.isFeatured}
              onChange={(e) =>
                setProduct({ ...product, isFeatured: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-medium text-gray-700"
            >
              Feature this product on homepage storefront
            </label>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="px-5 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete Product
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </CMSLayout>
  );
};
