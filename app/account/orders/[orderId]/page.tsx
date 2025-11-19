"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/components/cart/cart-item";
import { formatFromPence } from "@/lib/currency";
import { format } from "date-fns";
import { toast } from "sonner";

const statusVariants: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
  confirmed: "success",
  preparing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
  pending: "warning",
};

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const supabase = createClient();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", resolvedParams.orderId)
        .single();

      setOrder(data);
      setIsLoading(false);
    };

    loadOrder();
  }, [resolvedParams.orderId, supabase]);

  const handleReorder = async () => {
    setIsReordering(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/reorder`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reorder");
      }

      const { items } = await response.json();

      // Add items to cart
      items.forEach((item: any) => {
        addItem(item);
      });

      toast.success("Items added to cart!", {
        description: `${items.length} items from order #${order.order_number}`,
      });

      router.push("/cart");
    } catch (error) {
      toast.error("Eish, couldn't reorder", {
        description: "Give it another bash, bru.",
      });
    } finally {
      setIsReordering(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return (
      <div className="rounded-2xl border-2 border-black bg-white p-12 text-center shadow-lg">
        <h2 className="text-2xl font-bold text-ink">Order not found</h2>
        <Button className="mt-6" asChild>
          <Link href="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Order #{order.order_number}</h1>
          <p className="mt-2 text-ink-muted">
            Placed on {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <Badge variant={statusVariants[order.status] || "default"} className="text-base">
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-ink">Order Items</h2>
            <div className="space-y-4">
              {order.items && Array.isArray(order.items) && order.items.map((item: any) => (
                <CartItem key={item.id} item={item} editable={false} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-ink">Delivery Information</h2>
            <div className="space-y-4 text-sm">
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
                <p className="font-bold text-ink">Delivery Date</p>
                <p className="text-ink-muted">
                  {format(new Date(order.delivery_date), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="font-bold text-ink">Time Slot</p>
                <p className="text-ink-muted capitalize">{order.delivery_time_slot}</p>
              </div>
              {order.delivery_address.deliveryInstructions && (
                <div>
                  <p className="font-bold text-ink">Delivery Instructions</p>
                  <p className="text-ink-muted">{order.delivery_address.deliveryInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-ink">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Subtotal</span>
                <span className="font-bold text-ink">{formatFromPence(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-brand-green">
                  <span>Discount</span>
                  <span className="font-bold">-{formatFromPence(order.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Delivery</span>
                <span className="font-bold text-ink">
                  {order.delivery_fee === 0 ? "Free" : formatFromPence(order.delivery_fee)}
                </span>
              </div>
              <div className="border-t-2 border-black pt-3">
                <div className="flex items-center justify-between text-lg font-bold text-ink">
                  <span>Total</span>
                  <span>{formatFromPence(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleReorder} disabled={isReordering}>
              {isReordering ? "Adding to cart..." : "Order this again"}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/track/${order.id}`}>Track Order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}



