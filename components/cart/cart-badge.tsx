"use client";

import { useCartStore } from "@/store/cart-store";

export function CartBadge() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-coral text-xs font-bold text-white">
      {itemCount > 9 ? "9+" : itemCount}
    </span>
  );
}



