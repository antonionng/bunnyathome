"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useCartTotals } from "@/hooks/use-cart-totals";
import { CartItem } from "./cart-item";
import { Button } from "@/components/ui/button";
import { formatFromPence } from "@/lib/currency";

export function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const items = useCartStore((state) => state.items);
  const totals = useCartTotals();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (items.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-bold text-ink transition-colors hover:text-brand-curry"
        aria-label="View cart"
      >
        Cart ({totals.itemCount})
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[380px] rounded-lg border-2 border-black bg-white shadow-lg">
          <div className="border-b-2 border-black p-4">
            <h3 className="font-bold text-ink">Your Cart</h3>
            <p className="text-sm text-ink-muted">{totals.itemCount} items</p>
          </div>

          <div className="max-h-[400px] space-y-4 overflow-y-auto p-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} compact />
            ))}
          </div>

          <div className="border-t-2 border-black p-4">
            <div className="mb-4 flex items-center justify-between font-bold text-ink">
              <span>Total</span>
              <span>{formatFromPence(totals.total)}</span>
            </div>
            <Button asChild size="md" className="w-full">
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                View Cart & Checkout
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}



