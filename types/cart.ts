import type { BuilderSelection } from "./builder";
import type { MenuCatalogCategory } from "./menu";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number; // in pence
  quantity: number;
  image: string;
  type: "bunny" | "family" | "side" | "sauce" | "drink";
  spiceLevel?: string;
  maxQuantity?: number;
}

export interface PromoCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  isValid: boolean;
  errorMessage?: string;
}

export interface CartState {
  items: CartItem[];
  promoCode: PromoCode | null;
  lastSyncedAt: Date | null;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

export interface AddToCartPayload {
  selection: BuilderSelection;
  catalog: {
    bunnyFillings: Array<{ id: string; name: string; price: number; image: string }>;
    familyCurries: Array<{ id: string; name: string; price: number; image: string }>;
    sides: Array<{ id: string; name: string; price: number; image: string; maxQuantity?: number }>;
    sauces: Array<{ id: string; name: string; price: number; image: string; maxQuantity?: number }>;
    drinks: Array<{ id: string; name: string; price: number; image: string; maxQuantity?: number }>;
  };
}

export interface AddCatalogItemPayload {
  productId: string;
  name: string;
  price: number;
  image: string;
  catalogCategory: MenuCatalogCategory;
  quantity?: number;
  spiceLevel?: string;
  maxQuantity?: number;
}

export interface AddCatalogItemResult {
  added: boolean;
  limitReached?: boolean;
  remaining?: number;
}



