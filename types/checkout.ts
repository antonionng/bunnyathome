export type CheckoutStep = "cart" | "auth" | "delivery" | "schedule" | "payment" | "confirmation";

export interface DeliveryAddress {
  id?: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  isDefault?: boolean;
  deliveryInstructions?: string;
}

export interface DeliverySchedule {
  date: Date;
  timeSlot: "morning" | "afternoon" | "evening";
}

export type SubscriptionFrequency = "none" | "weekly" | "biweekly" | "monthly";

export interface CheckoutState {
  step: CheckoutStep;
  deliveryAddress: DeliveryAddress | null;
  deliverySchedule: DeliverySchedule | null;
  subscriptionFrequency: SubscriptionFrequency;
  saveAddress: boolean;
  savePaymentMethod: boolean;
  guestEmail: string | null;
  notes: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  value: "morning" | "afternoon" | "evening";
  timeRange: string;
  available: boolean;
}



