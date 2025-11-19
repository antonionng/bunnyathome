"use client";

import { useCartStore } from "@/store/cart-store";
import { formatFromPence } from "@/lib/currency";

export function VolumeDiscountBanner() {
  const items = useCartStore((state) => state.items);
  const getVolumeDiscount = useCartStore((state) => state.getVolumeDiscount);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const volumeDiscount = getVolumeDiscount();

  // Calculate next tier
  let nextTier = 5;
  let nextDiscount = "5%";
  let itemsNeeded = 5 - itemCount;

  if (itemCount >= 15) {
    // Already at max tier
    return (
      <div className="rounded-lg border-2 border-brand-green bg-brand-green/20 p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold text-ink">Maximum discount unlocked!</p>
            <p className="text-sm text-ink-muted">
              You're saving {formatFromPence(volumeDiscount)} with 15% off
            </p>
          </div>
        </div>
      </div>
    );
  } else if (itemCount >= 10) {
    nextTier = 15;
    nextDiscount = "15%";
    itemsNeeded = 15 - itemCount;
  } else if (itemCount >= 5) {
    nextTier = 10;
    nextDiscount = "10%";
    itemsNeeded = 10 - itemCount;
  }

  if (volumeDiscount > 0) {
    // Currently has discount
    return (
      <div className="rounded-lg border-2 border-brand-green bg-brand-green/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-bold text-ink">Volume discount applied!</p>
              <p className="text-sm text-ink-muted">
                Saving {formatFromPence(volumeDiscount)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-muted">Add {itemsNeeded} more for</p>
            <p className="font-bold text-brand-green">{nextDiscount} off</p>
          </div>
        </div>
      </div>
    );
  }

  // No discount yet
  return (
    <div className="rounded-lg border-2 border-brand-curry bg-brand-curry/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <div>
            <p className="font-bold text-ink">Volume discount available!</p>
            <p className="text-sm text-ink-muted">
              Add {itemsNeeded} more {itemsNeeded === 1 ? "item" : "items"} to get {nextDiscount} off
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/50">
        <div
          className="h-full bg-brand-curry transition-all"
          style={{ width: `${(itemCount / nextTier) * 100}%` }}
        />
      </div>
    </div>
  );
}

