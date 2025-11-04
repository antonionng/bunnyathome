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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="tag-pill bg-brand-blue/20 text-brand-black">{tagLabel}</span>
        <h2 className="text-3xl font-semibold text-ink">{title}</h2>
        <p className="max-w-2xl text-base text-ink-muted">{description}</p>
        <p className="text-sm text-brand-coral">
          {totalSelected > 0
            ? `${totalSelected} ${totalSelected === 1 ? "item" : "items"} locked in`
            : hint ?? "Add at least one to keep things balanced."}
        </p>
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




