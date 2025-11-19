"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatFromPence } from "@/lib/currency";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

interface RecommendationCardProps {
  recommendation: {
    id: string;
    name: string;
    type: string;
    price: number;
    image: string;
    score: number;
    reason: string;
  };
  onAddToCart?: () => void;
}

export function RecommendationCard({ recommendation, onAddToCart }: RecommendationCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    // Create cart item from recommendation
    const cartItem = {
      id: `${recommendation.type}-${recommendation.id}-${Date.now()}`,
      productId: recommendation.id,
      name: recommendation.name,
      price: recommendation.price,
      quantity: 1,
      image: recommendation.image,
      type: recommendation.type as any,
    };

    addItem(cartItem);

    toast.success("Added to cart!", {
      description: recommendation.name,
    });

    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div className="group relative rounded-2xl border-2 border-black bg-white p-4 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={recommendation.image}
          alt={recommendation.name}
          width={200}
          height={200}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
        />
      </div>

      <div className="mb-2">
        <h3 className="font-bold text-ink line-clamp-1">{recommendation.name}</h3>
        <p className="text-sm text-ink-muted line-clamp-1">{recommendation.reason}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-brand-curry">
          {formatFromPence(recommendation.price)}
        </span>
        <Button size="sm" onClick={handleAddToCart}>
          Add
        </Button>
      </div>

      {/* Popularity badge */}
      {recommendation.score > 5 && (
        <div className="absolute right-2 top-2 rounded-full bg-brand-curry px-2 py-1 text-xs font-bold text-white">
          🔥 Hot
        </div>
      )}
    </div>
  );
}

