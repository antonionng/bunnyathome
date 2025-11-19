"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChilliDial } from "@/components/builder/chilli-dial";
import { useToast } from "@/components/ui/toast-provider";
import type { CurryProduct, CurrySelection, SpiceLevel } from "@/types/builder";

interface CurryQuantityCardProps {
  curry: CurryProduct;
  selection: CurrySelection | undefined;
  onAdd: (spiceLevel: SpiceLevel) => void;
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onSpiceChange: (spiceLevel: SpiceLevel) => void;
}

const spiceLevels: SpiceLevel[] = ["Mild", "Hot", "Very Hot"];

const addMessages = [
  "Lekker choice! 🔥",
  "Sharp sharp! Stacked!",
  "Now we're cooking, boet!",
  "Eish, that's a good one!",
  "Sorted, legend! ✓",
];

const incrementMessages = [
  "Stack another, you animal! 🍲",
  "More curry? Howzit! 🔥",
  "Load up, legend!",
  "Sharp! More gravy coming.",
];

export function CurryQuantityCard({
  curry,
  selection,
  onAdd,
  onRemove,
  onIncrement,
  onDecrement,
  onSpiceChange,
}: CurryQuantityCardProps) {
  const { showToast } = useToast();
  const quantity = selection?.quantity ?? 0;
  const spiceLevel = selection?.spiceLevel ?? "Mild";
  const isSelected = quantity > 0;

  const handleAdd = () => {
    onAdd("Mild");
    const message = addMessages[Math.floor(Math.random() * addMessages.length)];
    showToast(message, "success");
  };

  const handleIncrement = () => {
    onIncrement();
    const message = incrementMessages[Math.floor(Math.random() * incrementMessages.length)];
    showToast(message, "success");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border-3 shadow-xl transition-all duration-300",
        isSelected
          ? "border-black bg-brand-curry scale-[1.02]"
          : "border-black bg-white hover:-translate-y-2 hover:shadow-2xl"
      )}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={curry.bunnyImage || curry.image}
          alt={curry.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
          sizes="(min-width: 1024px) 420px, 100vw"
          unoptimized
        />
        {curry.badge && (
          <span className="absolute left-4 top-4 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold text-brand-black shadow-md">
            {curry.badge}
          </span>
        )}
        <div className="absolute right-4 top-4 rounded-full border-2 border-black bg-brand-curry px-3 py-1 text-xs font-bold text-brand-black shadow-md">
          £{(curry.price / 100).toFixed(2)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 bg-white p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-ink">{curry.name}</h3>
          <p className="text-sm text-ink-muted">{curry.description}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          {!isSelected ? (
            <motion.button
              type="button"
              onClick={handleAdd}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl border-3 border-black bg-brand-black px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all hover:shadow-xl"
            >
              Stack it! 🔥
            </motion.button>
          ) : (
            <div className="flex w-full items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
                Quantity
              </span>
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  onClick={onDecrement}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border-3 border-black bg-white text-xl font-bold text-ink transition hover:bg-brand-coral hover:text-white"
                  aria-label="Decrease quantity"
                >
                  −
                </motion.button>
                <motion.span
                  key={quantity}
                  initial={{ scale: 1.2, color: "#ed908d" }}
                  animate={{ scale: 1, color: "#000000" }}
                  transition={{ duration: 0.3 }}
                  className="min-w-[2.5rem] text-center text-xl font-bold"
                >
                  {quantity}
                </motion.span>
                <motion.button
                  type="button"
                  onClick={handleIncrement}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border-3 border-black bg-white text-xl font-bold text-ink transition hover:bg-brand-green hover:text-white"
                  aria-label="Increase quantity"
                >
                  +
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Spice Level Selector - shown when selected */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4 }}
            className="space-y-4 rounded-xl border-3 border-black bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
                🌶️ Dial the heat
              </span>
            </div>
            <ChilliDial value={spiceLevel} onChange={onSpiceChange} size="sm" />
            <p className="text-xs leading-relaxed text-ink-muted italic">
              {curry.heatNotes}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}



