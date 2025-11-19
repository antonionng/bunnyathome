"use client";

import { useEffect, useState } from "react";
import { RecommendationCard } from "./recommendation-card";
import { ProductCardSkeleton } from "@/components/ui/loading-skeleton";

interface RecommendationsSectionProps {
  title?: string;
  type?: "general" | "cart" | "product";
  productId?: string;
  limit?: number;
}

export function RecommendationsSection({
  title = "You might also like",
  type = "general",
  productId,
  limit = 6,
}: RecommendationsSectionProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const params = new URLSearchParams({
          type,
          limit: limit.toString(),
        });

        if (productId) {
          params.append("productId", productId);
        }

        const response = await fetch(`/api/recommendations?${params}`);

        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [type, productId, limit]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ink">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </div>
    </div>
  );
}

