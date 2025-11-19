"use client";

import { useMemo } from "react";
import { QuantityCard } from "@/components/builder/quantity-card";
import { useBuilderStore } from "@/store/builder-store";
import type { BuilderCatalog, QuantityProduct } from "@/types/builder";

interface QuantityStepProps {
  category: "sides" | "sauces" | "drinks";
  tagLabel: string;
  title: string;
  description: string;
  catalog: BuilderCatalog["sides" | "sauces" | "drinks"];
  hint?: string;
}

export function QuantityStep({
  category,
  title,
  description,
  tagLabel,
  catalog,
  hint,
}: QuantityStepProps) {
  const selections = useBuilderStore((state) => state[category]);

  const totalSelected = useMemo(
    () => Object.values(selections).reduce((acc, qty) => acc + qty, 0),
    [selections]
  );

  const categoryEmojis = {
    sides: "🥗",
    sauces: "🍢",
    drinks: "🥤",
  };

  const categoryColors = {
    sides: "bg-brand-blue",
    sauces: "bg-brand-pink",
    drinks: "bg-brand-green",
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className={`inline-flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 ${categoryColors[category]}`}>
          <span className="text-xl">{categoryEmojis[category]}</span>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black">{tagLabel}</span>
        </div>
        <h2 className="text-4xl font-bold text-ink lg:text-5xl">{title}</h2>
        <p className="max-w-2xl text-xl text-ink-muted">{description}</p>
        {totalSelected > 0 ? (
          <p className="text-lg font-bold text-brand-coral">
            ✓ {totalSelected} {totalSelected === 1 ? "item" : "items"} stacked, sharp sharp!
          </p>
        ) : hint ? (
          <p className="text-base font-bold text-ink-muted italic">
            💡 {hint}
          </p>
        ) : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {catalog.map((product: QuantityProduct) => (
          <QuantityCard
            key={product.id}
            category={category}
            product={product}
            quantity={selections[product.id] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}




