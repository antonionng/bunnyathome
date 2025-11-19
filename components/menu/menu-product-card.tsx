"use client";

import { useState } from "react";
import Image from "next/image";
import type { MenuProduct } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { formatFromPence } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface MenuProductCardProps {
  product: MenuProduct;
  onAddToCart: (product: MenuProduct) => void;
}

const availabilityCopy: Record<string, string> = {
  "in-stock": "Ships weekly",
  limited: "Limited slots",
  preorder: "Pre-order only",
};

export function MenuProductCard({ product, onAddToCart }: MenuProductCardProps) {
  const [expanded, setExpanded] = useState(false);
  const dietaryTags = product.dietaryTags ?? [];
  const highlightList = product.highlights ?? [];
  const overlayHighlights = highlightList.slice(0, 3);
  const availabilityLabel = product.availability ? availabilityCopy[product.availability] : "Available";
  const heroCopy = product.heatNotes || product.deliveryNote || product.description;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border-3 border-black bg-white shadow-2xl transition hover:-translate-y-1 hover:shadow-3xl">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 360px, 100vw"
          unoptimized
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/70 to-black/90 transition duration-300 group-hover:from-black/30 group-hover:via-black/80" />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 text-white">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
            <span className="rounded-full border border-white/40 bg-black/30 px-3 py-1 text-[10px] tracking-[0.2em]">
              {product.badge || product.displayCategory}
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] tracking-[0.2em] text-white">
              {availabilityLabel}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold leading-tight">{product.name}</p>
            <p className="text-sm text-white/80">{heroCopy}</p>
            {overlayHighlights.length > 0 && (
              <ul className="flex flex-wrap gap-4 text-xs text-white/85">
                {overlayHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2">
                    <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-coral">
              {product.displayCategory}
            </p>
            <span className="rounded-full border border-ink/20 px-3 py-1 text-[11px] font-semibold text-ink-muted">
              {product.serves ?? "Feeds 2"}
            </span>
          </div>
          <p className="text-sm text-ink-muted">{product.description}</p>
          {product.deliveryNote && (
            <div className="rounded-2xl border border-dashed border-brand-coral/60 bg-brand-coral/10 p-3 text-xs font-semibold text-ink">
              {product.deliveryNote}
            </div>
          )}
        </div>

        {dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dietaryTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black bg-brand-blue/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {highlightList.length > 0 && (
          <ul className="space-y-1 text-sm text-ink">
            {highlightList.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2">
                <span aria-hidden className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-black" />
                {highlight}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink-muted">Price</p>
              <p className="text-2xl font-black text-ink">{formatFromPence(product.price)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink-muted">Spice</p>
              <p className="text-base font-semibold text-ink">{product.spiceLevel ?? "Any"}</p>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full border-3 border-black bg-brand-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-black/90"
            onClick={() => onAddToCart(product)}
          >
            Add to cart
          </Button>

          <button
            type="button"
            className={cn(
              "flex items-center justify-between rounded-xl border-2 border-black px-4 py-3 text-sm font-semibold text-ink transition sm:hidden",
              expanded ? "bg-brand-curry/20" : "bg-white"
            )}
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            <span>Delivery & spice details</span>
            <span aria-hidden>{expanded ? "−" : "+"}</span>
          </button>
          {expanded && (
            <div className="rounded-2xl border-2 border-dashed border-brand-coral bg-brand-coral/10 p-4 text-sm text-ink sm:hidden">
              {product.heatNotes && (
                <p className="font-semibold">
                  Spice intel: <span className="font-normal">{product.heatNotes}</span>
                </p>
              )}
              <p className="mt-2 text-ink/80">
                {product.deliveryNote || "Orders lock Tuesday · land by Friday braai-time."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

