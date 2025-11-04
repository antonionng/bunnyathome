"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builder-store";
import type { QuantityProduct } from "@/types/builder";

interface QuantityCardProps {
  category: "sides" | "sauces" | "drinks";
  product: QuantityProduct;
  quantity: number;
}

export function QuantityCard({ category, product, quantity }: QuantityCardProps) {
  const increment = useBuilderStore((state) => state.incrementItem);
  const decrement = useBuilderStore((state) => state.decrementItem);

  const reachMax = product.maxQuantity && quantity >= product.maxQuantity;

  return (
    <div
      className={cn(
        "glass-panel group flex flex-col overflow-hidden border-2 transition",
        quantity > 0 ? "border-brand-curry/70" : "border-transparent hover:-translate-y-1"
      )}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 360px, 100vw"
          unoptimized
        />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full border border-brand-black/10 bg-white/90 px-3 py-1 text-xs font-semibold text-brand-black">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          <span>{category}</span>
          <span className="rounded-full border border-brand-curry/60 px-3 py-1 text-xs font-semibold text-brand-black">
            £{(product.price / 100).toFixed(2)}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-ink">{product.name}</h3>
          <p className="text-sm text-ink-muted">{product.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between rounded-full border border-brand-blue/40 bg-white/80 px-2 py-2 text-sm text-ink">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full px-0"
            onClick={() => decrement(category, product.id)}
            disabled={quantity === 0}
          >
            −
          </Button>
          <span className="text-base font-semibold">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full px-0"
            onClick={() => increment(category, product)}
            disabled={reachMax}
          >
            +
          </Button>
        </div>
        {reachMax && (
          <p className="text-xs text-brand-coral">
            Max {product.maxQuantity} allowed to keep the loaf perfectly balanced.
          </p>
        )}
      </div>
    </div>
  );
}




