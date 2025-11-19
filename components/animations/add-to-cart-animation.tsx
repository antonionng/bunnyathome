"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface AddToCartAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export function AddToCartAnimation({ show, onComplete }: AddToCartAnimationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={onComplete}
      className="pointer-events-none fixed left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-green shadow-2xl">
        <ShoppingCart className="h-12 w-12 text-white" />
      </div>
    </motion.div>
  );
}

