"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatFromPence } from "@/lib/currency";

interface ReadyBoxCardProps {
  box: {
    id: string;
    name: string;
    description: string;
    image: string;
    badge: string;
    price: number;
    serves: string;
    highlights: string[];
  };
  onAdd: () => void;
}

export function ReadyBoxCard({ box, onAdd }: ReadyBoxCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border-3 border-black bg-white shadow-2xl">
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={box.image}
          alt={box.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 420px, 100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.3em]">
            <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[10px] tracking-[0.2em]">
              {box.badge}
            </span>
            <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[10px] tracking-[0.2em]">
              {box.serves}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black leading-tight">{box.name}</h3>
            <p className="text-sm text-white/80">{box.description}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <ul className="space-y-2 text-sm text-ink">
          {box.highlights.map((highlight) => (
            <li key={`${box.id}-${highlight}`} className="flex items-center gap-2">
              <span aria-hidden className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-black" />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink-muted">Bundle total</p>
            <p className="text-3xl font-black text-ink">{formatFromPence(box.price)}</p>
          </div>
          <Button
            size="lg"
            className="flex-1 border-3 border-black bg-brand-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-black/90 sm:flex-none"
            onClick={onAdd}
          >
            Add box to cart
          </Button>
        </div>
      </div>
    </div>
  );
}

