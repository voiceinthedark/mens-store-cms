import React, { useEffect, useState } from "react";
import { Plus, Layers } from "lucide-react";
import { CMSLayout } from "../components/layout/CMSLayout";
import { api, type Category } from "../api/client";

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Categories
            </h1>
            <p className="text-sm text-gray-500">
              Organize your catalog into apparel categories
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
            <Plus size={18} /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200 space-y-3">
            <Layers className="mx-auto text-gray-300" size={40} />
            <p className="text-gray-500 font-medium">No categories yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white p-5 rounded-xl border border-gray-200"
              >
                <p className="text-sm font-semibold text-gray-900">
                  {category.name}
                </p>
                <p className="text-xs text-gray-400">{category.slug}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </CMSLayout>
  );
};
