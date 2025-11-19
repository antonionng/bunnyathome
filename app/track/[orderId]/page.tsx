"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFromPence } from "@/lib/currency";
import { format } from "date-fns";

const statusSteps = [
  { status: "pending", label: "Order Placed", icon: "📝" },
  { status: "confirmed", label: "Payment Confirmed", icon: "✅" },
  { status: "preparing", label: "Preparing Your Order", icon: "👨‍🍳" },
  { status: "shipped", label: "Out for Delivery", icon: "🚚" },
  { status: "delivered", label: "Delivered", icon: "🎉" },
];

const statusVariants: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
  confirmed: "success",
  preparing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
  pending: "warning",
};

export default function TrackOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadTracking = async () => {
      try {
        const response = await fetch(`/api/tracking/${resolvedParams.orderId}`);
        if (response.ok) {
          const data = await response.json();
          setTrackingData(data);
        }
      } catch (error) {
        console.error("Failed to load tracking:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracking();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadTracking, 30000);
    return () => clearInterval(interval);
  }, [resolvedParams.orderId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!trackingData) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="rounded-2xl border-2 border-black bg-white p-12 shadow-lg">
          <h2 className="text-2xl font-bold text-ink">Order not found</h2>
          <Button className="mt-6" asChild>
            <Link href="/account/orders">View My Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex((step) => step.status === order.status);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Track Your Order</h1>
        <p className="mt-2 text-ink-muted">Order #{order.order_number}</p>
      </div>

      <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-muted">Current Status</p>
            <p className="mt-1 text-2xl font-bold text-ink capitalize">{order.status}</p>
          </div>
          <Badge variant={statusVariants[order.status] || "default"} className="text-base">
            {order.status}
          </Badge>
        </div>

        <div className="relative">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <div key={step.status} className="relative flex items-start gap-4 pb-8 last:pb-0">
                {index < statusSteps.length - 1 && (
                  <div
                    className={`absolute left-6 top-12 h-full w-0.5 ${
                      isCompleted ? "bg-brand-green" : "bg-gray-300"
                    }`}
                  />
                )}
                <div
                  className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 text-2xl transition-colors ${
                    isCompleted
                      ? "border-brand-green bg-brand-green"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="flex-1 pt-2">
                  <p
                    className={`font-bold ${
                      isCurrent ? "text-brand-curry" : isCompleted ? "text-ink" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="mt-1 text-sm text-ink-muted">
                      Updated {format(new Date(order.updated_at), "MMM d, h:mm a")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-ink">Delivery Details</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-bold text-ink">Address</p>
              <p className="text-ink-muted">{order.delivery_address.line1}</p>
              {order.delivery_address.line2 && (
                <p className="text-ink-muted">{order.delivery_address.line2}</p>
              )}
              <p className="text-ink-muted">
                {order.delivery_address.city}, {order.delivery_address.postcode}
              </p>
            </div>
            <div>
              <p className="font-bold text-ink">Expected Delivery</p>
              <p className="text-ink-muted">
                {format(new Date(order.delivery_date), "EEEE, MMMM d, yyyy")}
              </p>
              <p className="text-xs text-ink-muted capitalize">
                {order.delivery_time_slot} slot
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-ink">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Total Amount</span>
              <span className="font-bold text-ink">{formatFromPence(order.total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Placed On</span>
              <span className="text-ink">{format(new Date(order.created_at), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button asChild>
          <Link href={`/account/orders/${order.id}`}>View Full Order</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    </div>
  );
}



