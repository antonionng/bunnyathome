"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { Button } from "@/components/ui/button";
import { formatFromPence } from "@/lib/currency";
import { format } from "date-fns";

interface Order {
  id: string;
  order_number: string;
  total: number;
  delivery_date: string;
  delivery_time_slot: string;
  delivery_address: any;
  status: string;
  created_at: string;
}

export default function ConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const clearCart = useCartStore((state) => state.clearCart);
  const resetCheckout = useCheckoutStore((state) => state.reset);
  const supabase = createClient();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("stripe_payment_intent_id", resolvedParams.orderId)
          .single();

        if (error) {
          console.error("Error loading order:", error);
        } else {
          setOrder(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();

    // Clear cart and checkout state
    clearCart();
    resetCheckout();
  }, [resolvedParams.orderId, supabase, clearCart, resetCheckout]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-curry border-t-transparent mx-auto" />
          <p className="text-ink-muted">Fetching your order, hang tight...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="rounded-2xl border-2 border-black bg-white p-12 shadow-lg">
          <div className="mb-6 text-6xl text-red-500">✗</div>
          <h1 className="mb-4 text-3xl font-bold text-ink">Eish, can't find that order</h1>
          <p className="mb-8 text-ink-muted">
            Check your email for the confirmation, or give us a shout if you need help, bru.
          </p>
          <Button size="lg" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="rounded-2xl border-2 border-black bg-white p-12 text-center shadow-lg section-border-green">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-green">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-ink">Sorted, boet!</h1>
        <p className="mb-2 text-xl text-ink-muted">
          Your bunny chow box is confirmed and on the way
        </p>
        <p className="text-2xl font-bold text-brand-curry">
          Order #{order.order_number}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-ink">Where it's going</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-bold text-ink">Drop-off spot</p>
              <p className="text-ink-muted">{order.delivery_address.line1}</p>
              {order.delivery_address.line2 && (
                <p className="text-ink-muted">{order.delivery_address.line2}</p>
              )}
              <p className="text-ink-muted">
                {order.delivery_address.city}, {order.delivery_address.postcode}
              </p>
            </div>
            <div>
              <p className="font-bold text-ink">When it lands</p>
              <p className="text-ink-muted">
                {format(new Date(order.delivery_date), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="font-bold text-ink">Time slot</p>
              <p className="text-ink-muted capitalize">{order.delivery_time_slot}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-ink">What you paid</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Total sorted</span>
              <span className="font-bold text-ink">{formatFromPence(order.total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Status</span>
              <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-bold uppercase">
                {order.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border-2 border-black bg-brand-blue/20 p-6 text-sm">
        <p className="font-bold text-ink">Check your email, bru</p>
        <p className="mt-2 text-ink-muted">
          We've sent all the deets to your inbox. You'll get updates when your box is getting sorted and on its way.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" asChild>
          <Link href="/account/orders">Check my orders</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/builder">Build another one</Link>
        </Button>
      </div>
    </div>
  );
}


