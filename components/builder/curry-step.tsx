"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builder-store";
import type { BuilderCatalog, CurryProduct, SpiceLevel } from "@/types/builder";

interface CurryStepProps {
  catalog: BuilderCatalog["curries"];
}

export function CurryStep({ catalog }: CurryStepProps) {
  const curryId = useBuilderStore((state) => state.curryId);
  const currySpiceLevel = useBuilderStore((state) => state.currySpiceLevel);
  const setCurrySpiceLevel = useBuilderStore((state) => state.setCurrySpiceLevel);
  const selectCurry = useBuilderStore((state) => state.selectCurry);

  const selectedCurry = useMemo<CurryProduct | undefined>(
    () => catalog.find((curry) => curry.id === curryId),
    [catalog, curryId]
  );

  const spiceLevels: SpiceLevel[] = ["Mild", "Hot", "Very Hot"];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="tag-pill bg-brand-curry/25 text-brand-black">Step 1 · Bunny filling</span>
        <h2 className="text-3xl font-semibold text-ink">Choose your bunny chow filling.</h2>
        <p className="text-base text-ink-muted">
          Each pouch serves 2-3 (580-600g) and includes spice boosters so you can nudge the heat right
          here. We’ll sort bread and garnishes next.
        </p>
      </div>

      <div className="glass-panel space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="tag-pill bg-brand-blue/20 text-brand-black">Heat dial</span>
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-coral">
            {currySpiceLevel}
          </span>
        </div>
        <p className="text-sm text-ink-muted">
          Switch the heat without losing flavour. Each filling ships with masala boosters and cooling sides
          so you can nudge it up or down.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {spiceLevels.map((level) => (
            <button
              type="button"
              key={level}
              onClick={() => setCurrySpiceLevel(level)}
              className={cn(
                "flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition",
                currySpiceLevel === level
                  ? "border-brand-coral bg-brand-coral text-white shadow-lg shadow-brand-coral/30"
                  : "border-border-subtle bg-surface text-ink hover:border-brand-coral/60"
              )}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-brand-green/40 bg-white p-4 text-sm text-ink">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-green">Chef note</p>
          <p className="mt-2">
            {selectedCurry
              ? selectedCurry.heatNotes
              : "Select a curry to see spice notes and pairing tips."}
          </p>
        </div>
        <Button variant="outline" size="md" className="w-full border-brand-curry/50 text-ink">
          Chef pairing video
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {catalog.map((curry) => {
          const isSelected = curry.id === curryId;
          return (
            <button
              type="button"
              key={curry.id}
              onClick={() => selectCurry(curry.id)}
              className={cn(
                "glass-panel group flex flex-col overflow-hidden border-2 text-left transition transform",
                isSelected
                  ? "border-brand-curry/70 shadow-card"
                  : "border-transparent hover:-translate-y-1"
              )}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={curry.image}
                  alt={curry.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 420px, 100vw"
                  unoptimized
                />
                {curry.badge && (
                  <span className="absolute left-4 top-4 rounded-full border border-brand-black/20 bg-white/90 px-3 py-1 text-xs font-semibold text-brand-black">
                    {curry.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-center justify-between text-sm text-ink-muted">
                  <span className="font-medium uppercase tracking-[0.18em] text-brand-coral">
                    Spice · {currySpiceLevel}
                  </span>
                  <span className="rounded-full border border-brand-curry/60 px-3 py-1 text-xs font-semibold text-brand-black">
                    £{(curry.price / 100).toFixed(2)}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-ink">{curry.name}</h3>
                  <p className="text-sm text-ink-muted">{curry.description}</p>
                </div>
                <p className="mt-auto text-xs uppercase tracking-[0.2em] text-brand-coral">
                  {isSelected ? "Selected" : "Tap to select"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}



