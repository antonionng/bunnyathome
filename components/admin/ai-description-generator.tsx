"use client";

import { useState } from "react";
import type { AIDescriptionResponse } from "@/types/product";
import type { ProductCategory } from "@/types/product";

interface AIDescriptionGeneratorProps {
  productName: string;
  category: ProductCategory;
  onGenerated: (result: AIDescriptionResponse) => void;
  onClose: () => void;
}

export function AIDescriptionGenerator({
  productName,
  category,
  onGenerated,
  onClose,
}: AIDescriptionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [spiceLevel, setSpiceLevel] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [specialFeatures, setSpecialFeatures] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/admin/products/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category,
          ingredients: ingredients.split(",").map((i) => i.trim()).filter(Boolean),
          spiceLevel: spiceLevel || undefined,
          servingSize: servingSize || undefined,
          specialFeatures: specialFeatures
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate description");
      }

      const result: AIDescriptionResponse = await response.json();
      onGenerated(result);
    } catch (error) {
      console.error("Failed to generate description:", error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                ✨ AI Description Generator
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Let AI create compelling product copy for "{productName}"
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients (comma separated)
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="lamb, potato, curry spices, onions, tomato"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spice Level
            </label>
            <select
              value={spiceLevel}
              onChange={(e) => setSpiceLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select...</option>
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Hot">Hot</option>
              <option value="Very Hot">Very Hot</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serving Size
            </label>
            <input
              type="text"
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              placeholder="Feeds 2-3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Features (comma separated)
            </label>
            <input
              type="text"
              value={specialFeatures}
              onChange={(e) => setSpecialFeatures(e.target.value)}
              placeholder="slow-cooked, grass-fed, authentic Durban recipe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <span className="text-blue-600">ℹ️</span>
              <div className="text-sm text-blue-900">
                <strong>AI Magic:</strong> Our AI will generate an authentic
                Durban curry description with South African flavor, heat notes,
                highlights, and SEO-optimized content based on your inputs.
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !productName}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              <>
                ✨ Generate Description
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

