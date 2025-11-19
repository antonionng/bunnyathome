"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl group flex flex-col overflow-hidden transition-all duration-300 shadow-xl",
        quantity > 0 ? "bg-brand-green border-3 border-black scale-[1.02]" : "border-3 border-black bg-white hover:-translate-y-2 hover:shadow-2xl"
      )}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
          sizes="(min-width: 1024px) 360px, 100vw"
          unoptimized
        />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold text-brand-black shadow-lg">
            {product.badge}
          </span>
        )}
        <span className="absolute right-4 top-4 rounded-full border-2 border-black bg-brand-curry px-3 py-1 text-xs font-bold text-brand-black shadow-lg">
          £{(product.price / 100).toFixed(2)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6 bg-white">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-ink">{product.name}</h3>
          <p className="text-sm text-ink-muted">{product.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between rounded-xl border-3 border-black bg-white px-3 py-3 text-sm text-ink">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => decrement(category, product.id)}
            disabled={quantity === 0}
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-white text-xl font-bold text-ink transition hover:bg-brand-coral hover:text-white disabled:opacity-30"
          >
            −
          </motion.button>
          <motion.span
            key={quantity}
            initial={{ scale: 1.2, color: "#c1d780" }}
            animate={{ scale: 1, color: "#000000" }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold"
          >
            {quantity}
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => increment(category, product)}
            disabled={reachMax}
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-white text-xl font-bold text-ink transition hover:bg-brand-green hover:text-white disabled:opacity-30"
          >
            +
          </motion.button>
        </div>
        {reachMax && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-brand-coral text-center"
          >
            Eish! Max {product.maxQuantity} to keep it balanced, boet.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}




