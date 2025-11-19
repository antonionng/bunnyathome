"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatFromPence } from "@/lib/currency";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrderStatusBadge, getStatusProgress, type OrderStatus } from "./order-status-badge";
import { QuickActionMenu, type QuickAction } from "./quick-action-menu";
import { Package, MapPin, RotateCcw, ExternalLink, XCircle, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface OrderCardProps {
  order: {
    id: string;
    order_number: string;
    status: string;
    total: number;
    items: any;
    delivery_date: string;
    created_at: string;
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const itemCount = Array.isArray(order.items)
    ? order.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
    : 0;

  const progress = getStatusProgress(order.status as OrderStatus);
  const isCancellable = ["pending", "confirmed"].includes(order.status);
  const isTrackable = ["preparing", "shipped"].includes(order.status);

  const handleReorder = async () => {
    toast.promise(
      async () => {
        // Simulate API call - replace with actual implementation
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/builder");
      },
      {
        loading: "Loading your order...",
        success: "Added to cart! Taking you to the builder...",
        error: "Couldn't load order. Try again, bru.",
      }
    );
  };

  const handleTrack = () => {
    router.push(`/track/${order.id}`);
  };

  const handleContact = () => {
    toast.info("Opening support chat...");
  };

  const handleCancel = () => {
    toast.error("Cancel functionality would go here", {
      description: "This would open a confirmation dialog",
    });
  };

  const quickActions: QuickAction[] = [
    {
      label: "View Details",
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: () => router.push(`/account/orders/${order.id}`),
    },
    {
      label: "Reorder",
      icon: <RotateCcw className="h-4 w-4" />,
      onClick: handleReorder,
    },
    ...(isTrackable
      ? [
          {
            label: "Track Order",
            icon: <MapPin className="h-4 w-4" />,
            onClick: handleTrack,
          },
        ]
      : []),
    ...(isCancellable
      ? [
          {
            label: "Cancel Order",
            icon: <XCircle className="h-4 w-4" />,
            onClick: handleCancel,
            variant: "danger" as const,
          },
        ]
      : [
          {
            label: "Contact Support",
            icon: <MessageCircle className="h-4 w-4" />,
            onClick: handleContact,
          },
        ]),
  ];

  // Get curry thumbnails (mock for now)
  const curryImages = order.items && Array.isArray(order.items)
    ? order.items.slice(0, 3).map((item: any, i: number) => (
        <div
          key={i}
          className="h-12 w-12 rounded-lg border-2 border-black bg-brand-curry/20 flex items-center justify-center"
        >
          <Package className="h-6 w-6 text-brand-curry" />
        </div>
      ))
    : null;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link
        href={`/account/orders/${order.id}`}
        className={cn(
          "block overflow-hidden rounded-2xl border-2 border-black bg-white transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-elevated"
        )}
      >
        {/* Status Progress Bar */}
        {progress > 0 && progress < 100 && (
          <div className="h-1.5 w-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full bg-brand-curry"
            />
          </div>
        )}

        <div className="p-5">
          {/* Header with Order Number and Status */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-bold text-ink">
                #{order.order_number}
              </h3>
              <OrderStatusBadge status={order.status as OrderStatus} />
            </div>
            <QuickActionMenu actions={quickActions} />
          </div>

          {/* Curry Thumbnails */}
          {curryImages && curryImages.length > 0 && (
            <div className="mb-4 flex gap-2">
              {curryImages}
              {itemCount > 3 && (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-gray-50 text-xs font-bold text-ink">
                  +{itemCount - 3}
                </div>
              )}
            </div>
          )}

          {/* Order Details */}
          <div className="space-y-2 border-t-2 border-black/5 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Placed</span>
              <span className="font-medium text-ink">
                {format(new Date(order.created_at), "MMM d, yyyy")}
              </span>
            </div>
            
            {order.delivery_date && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">Delivery</span>
                <span className="font-bold text-brand-curry">
                  {format(new Date(order.delivery_date), "MMM d, yyyy")}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Items</span>
              <span className="font-medium text-ink">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          {/* Total Price */}
          <div className="mt-4 flex items-center justify-between border-t-2 border-black pt-4">
            <span className="text-sm font-bold uppercase tracking-wider text-ink-muted">
              Total
            </span>
            <span className="text-2xl font-bold text-ink">
              {formatFromPence(order.total)}
            </span>
          </div>
        </div>

        {/* Hover Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-brand-curry"
        />
      </Link>
    </motion.div>
  );
}



