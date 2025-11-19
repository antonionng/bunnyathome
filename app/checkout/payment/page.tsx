"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe/client";
import { useCartStore } from "@/store/cart-store";
import { useCartTotals } from "@/hooks/use-cart-totals";
import { useCheckoutStore } from "@/store/checkout-store";
import { createClient } from "@/lib/supabase/client";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const savePaymentMethod = useCheckoutStore((state) => state.savePaymentMethod);
  const setSavePaymentMethod = useCheckoutStore((state) => state.setSavePaymentMethod);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error("Eish, payment didn't go through", {
          description: error.message,
        });
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Create order in database
        try {
          const deliveryAddress = useCheckoutStore.getState().deliveryAddress;
          const deliverySchedule = useCheckoutStore.getState().deliverySchedule;
          const notes = useCheckoutStore.getState().notes;
          const guestEmail = useCheckoutStore.getState().guestEmail;
          const items = useCartStore.getState().items;
          const promoCode = useCartStore.getState().promoCode;
          const totals = useCartStore.getState().getTotals();

          const orderResponse = await fetch("/api/orders/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items,
              subtotal: totals.subtotal,
              deliveryFee: totals.deliveryFee,
              discount: totals.discount,
              total: totals.total,
              deliveryAddress,
              deliveryDate: deliverySchedule?.date,
              deliveryTimeSlot: deliverySchedule?.timeSlot,
              stripePaymentIntentId: paymentIntent.id,
              notes,
              guestEmail,
              promoCode: promoCode?.code,
            }),
          });

          if (!orderResponse.ok) {
            throw new Error("Failed to create order");
          }

          const { order } = await orderResponse.json();

          // Payment successful, redirect to confirmation
          router.push(`/checkout/confirmation/${paymentIntent.id}`);
        } catch (orderError) {
          console.error("Error creating order:", orderError);
          toast.error("Payment succeeded but order creation failed", {
            description: "Please contact support with your payment confirmation.",
          });
          router.push(`/checkout/confirmation/${paymentIntent.id}`);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Eish, something went wrong", {
        description: "Give it another bash, bru.",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border-2 border-black bg-white p-6">
        <PaymentElement />
      </div>

      <Checkbox
        id="savePayment"
        label="Stash this for next time"
        checked={savePaymentMethod}
        onChange={(e) => setSavePaymentMethod(e.target.checked)}
      />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => router.push("/checkout/schedule")}
          disabled={isProcessing}
        >
          Go back
        </Button>
        <Button
          type="submit"
          size="lg"
          className="flex-1"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? "Sorting it now..." : "Confirm order, sharp sharp"}
        </Button>
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const totals = useCartTotals();

  useEffect(() => {
    const createPayment = async () => {
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totals.total,
            metadata: {
              orderType: "bunny_box",
            },
          }),
        });

        const data = await response.json();

        if (data.error) {
          toast.error("Eish, payment setup failed", {
            description: data.error,
          });
          return;
        }

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Eish, couldn't set up payment");
      } finally {
        setIsLoading(false);
      }
    };

    createPayment();
  }, [totals.total]);

  if (isLoading || !clientSecret) {
    return (
      <div className="space-y-8">
        <CheckoutStepper currentStep="payment" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-curry border-t-transparent mx-auto" />
            <p className="text-ink-muted">Setting things up, hang tight...</p>
          </div>
        </div>
      </div>
    );
  }

  const stripePromise = getStripe();

  return (
    <div className="space-y-8">
      <CheckoutStepper currentStep="payment" />

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-xl font-bold text-ink">Let's Sort Payment</h2>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#F97316",
                    colorBackground: "#ffffff",
                    colorText: "#1a1a1a",
                    colorDanger: "#ef4444",
                    fontFamily: "system-ui, sans-serif",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <PaymentForm />
            </Elements>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg section-border-pink">
          <OrderSummary />
          
          <div className="mt-6 rounded-lg border-2 border-black bg-brand-blue/20 p-4 text-xs">
            <p className="font-bold text-ink">All secure, bru</p>
            <p className="mt-1 text-ink-muted">
              Your payment info is encrypted and safe. We never keep your card details, sharp sharp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


