"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { formatFromPence } from "@/lib/currency";
import type { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
  editable?: boolean;
  compact?: boolean;
}

export function CartItem({ item, editable = true, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className={`flex gap-4 ${compact ? "items-center" : "items-start"}`}>
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 border-black">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-bold text-ink">{item.name}</h4>
            {item.spiceLevel && (
              <p className="text-xs font-bold uppercase tracking-wider text-brand-coral">
                {item.spiceLevel}
              </p>
            )}
          </div>
          <p className="font-bold text-ink">
            {formatFromPence(item.price * item.quantity)}
          </p>
        </div>

        {editable ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-white font-bold text-ink transition-colors hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-bold text-ink">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.maxQuantity ? item.quantity >= item.maxQuantity : false}
                className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-white font-bold text-ink transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="text-sm text-ink-muted">Qty {item.quantity}</p>
        )}
      </div>
    </div>
  );
}



