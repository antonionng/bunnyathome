export type AdminRole = "super_admin" | "admin" | "operations" | "support";

export interface AdminPermissions {
  canManageProducts: boolean;
  canManageOrders: boolean;
  canManageCustomers: boolean;
  canManageInventory: boolean;
  canViewAnalytics: boolean;
  canManageAdmins: boolean;
  canManageSettings: boolean;
  canUseAIFeatures: boolean;
}

export type NotificationPriority = "critical" | "high" | "medium" | "low";

export type AdminNotificationType = "order" | "stock" | "payment" | "customer" | "system";

export interface AdminNotification {
  id: string;
  notificationType: AdminNotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: any;
  entityType?: string;
  entityId?: string;
  assignedTo?: string;
  isRead: boolean;
  readAt?: Date;
  readBy?: string;
  actionRequired: boolean;
  actionTaken: boolean;
  actionTakenAt?: Date;
  actionTakenBy?: string;
  createdAt: Date;
}

export type StockAlertType = "low_stock" | "out_of_stock" | "reorder_needed";

export interface StockAlert {
  id: string;
  productId: string;
  alertType: StockAlertType;
  currentStock: number;
  threshold: number;
  status: "active" | "acknowledged" | "resolved";
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
}

export type InventoryAdjustmentType = "restock" | "sold" | "damaged" | "expired" | "manual";

export interface InventoryAdjustment {
  id: string;
  productId: string;
  adjustmentType: InventoryAdjustmentType;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  notes?: string;
  adjustedBy?: string;
  orderId?: string;
  createdAt: Date;
}

export interface OrderFilter {
  status?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: string;
  searchTerm?: string;
  minTotal?: number;
  maxTotal?: number;
}

export interface CustomerFilter {
  searchTerm?: string;
  loyaltyTier?: string[];
  minSpend?: number;
  maxSpend?: number;
  minOrders?: number;
  hasSubscription?: boolean;
}

export type AIGenerationType = "description" | "image" | "box_suggestion" | "seasonal_box" | "marketing_copy";

export interface AIGeneration {
  id: string;
  generationType: AIGenerationType;
  entityType: string;
  entityId?: string;
  prompt: string;
  model: string;
  parameters?: any;
  result?: string;
  resultMetadata?: any;
  tokensUsed?: number;
  costCents?: number;
  status: "pending" | "completed" | "failed";
  errorMessage?: string;
  generatedBy?: string;
  createdAt: Date;
}

export type BoxType = "seasonal" | "occasion" | "curated" | "bundle";

export interface BoxSuggestion {
  id: string;
  name: string;
  description: string;
  marketingCopy?: string;
  boxType: BoxType;
  theme?: string;
  season?: string;
  occasion?: string;
  products: BoxProduct[];
  totalPrice: number;
  discountedPrice?: number;
  imageUrl?: string;
  aiGenerated: boolean;
}

export interface BoxProduct {
  productId: string;
  quantity: number;
  priceOverride?: number;
}

export interface AdminActivityLog {
  id: string;
  adminId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: Date;
}

export interface DashboardMetrics {
  revenue: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  orders: {
    pending: number;
    confirmed: number;
    preparing: number;
    shipped: number;
    delivered: number;
    total: number;
  };
  customers: {
    total: number;
    new: number;
    active: number;
  };
  inventory: {
    lowStock: number;
    outOfStock: number;
    totalProducts: number;
  };
}

export interface AdminNotificationPreferences {
  id: string;
  adminId: string;
  notificationType: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  minPriority: NotificationPriority;
}

// Helper function to get permissions based on role
export function getAdminPermissions(role?: AdminRole): AdminPermissions {
  switch (role) {
    case "super_admin":
      return {
        canManageProducts: true,
        canManageOrders: true,
        canManageCustomers: true,
        canManageInventory: true,
        canViewAnalytics: true,
        canManageAdmins: true,
        canManageSettings: true,
        canUseAIFeatures: true,
      };
    case "admin":
      return {
        canManageProducts: true,
        canManageOrders: true,
        canManageCustomers: true,
        canManageInventory: true,
        canViewAnalytics: true,
        canManageAdmins: false,
        canManageSettings: false,
        canUseAIFeatures: true,
      };
    case "operations":
      return {
        canManageProducts: false,
        canManageOrders: true,
        canManageCustomers: false,
        canManageInventory: true,
        canViewAnalytics: true,
        canManageAdmins: false,
        canManageSettings: false,
        canUseAIFeatures: false,
      };
    case "support":
      return {
        canManageProducts: false,
        canManageOrders: true,
        canManageCustomers: true,
        canManageInventory: false,
        canViewAnalytics: false,
        canManageAdmins: false,
        canManageSettings: false,
        canUseAIFeatures: false,
      };
    default:
      return {
        canManageProducts: false,
        canManageOrders: false,
        canManageCustomers: false,
        canManageInventory: false,
        canViewAnalytics: false,
        canManageAdmins: false,
        canManageSettings: false,
        canUseAIFeatures: false,
      };
  }
}

