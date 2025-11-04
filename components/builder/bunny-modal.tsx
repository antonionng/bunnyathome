"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useBuilderStore } from "@/store/builder-store";
import type { BuilderCatalog } from "@/types/builder";

interface BunnyModalProps {
  catalog: BuilderCatalog["curries"];
  onMakeBunny: () => void;
  onSkip: () => void;
}

export function BunnyModal({ catalog, onMakeBunny, onSkip }: BunnyModalProps) {
  const showBunnyModal = useBuilderStore((state) => state.showBunnyModal);
  const curryId = useBuilderStore((state) => state.curryId);

  const filling = useMemo(
    () => catalog.find((item) => item.id === curryId) ?? null,
    [catalog, curryId]
  );

  useEffect(() => {
    if (!showBunnyModal) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showBunnyModal, onSkip]);

  if (!showBunnyModal || !filling) {
    return null;
  }

  const imageSrc = filling.bunnyImage ?? filling.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/60 px-4 py-10">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bunny-modal-title"
        className="w-full max-w-xl overflow-hidden rounded-2xl border-2 border-black bg-white shadow-2xl"
      >
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={`${filling.name} bunny preview`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 480px, 100vw"
            unoptimized
          />
        </div>
        <div className="space-y-6 px-8 py-7">
          <div className="space-y-2">
            <span className="tag-pill bg-brand-curry text-brand-black">Make it a bunny</span>
            <h2 id="bunny-modal-title" className="text-2xl font-bold text-ink">
              Finish {filling.name} with a loaf?
            </h2>
            <p className="text-sm text-ink-muted">
              We'll drop a fresh Durban-style loaf and the house pickled carrot salad into your box so you can
              plate the full bunny chow. You can tweak or remove it on the next step.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button className="w-full sm:w-auto" onClick={onMakeBunny}>
              Make it a bunny
            </Button>
            <Button variant="outline" className="w-full sm:w-auto text-ink" onClick={onSkip}>
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

