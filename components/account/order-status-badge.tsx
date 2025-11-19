import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  PackageCheck,
  XCircle,
} from "lucide-react";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    variant: "success" | "warning" | "error" | "info" | "default";
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  pending: {
    label: "Just Now",
    variant: "warning",
    icon: Clock,
    color: "text-brand-curry",
  },
  confirmed: {
    label: "Confirmed",
    variant: "success",
    icon: CheckCircle,
    color: "text-brand-green",
  },
  preparing: {
    label: "Getting Sorted",
    variant: "info",
    icon: Package,
    color: "text-brand-blue",
  },
  shipped: {
    label: "On The Way",
    variant: "info",
    icon: Truck,
    color: "text-brand-blue",
  },
  delivered: {
    label: "Delivered",
    variant: "success",
    icon: PackageCheck,
    color: "text-brand-green",
  },
  cancelled: {
    label: "Cancelled",
    variant: "error",
    icon: XCircle,
    color: "text-red-600",
  },
};

export function OrderStatusBadge({
  status,
  className,
  showIcon = true,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={cn("gap-1.5", className)}>
      {showIcon && <Icon className={cn("h-3 w-3", config.color)} />}
      <span>{config.label}</span>
    </Badge>
  );
}

export function getStatusProgress(status: OrderStatus): number {
  const progressMap: Record<OrderStatus, number> = {
    pending: 10,
    confirmed: 25,
    preparing: 50,
    shipped: 75,
    delivered: 100,
    cancelled: 0,
  };
  return progressMap[status] || 0;
}

