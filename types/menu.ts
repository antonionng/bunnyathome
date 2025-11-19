import type { AvailabilityStatus, DietaryTag, SpiceLevel } from "./builder";

export type MenuCatalogCategory = "bunnyFillings" | "familyCurries" | "sides" | "sauces" | "drinks";

export type MenuDisplayCategory =
  | "Bunny fillings"
  | "Family curries"
  | "Breads & bases"
  | "Sides & garnish"
  | "Extras & treats"
  | "Drinks";

export interface MenuProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  spiceLevel?: SpiceLevel;
  heatNotes?: string;
  serves?: string;
  dietaryTags?: DietaryTag[];
  highlights?: string[];
  availability?: AvailabilityStatus;
  deliveryNote?: string;
  allergens?: string[];
  maxQuantity?: number;
  catalogCategory: MenuCatalogCategory;
  displayCategory: MenuDisplayCategory;
}

