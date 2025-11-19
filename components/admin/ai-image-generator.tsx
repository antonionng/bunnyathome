"use client";

import { useState } from "react";
import type { ProductCategory } from "@/types/product";

interface AIImageGeneratorProps {
  productName: string;
  category: ProductCategory;
  description: string;
  theme?: string;
  onGenerated: (imageUrl: string) => void;
  onClose: () => void;
}

export function AIImageGenerator({
  productName,
  category,
  description,
  theme,
  onGenerated,
  onClose,
}: AIImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customStyle, setCustomStyle] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/admin/products/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category,
          description,
          style: customStyle || undefined,
          theme,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const result = await response.json();
      setGeneratedImage(result.imageUrl);
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUse = () => {
    if (generatedImage) {
      onGenerated(generatedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                ✨ AI Image Generator
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Generate professional product images with DALL-E 3
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
          {/* Product Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium">Product:</span> {productName}
              </div>
              <div>
                <span className="font-medium">Category:</span> {category}
              </div>
              {theme && (
                <div>
                  <span className="font-medium">Theme:</span> {theme}
                </div>
              )}
            </div>
          </div>

          {/* Custom Style Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Style (optional)
            </label>
            <textarea
              value={customStyle}
              onChange={(e) => setCustomStyle(e.target.value)}
              placeholder="Add any specific style notes (e.g., 'top-down view', 'with garnish', 'rustic presentation')"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Generated Image Preview */}
          {generatedImage ? (
            <div className="space-y-4">
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={generatedImage}
                  alt={productName}
                  className="w-full h-auto"
                />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <div className="text-sm text-green-900">
                    <strong>Image Generated Successfully!</strong>
                    <br />
                    Click "Use This Image" to apply it to your product.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <p className="text-sm text-gray-600 mb-2">
                Click "Generate Image" to create professional product photography
              </p>
              <p className="text-xs text-gray-500">
                Uses DALL-E 3 with South African Durban curry styling
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <span className="text-blue-600">ℹ️</span>
              <div className="text-sm text-blue-900">
                <strong>AI Image Generation:</strong> We'll create authentic
                food photography showcasing your Durban curry product with
                professional lighting and South African presentation style.
                {theme && (
                  <>
                    {" "}
                    For themed products, we'll blend the theme (e.g., Valentine's,
                    Halloween) with South African aesthetic.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {generatedImage ? (
              <span className="text-green-600 font-medium">✓ Image ready to use</span>
            ) : (
              <span>Generate a professional product image</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            {generatedImage ? (
              <>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-6 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleUse}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Use This Image
                </button>
              </>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !productName || !description}
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
                    Generating... (30-60s)
                  </>
                ) : (
                  <>
                    ✨ Generate Image
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

