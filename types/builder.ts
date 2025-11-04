export type SpiceLevel = "Mild" | "Hot" | "Very Hot";

export type ProductCategory =
  | "curry"
  | "side"
  | "sauce"
  | "drink";

export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  price: number; // stored in pennies
  image: string;
  badge?: string;
}

export interface CurryProduct extends BaseProduct {
  spiceLevel: SpiceLevel;
  heatNotes: string;
  bunnyImage?: string;
}

export interface QuantityProduct extends BaseProduct {
  maxQuantity?: number;
}

export interface BuilderCatalog {
  curries: CurryProduct[];
  sides: QuantityProduct[];
  sauces: QuantityProduct[];
  drinks: QuantityProduct[];
}

export type BuilderStep =
  | "curry"
  | "sides"
  | "sauces"
  | "drinks"
  | "summary";

export interface BuilderSelection {
  curryId: string | null;
  currySpiceLevel: SpiceLevel;
  sides: Record<string, number>;
  sauces: Record<string, number>;
  drinks: Record<string, number>;
  notes?: string;
}

export interface CalculatedTotals {
  subtotal: number;
  itemCount: number;
}



