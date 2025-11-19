"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AIDescriptionGenerator } from "./ai-description-generator";
import { AIImageGenerator } from "./ai-image-generator";
import type { ProductFormData } from "@/types/product";

interface ProductFormProps {
  product?: ProductFormData & { id: string };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIDescription, setShowAIDescription] = useState(false);
  const [showAIImage, setShowAIImage] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "bunnyFillings",
    displayCategory: product?.displayCategory || "Bunny fillings",
    spiceLevel: product?.spiceLevel,
    heatNotes: product?.heatNotes,
    serves: product?.serves,
    dietaryTags: product?.dietaryTags || [],
    highlights: product?.highlights || [],
    allergens: product?.allergens || [],
    availability: product?.availability || "in-stock",
    deliveryNote: product?.deliveryNote,
    maxQuantity: product?.maxQuantity,
    stockLevel: product?.stockLevel || 0,
    lowStockThreshold: product?.lowStockThreshold || 10,
    reorderPoint: product?.reorderPoint || 20,
    isActive: product?.isActive ?? true,
    badge: product?.badge,
    seoTitle: product?.seoTitle,
    seoDescription: product?.seoDescription,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to save product
      console.log("Saving product:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <button
                type="button"
                onClick={() => setShowAIDescription(true)}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1"
              >
                ✨ Generate with AI
              </button>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="bunnyFillings">Bunny Fillings</option>
                <option value="familyCurries">Family Curries</option>
                <option value="sides">Sides</option>
                <option value="sauces">Sauces & Extras</option>
                <option value="drinks">Drinks</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (cents) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Display: R{(formData.price / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Product Image</h2>
          <button
            type="button"
            onClick={() => setShowAIImage(true)}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1"
          >
            ✨ Generate with AI
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">🍛</div>
          <p className="text-sm text-gray-600">Upload image or generate with AI</p>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Inventory Settings
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Level *
            </label>
            <input
              type="number"
              value={formData.stockLevel}
              onChange={(e) =>
                setFormData({ ...formData, stockLevel: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Low Stock Alert
            </label>
            <input
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lowStockThreshold: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reorder Point
            </label>
            <input
              type="number"
              value={formData.reorderPoint}
              onChange={(e) =>
                setFormData({ ...formData, reorderPoint: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Availability & Status
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability Status
            </label>
            <select
              value={formData.availability}
              onChange={(e) =>
                setFormData({ ...formData, availability: e.target.value as any })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="in-stock">In Stock</option>
              <option value="limited">Limited</option>
              <option value="preorder">Pre-order</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex items-center pt-7">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (visible in store)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
      </div>

      {/* AI Modals */}
      {showAIDescription && (
        <AIDescriptionGenerator
          productName={formData.name}
          category={formData.category}
          onGenerated={(result) => {
            setFormData({
              ...formData,
              description: result.description,
              heatNotes: result.heatNotes,
              highlights: result.highlights,
              seoTitle: result.seoTitle,
              seoDescription: result.seoDescription,
            });
            setShowAIDescription(false);
          }}
          onClose={() => setShowAIDescription(false)}
        />
      )}

      {showAIImage && (
        <AIImageGenerator
          productName={formData.name}
          category={formData.category}
          description={formData.description}
          onGenerated={(imageUrl) => {
            // TODO: Handle image upload
            console.log("Generated image:", imageUrl);
            setShowAIImage(false);
          }}
          onClose={() => setShowAIImage(false)}
        />
      )}
    </form>
  );
}

