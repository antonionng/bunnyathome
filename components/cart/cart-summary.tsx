"use client";

import { useCartStore } from "@/store/cart-store";
import { useCartTotals } from "@/hooks/use-cart-totals";
import { formatFromPence } from "@/lib/currency";
import { DeliveryInfo } from "@/components/ui/delivery-info";

interface CartSummaryProps {
  className?: string;
}

export function CartSummary({ className }: CartSummaryProps) {
  const totals = useCartTotals();
  const promoCode = useCartStore((state) => state.promoCode);

  return (
    <div className={`space-y-3 rounded-lg bg-brand-blue p-5 text-sm ${className || ""}`}>
      <div className="flex items-center justify-between text-brand-black">
        <span>Subtotal</span>
        <span className="font-bold">{formatFromPence(totals.subtotal)}</span>
      </div>

      {totals.discount > 0 && (
        <div className="flex items-center justify-between text-brand-green">
          <span>
            Discount {promoCode?.code && `(${promoCode.code})`}
          </span>
          <span className="font-bold">
            -{formatFromPence(totals.discount)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-brand-black">
        <span>Delivery</span>
        <span className="font-bold">
          {totals.deliveryFee === 0 ? "Free" : formatFromPence(totals.deliveryFee)}
        </span>
      </div>

      <div className="border-t-2 border-black pt-3">
        <div className="flex items-center justify-between text-lg font-bold text-brand-black">
          <span>Total</span>
          <span>{formatFromPence(totals.total)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-brand-black/80">
          Taxes calculated at checkout. Delivery, loyalty redemptions, and tips can be adjusted in checkout.
        </p>
        <DeliveryInfo variant="compact" />
      </div>
    </div>
  );
}



