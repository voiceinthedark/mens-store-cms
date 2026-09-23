import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Plus, Trash2, ArrowLeft, Check } from "lucide-react";
import { CMSLayout } from "../components/layout/CMSLayout";

// Define standard men's apparel sizes
const MENS_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "38R",
  "40R",
  "42R",
  "44R",
];

// Local form validation schema matching @store/types specs
const variantSchema = z.object({
  sku: z.string().min(3, "SKU required"),
  size: z.string().min(1, "Size required"),
  color: z.string().min(1, "Color required"),
  stockQty: z.number().min(0, "Stock cannot be negative"),
  priceDelta: z.number().default(0),
});

const formSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z
    .string()
    .min(2)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and hyphenated",
    ),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.number().positive("Price must be greater than 0"),
  categoryId: z.string().uuid("Please select a valid category"),
  isFeatured: z.boolean().default(false),
  variants: z
    .array(variantSchema)
    .min(1, "At least one variant (size/color) is required"),
});

type ProductFormData = z.infer<typeof formSchema>;

export const ProductCreatePage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFeatured: false,
      basePrice: 0,
      variants: [
        { sku: "", size: "M", color: "Navy", stockQty: 10, priceDelta: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Auto-generate slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setValue("slug", generatedSlug, { shouldValidate: true });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setUploading(true);

      // 1. First upload images via Multipart API endpoint
      let uploadedUrls: string[] = [];
      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach((img) => formData.append("images", img));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        uploadedUrls = uploadData.urls;
      }

      // 2. Submit Product + Variants + Image URLs payload
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images: uploadedUrls,
        }),
      });

      if (!response.ok) throw new Error("Failed to create product");

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error creating product. Check console logs.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <CMSLayout>
      <div className="max-w-4xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <a
            href="/products"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Add New Clothing Item
            </h1>
            <p className="text-sm text-gray-500">
              Create products, manage sizes, colors, and inventory
            </p>
          </div>
        </div>

        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
            <Check size={20} /> Product created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* General Information */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Italian Wool Blazer"
                  {...register("name")}
                  onChange={(e) => {
                    register("name").onChange(e);
                    handleNameChange(e);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="italian-wool-blazer"
                  {...register("slug")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="299.00"
                  {...register("basePrice", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
                {errors.basePrice && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.basePrice.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category UUID
                </label>
                <input
                  type="text"
                  placeholder="Paste Category UUID"
                  {...register("categoryId")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
                {errors.categoryId && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Fabric details, fit description, care instructions..."
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                {...register("isFeatured")}
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

          {/* Product Images Upload */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Product Media
            </h2>

            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center hover:border-black transition cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                id="image-upload"
                onChange={handleImageSelect}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload size={32} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  Tap to upload photos or drag and drop
                </span>
                <span className="text-xs text-gray-400">
                  PNG, JPG, WEBP up to 5MB
                </span>
              </label>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {selectedImages.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inventory & Size/Color Variants */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Inventory Variants
              </h2>
              <button
                type="button"
                onClick={() =>
                  append({
                    sku: "",
                    size: "M",
                    color: "Navy",
                    stockQty: 0,
                    priceDelta: 0,
                  })
                }
                className="flex items-center gap-1 text-sm font-medium text-black hover:underline"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50/50"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-gray-400">
                    Variant #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      placeholder="BLZ-NAV-M"
                      {...register(`variants.${index}.sku` as const)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Size
                    </label>
                    <select
                      {...register(`variants.${index}.size` as const)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
                    >
                      {MENS_SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      placeholder="Navy"
                      {...register(`variants.${index}.color` as const)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      {...register(`variants.${index}.stockQty` as const, {
                        valueAsNumber: true,
                      })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Price Adjust (+/-)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.priceDelta` as const, {
                        valueAsNumber: true,
                      })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => (window.location.href = "/products")}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? "Saving Item..." : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </CMSLayout>
  );
};
