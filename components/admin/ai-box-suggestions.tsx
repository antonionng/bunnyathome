"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/currency";
import type { SeasonalBoxSuggestion } from "@/types/product";

export function AIBoxSuggestions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SeasonalBoxSuggestion[]>([]);

  // Form state
  const [season, setSeason] = useState("");
  const [month, setMonth] = useState("");
  const [occasion, setOccasion] = useState("");
  const [theme, setTheme] = useState("");
  const [pricePoint, setPricePoint] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/admin/boxes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          season: season || undefined,
          month: month ? parseInt(month) : undefined,
          occasion: occasion || undefined,
          theme: theme || undefined,
          pricePoint: pricePoint ? parseInt(pricePoint) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate suggestions");
      }

      const result = await response.json();
      setSuggestions(result.suggestions || []);
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      alert("Failed to generate suggestions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateBox = async (suggestion: SeasonalBoxSuggestion) => {
    // TODO: Implement box creation
    console.log("Creating box from suggestion:", suggestion);
  };

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Generation Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Season
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Auto-detect</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
              <option value="spring">Spring</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Current Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2024, m - 1).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occasion
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">None</option>
              <option value="valentines">Valentine's Day</option>
              <option value="mothers-day">Mother's Day</option>
              <option value="fathers-day">Father's Day</option>
              <option value="halloween">Halloween</option>
              <option value="heritage-day">Heritage Day</option>
              <option value="christmas">Christmas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g., Rugby Season, Braai Day"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Price (cents)
            </label>
            <input
              type="number"
              value={pricePoint}
              onChange={(e) => setPricePoint(e.target.value)}
              placeholder="e.g., 4000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {pricePoint && (
              <p className="text-xs text-gray-500 mt-1">
                Display: {formatPrice(parseInt(pricePoint))}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="bg-gradient-to-r from-purple-50 to-orange-50 border border-purple-200 rounded-lg p-4 flex-1 mr-4">
            <div className="flex gap-2">
              <span className="text-purple-600">✨</span>
              <div className="text-sm text-purple-900">
                <strong>AI will analyze:</strong> Available products, seasonal trends,
                customer preferences, and cultural occasions to create perfect box
                combinations with marketing copy and themed imagery.
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-lg hover:from-purple-700 hover:to-orange-700 transition-colors font-medium disabled:opacity-50 inline-flex items-center gap-2"
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
                ✨ Generate Suggestions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Suggestions</h2>
            <p className="text-gray-600 mt-1">
              {suggestions.length} box{suggestions.length !== 1 ? "es" : ""} suggested
            </p>
          </div>

          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border-2 border-purple-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-50 to-orange-50 px-6 py-4 border-b border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {suggestion.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {suggestion.theme && (
                        <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs font-medium rounded capitalize">
                          {suggestion.theme}
                        </span>
                      )}
                      {suggestion.season && (
                        <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs font-medium rounded capitalize">
                          {suggestion.season}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(suggestion.totalPrice)}
                    </div>
                    {suggestion.suggestedDiscountPrice && (
                      <div className="text-sm text-gray-600 line-through">
                        {formatPrice(suggestion.suggestedDiscountPrice)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                  <p className="text-gray-700">{suggestion.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Marketing Copy</h4>
                  <p className="text-gray-700 italic">{suggestion.marketingCopy}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Products Included</h4>
                  <div className="space-y-2">
                    {suggestion.products.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-900">
                          {item.productId} × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">AI Reasoning</h4>
                  <p className="text-sm text-gray-600">{suggestion.reasoning}</p>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleCreateBox(suggestion)}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Create This Box
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isGenerating && suggestions.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to create amazing boxes?
          </h3>
          <p className="text-gray-600">
            Configure parameters above and click "Generate Suggestions" to let AI
            create perfect box combinations
          </p>
        </div>
      )}
    </div>
  );
}

