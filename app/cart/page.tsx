"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useCartTotals } from "@/hooks/use-cart-totals";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeliveryInfo } from "@/components/ui/delivery-info";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { EmptyBoxIllustration } from "@/components/icons/account-icons";
import { RecommendationsSection } from "@/components/recommendations/recommendations-section";
import { VolumeDiscountBanner } from "@/components/cart/volume-discount-banner";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const promoCode = useCartStore((state) => state.promoCode);
  const applyPromoCode = useCartStore((state) => state.applyPromoCode);
  const totals = useCartTotals();

  const [promoInput, setPromoInput] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const { confirm, dialogProps } = useConfirmDialog();

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;

    setIsApplyingPromo(true);
    try {
      // Validate promo code with API
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.toUpperCase() }),
      });

      const data = await response.json();

      if (data.isValid) {
        applyPromoCode({
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          isValid: true,
        });
        toast.success("Promo code applied!", {
          description: `You saved ${data.discountType === "percentage" ? `${data.discountValue}%` : `£${(data.discountValue / 100).toFixed(2)}`}`,
        });
      } else {
        toast.error("Invalid promo code", {
          description: data.errorMessage || "This code is not valid or has expired.",
        });
      }
    } catch (error) {
      toast.error("Could not apply code", {
        description: "Please try again later.",
      });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    applyPromoCode(null);
    setPromoInput("");
    toast.success("Promo code removed");
  };

  const handleClearCart = () => {
    confirm({
      title: "Clear Cart?",
      description: "This will remove all items from your cart. This action cannot be undone.",
      confirmText: "Clear Cart",
      cancelText: "Keep Items",
      variant: "danger",
      onConfirm: () => {
        clearCart();
        toast.success("Cart cleared successfully");
      },
    });
  };

  const handleCheckout = () => {
    router.push("/checkout/delivery");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="rounded-2xl border-2 border-black bg-white p-12 shadow-lg">
          <EmptyBoxIllustration className="w-32 h-32 mb-6" />
          <h1 className="mb-4 text-3xl font-bold text-ink">Your cart is empty</h1>
          <p className="mb-8 text-ink-muted">
            Start building your Durban bunny chow box to get delicious curry delivered to your door!
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/builder">Build your box</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Back home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Your Cart</h1>
        <p className="mt-2 text-ink-muted">
          Review your items and proceed to checkout when ready
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Volume discount banner */}
          <VolumeDiscountBanner />

          <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink">Cart Items</h2>
              <button
                onClick={handleClearCart}
                className="text-sm font-bold text-red-600 hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="border-b-2 border-gray-100 pb-6 last:border-0 last:pb-0">
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-ink">Have a promo code?</h3>

            {promoCode?.isValid ? (
              <div className="flex items-center justify-between rounded-lg border-2 border-brand-green bg-brand-green/20 p-4">
                <div>
                  <p className="font-bold text-ink">{promoCode.code}</p>
                  <p className="text-sm text-ink-muted">
                    {promoCode.discountType === "percentage"
                      ? `${promoCode.discountValue}% off`
                      : `£${(promoCode.discountValue / 100).toFixed(2)} off`}
                  </p>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-sm font-bold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Drop your code here"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleApplyPromo();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleApplyPromo}
                  disabled={!promoInput.trim() || isApplyingPromo}
                  variant="outline"
                  className="min-w-[100px]"
                >
                  {isApplyingPromo ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>Checking...</span>
                    </span>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg section-border-pink">
            <h2 className="mb-4 text-xl font-bold text-ink">Order Summary</h2>
            <CartSummary />

            <div className="mt-6 space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                asChild
              >
                <Link href="/builder">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border-2 border-black bg-brand-curry/20 p-4 text-sm">
            <DeliveryInfo variant="compact" />
            <div>
              <p className="font-bold text-ink">Free delivery on orders over £50!</p>
              {totals.subtotal < 5000 ? (
                <p className="mt-1 text-xs text-ink-muted">
                  Add £{((5000 - totals.subtotal) / 100).toFixed(2)} more to qualify for free delivery.
                </p>
              ) : (
                <p className="mt-1 text-xs text-brand-green font-semibold">
                  Nice one — you've unlocked free delivery this drop.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {items.length > 0 && (
        <div className="mt-12">
          <RecommendationsSection
            title="Complete Your Box"
            type="cart"
            limit={6}
          />
        </div>
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}


