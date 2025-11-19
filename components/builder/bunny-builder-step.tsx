"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CurryQuantityCard } from "@/components/builder/curry-quantity-card";
import { HelperTooltip } from "@/components/ui/helper-tooltip";
import { useBuilderStore } from "@/store/builder-store";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";
import type { BuilderCatalog, QuantityProduct } from "@/types/builder";

interface BunnyBuilderStepProps {
  breads: QuantityProduct[];
  bunnyFillings: BuilderCatalog["bunnyFillings"];
  isOptional?: boolean;
}

export function BunnyBuilderStep({ breads, bunnyFillings, isOptional = false }: BunnyBuilderStepProps) {
  const { showToast } = useToast();
  const bunnyBuilderPart = useBuilderStore((state) => state.bunnyBuilderPart);
  const sides = useBuilderStore((state) => state.sides);
  const bunnyFillingsState = useBuilderStore((state) => state.bunnyFillings);
  const goToBunnyPart = useBuilderStore((state) => state.goToBunnyPart);
  const skipBunnyBuilder = useBuilderStore((state) => state.skipBunnyBuilder);
  const incrementItem = useBuilderStore((state) => state.incrementItem);
  const decrementItem = useBuilderStore((state) => state.decrementItem);
  const addCurry = useBuilderStore((state) => state.addCurry);
  const removeCurry = useBuilderStore((state) => state.removeCurry);
  const updateCurrySpice = useBuilderStore((state) => state.updateCurrySpice);
  const incrementCurry = useBuilderStore((state) => state.incrementCurry);
  const decrementCurry = useBuilderStore((state) => state.decrementCurry);

  const [showPart2Unlock, setShowPart2Unlock] = useState(false);

  const hasBread = breads.some((bread) => sides[bread.id] > 0);
  const totalBunnyFillings = Object.keys(bunnyFillingsState).length;

  // Auto-advance to Part 2 when bread is selected
  useEffect(() => {
    if (hasBread && bunnyBuilderPart === 1) {
      setShowPart2Unlock(true);
      setTimeout(() => {
        goToBunnyPart(2);
        setShowPart2Unlock(false);
        showToast("Sharp! Now load up that loaf! 🔥", "success");
      }, 800);
    }
  }, [hasBread, bunnyBuilderPart, goToBunnyPart, showToast]);

  const handleSkip = () => {
    skipBunnyBuilder();
    showToast("No worries, boet! Moving on...", "info");
  };

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border-3 border-black font-bold transition-all",
            bunnyBuilderPart === 1 ? "bg-brand-curry text-brand-black scale-110" : "bg-brand-green text-white"
          )}>
            {bunnyBuilderPart === 1 ? "1" : "✓"}
          </div>
          <motion.div 
            className="h-1 w-16 bg-black"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: bunnyBuilderPart === 2 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: "left" }}
          />
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border-3 border-black font-bold transition-all",
            bunnyBuilderPart === 2 ? "bg-brand-curry text-brand-black scale-110" : "bg-gray-200 text-gray-400"
          )}>
            2
          </div>
        </div>
        
        {isOptional && bunnyBuilderPart === 1 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleSkip}
            className="rounded-xl border-2 border-ink-muted px-6 py-3 text-sm font-bold text-ink-muted transition-all hover:border-brand-coral hover:text-brand-coral"
          >
            Skip bunny chow for now →
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Part 1: Bread Selection */}
        {bunnyBuilderPart === 1 && (
          <motion.div
            key="part1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-curry px-4 py-2">
                <span className="text-xl">🥖</span>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black">
                  Part 1 of 2 · Pick your base
                </span>
              </div>
              <h2 className="text-4xl font-bold text-ink lg:text-5xl">
                First, pick your bunny base
              </h2>
              <p className="max-w-2xl text-xl text-ink-muted">
                Quarter it, hollow it, pack it with curry - that's the Durban way, boet! Each loaf feeds 2-3 hungry okes.
              </p>
              {hasBread && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-bold text-brand-green"
                >
                  ✓ Loaf selected! Moving to fillings, sharp sharp...
                </motion.p>
              )}
            </div>

            <HelperTooltip variant="tip">
              <strong>Bunny chow 101:</strong> Quarter the loaf, hollow out the soft bread inside, then pack it full of curry. That's how they do it on Grey Street!
            </HelperTooltip>

            <div className="grid gap-6 md:grid-cols-3">
              {breads.map((bread) => {
                const quantity = sides[bread.id] ?? 0;
                const isSelected = quantity > 0;

                return (
                  <motion.div
                    key={bread.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "rounded-xl border-3 shadow-xl transition-all duration-300 cursor-pointer overflow-hidden",
                      isSelected
                        ? "border-brand-green bg-brand-green scale-105"
                        : "border-black bg-white hover:shadow-2xl"
                    )}
                    onClick={() => {
                      if (!isSelected) {
                        incrementItem("sides", bread);
                      }
                    }}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={bread.image}
                        alt={bread.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110"
                        sizes="(min-width: 1024px) 360px, 100vw"
                        unoptimized
                      />
                      {bread.badge && (
                        <span className="absolute left-4 top-4 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold text-brand-black shadow-lg">
                          {bread.badge}
                        </span>
                      )}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center bg-brand-green/90"
                        >
                          <div className="text-center">
                            <div className="text-6xl">✓</div>
                            <div className="mt-2 text-xl font-bold text-white">Selected!</div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 bg-white p-5">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-ink">{bread.name}</h3>
                        <p className="text-sm text-ink-muted">{bread.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-brand-curry">
                          £{(bread.price / 100).toFixed(2)}
                        </span>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                decrementItem("sides", bread.id);
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white text-lg font-bold transition hover:bg-brand-coral hover:text-white"
                            >
                              −
                            </motion.button>
                            <span className="min-w-[2rem] text-center text-lg font-bold">{quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                incrementItem("sides", bread);
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white text-lg font-bold transition hover:bg-brand-green hover:text-white"
                            >
                              +
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Unlock Animation */}
        {showPart2Unlock && (
          <motion.div
            key="unlock"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.6 }}
                className="text-9xl"
              >
                🔓
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-3xl font-bold text-white"
              >
                Unlocked: Bunny Fillings! 🔥
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Part 2: Filling Selection */}
        {bunnyBuilderPart === 2 && (
          <motion.div
            key="part2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-coral px-4 py-2">
                <span className="text-xl">🌶️</span>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black">
                  Part 2 of 2 · Load it up
                </span>
              </div>
              <h2 className="text-4xl font-bold text-ink lg:text-5xl">
                Now load up that loaf! 🔥
              </h2>
              <p className="max-w-2xl text-xl text-ink-muted">
                Each filling is 580-600g, packed with potato, ready for your hollowed bread. Dial the spice with every pot, sharp sharp!
              </p>
              {totalBunnyFillings > 0 && (
                <p className="text-lg font-bold text-brand-coral">
                  ✓ {totalBunnyFillings} {totalBunnyFillings === 1 ? "filling" : "fillings"} stacked, lekker!
                </p>
              )}
            </div>

            <HelperTooltip variant="tip">
              <strong>Pro tip:</strong> Mix flavors if the crew can't decide! Each pot comes with spice boosters so everyone can dial their own heat at the table.
            </HelperTooltip>

            <div className="grid gap-6 md:grid-cols-2">
              {bunnyFillings.map((curry) => (
                <CurryQuantityCard
                  key={curry.id}
                  curry={curry}
                  selection={bunnyFillingsState[curry.id]}
                  onAdd={(spiceLevel) => addCurry("bunny", curry.id, spiceLevel)}
                  onRemove={() => removeCurry("bunny", curry.id)}
                  onIncrement={() => incrementCurry("bunny", curry.id)}
                  onDecrement={() => decrementCurry("bunny", curry.id)}
                  onSpiceChange={(spiceLevel) => updateCurrySpice("bunny", curry.id, spiceLevel)}
                />
              ))}
            </div>

            {isOptional && totalBunnyFillings === 0 && (
              <div className="rounded-xl border-2 border-dashed border-ink-muted bg-gray-50 p-6 text-center">
                <p className="text-base font-bold text-ink-muted">
                  Not feeling bunny chow today?
                </p>
                <button
                  onClick={handleSkip}
                  className="mt-3 rounded-xl border-2 border-ink-muted px-6 py-3 text-sm font-bold text-ink-muted transition-all hover:border-brand-coral hover:bg-brand-coral hover:text-white"
                >
                  Continue without bunny fillings →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

