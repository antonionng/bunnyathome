import type { CartItem } from "./cart";
import type { DeliveryAddress, DeliverySchedule } from "./checkout";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  stripePaymentIntentId?: string;
  deliveryAddress: DeliveryAddress;
  deliverySchedule: DeliverySchedule;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface OrderTimeline {
  orderId: string;
  updates: OrderStatusUpdate[];
}



