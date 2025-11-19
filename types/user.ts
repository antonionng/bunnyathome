export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  pointsBalance: number;
  referralCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  status: "active" | "paused" | "cancelled";
  planType: string;
  frequency: "weekly" | "biweekly" | "monthly";
  nextDeliveryDate: Date;
  configuration: any; // BuilderSelection
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedBox {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  configuration: any; // BuilderSelection
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}



