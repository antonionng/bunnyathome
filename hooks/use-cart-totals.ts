"use client";

import { useMemo } from "react";
import { useCartStore, calculateCartTotals } from "@/store/cart-store";
import type { CartTotals } from "@/types/cart";

export function useCartTotals(): CartTotals {
  const items = useCartStore((state) => state.items);
  const promoCode = useCartStore((state) => state.promoCode);

  return useMemo(() => calculateCartTotals(items, promoCode), [items, promoCode]);
}

