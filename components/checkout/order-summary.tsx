"use client";

import { useCartStore } from "@/store/cart-store";
import { useCartTotals } from "@/hooks/use-cart-totals";
import { formatFromPence } from "@/lib/currency";
import { CartItem } from "@/components/cart/cart-item";
import { DeliveryInfo } from "@/components/ui/delivery-info";

interface OrderSummaryProps {
  editable?: boolean;
}

export function OrderSummary({ editable = false }: OrderSummaryProps) {
  const items = useCartStore((state) => state.items);
  const totals = useCartTotals();
  const promoCode = useCartStore((state) => state.promoCode);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-bold text-ink">Order Summary</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} editable={editable} compact />
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t-2 border-black pt-4 text-sm">
        <div className="flex items-center justify-between text-ink">
          <span>Subtotal</span>
          <span className="font-bold">{formatFromPence(totals.subtotal)}</span>
        </div>

        {totals.discount > 0 && (
          <div className="flex items-center justify-between text-brand-green">
            <span>Discount {promoCode?.code && `(${promoCode.code})`}</span>
            <span className="font-bold">-{formatFromPence(totals.discount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-ink">
          <span>Delivery</span>
          <span className="font-bold">
            {totals.deliveryFee === 0 ? "Free" : formatFromPence(totals.deliveryFee)}
          </span>
        </div>

        <div className="border-t-2 border-black pt-3">
          <div className="flex items-center justify-between text-lg font-bold text-ink">
            <span>Total</span>
            <span>{formatFromPence(totals.total)}</span>
          </div>
        </div>
        <DeliveryInfo variant="compact" />
      </div>
    </div>
  );
}



