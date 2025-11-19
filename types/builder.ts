export type SpiceLevel = "Mild" | "Hot" | "Very Hot";

export type ProductCategory =
  | "curry"
  | "side"
  | "sauce"
  | "drink";

export interface CurrySelection {
  quantity: number;
  spiceLevel: SpiceLevel;
}

export type DietaryTag =
  | "Vegan"
  | "Vegetarian"
  | "Gluten-free"
  | "Dairy-free"
  | "Nut-free"
  | "Halal"
  | "High protein";

export type AvailabilityStatus = "in-stock" | "limited" | "preorder";

export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  price: number; // stored in pennies
  image: string;
  badge?: string;
  serves?: string;
  dietaryTags?: DietaryTag[];
  highlights?: string[];
  availability?: AvailabilityStatus;
  deliveryNote?: string;
  allergens?: string[];
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
  bunnyFillings: CurryProduct[];
  familyCurries: CurryProduct[];
  sides: QuantityProduct[];
  sauces: QuantityProduct[];
  drinks: QuantityProduct[];
}

export type BuilderStep =
  | "bunny-builder"
  | "curry"
  | "sides"
  | "sauces"
  | "drinks"
  | "summary";

export type BuilderFlow = "bunny" | "curry" | null;

export interface BuilderSelection {
  bunnyFillings: Record<string, CurrySelection>;
  familyCurries: Record<string, CurrySelection>;
  sides: Record<string, number>;
  sauces: Record<string, number>;
  drinks: Record<string, number>;
  notes?: string;
}

export interface CalculatedTotals {
  subtotal: number;
  itemCount: number;
}



