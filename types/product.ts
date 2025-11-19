import type { DietaryTag, SpiceLevel, AvailabilityStatus } from "./builder";

export type ProductCategory = "bunnyFillings" | "familyCurries" | "sides" | "sauces" | "drinks";

export type ProductDisplayCategory =
  | "Bunny fillings"
  | "Family curries"
  | "Breads & bases"
  | "Sides & garnish"
  | "Extras & treats"
  | "Drinks";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  category: ProductCategory;
  displayCategory: ProductDisplayCategory;
  imageUrl?: string;
  badge?: string;
  spiceLevel?: SpiceLevel;
  heatNotes?: string;
  serves?: string;
  dietaryTags?: DietaryTag[];
  highlights?: string[];
  allergens?: string[];
  availability: AvailabilityStatus;
  deliveryNote?: string;
  maxQuantity?: number;
  stockLevel: number;
  lowStockThreshold: number;
  reorderPoint: number;
  supplierInfo?: SupplierInfo;
  sku?: string;
  isActive: boolean;
  aiGenerated: boolean;
  aiGenerationId?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
  aiGenerated: boolean;
  dallePrompt?: string;
  dalleMetadata?: any;
  createdAt: Date;
}

export interface SupplierInfo {
  supplierName?: string;
  supplierContact?: string;
  supplierEmail?: string;
  leadTimeDays?: number;
  minimumOrderQuantity?: number;
  unitCost?: number; // in cents
  notes?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  displayCategory: ProductDisplayCategory;
  badge?: string;
  spiceLevel?: SpiceLevel;
  heatNotes?: string;
  serves?: string;
  dietaryTags?: DietaryTag[];
  highlights?: string[];
  allergens?: string[];
  availability: AvailabilityStatus;
  deliveryNote?: string;
  maxQuantity?: number;
  stockLevel: number;
  lowStockThreshold: number;
  reorderPoint: number;
  supplierInfo?: SupplierInfo;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface AIDescriptionRequest {
  productName: string;
  category: ProductCategory;
  ingredients?: string[];
  spiceLevel?: SpiceLevel;
  servingSize?: string;
  specialFeatures?: string[];
}

export interface AIDescriptionResponse {
  description: string;
  heatNotes?: string;
  highlights?: string[];
  seoTitle?: string;
  seoDescription?: string;
  marketingCopy?: string;
}

export interface AIImageRequest {
  productName: string;
  category: ProductCategory;
  description: string;
  style?: string;
  theme?: string; // For themed boxes: 'valentines', 'halloween', etc.
  occasion?: string;
}

export interface AIImageResponse {
  imageUrl: string;
  prompt: string;
  revisedPrompt?: string;
  metadata?: any;
}

export interface ReadyBox {
  id: string;
  name: string;
  slug: string;
  description: string;
  marketingCopy?: string;
  boxType: "seasonal" | "occasion" | "curated" | "bundle";
  theme?: string; // 'valentines', 'halloween', 'heritage-month', 'rugby-season'
  season?: string; // 'summer', 'winter', 'spring', 'autumn'
  occasion?: string; // 'fathers-day', 'mothers-day', 'easter'
  month?: number; // 1-12
  year?: number;
  products: BoxProductItem[];
  totalPrice: number;
  discountedPrice?: number;
  imageUrl?: string;
  badge?: string;
  dietaryTags?: string[];
  serves?: string;
  isActive: boolean;
  isPublished: boolean;
  aiGenerated: boolean;
  aiGenerationId?: string;
  launchDate?: Date;
  endDate?: Date;
  maxQuantityAvailable?: number;
  currentSales: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  publishedAt?: Date;
  publishedBy?: string;
}

export interface BoxProductItem {
  productId: string;
  quantity: number;
  priceOverride?: number;
  product?: Product; // Populated when fetching
}

export interface SeasonalBoxRequest {
  season?: string;
  month?: number;
  occasion?: string;
  theme?: string;
  pricePoint?: number; // Target price in cents
  dietaryPreferences?: DietaryTag[];
  serves?: number;
}

export interface SeasonalBoxSuggestion {
  name: string;
  description: string;
  marketingCopy: string;
  theme: string;
  season?: string;
  occasion?: string;
  products: BoxProductItem[];
  totalPrice: number;
  suggestedDiscountPrice?: number;
  imagePrompt: string;
  launchDateSuggestion?: Date;
  reasoning: string; // AI explanation of why this combination works
}

export interface BoxPerformance {
  id: string;
  boxId: string;
  date: Date;
  views: number;
  addToCart: number;
  purchases: number;
  revenue: number;
}

// Helper function to calculate box total
export function calculateBoxTotal(products: BoxProductItem[], productData: Product[]): number {
  return products.reduce((total, item) => {
    const product = productData.find(p => p.id === item.productId);
    const price = item.priceOverride ?? product?.price ?? 0;
    return total + (price * item.quantity);
  }, 0);
}

// Helper function to check if product is in stock
export function isInStock(product: Product): boolean {
  return product.stockLevel > 0 && product.availability !== "out-of-stock";
}

// Helper function to check if product needs reorder
export function needsReorder(product: Product): boolean {
  return product.stockLevel <= product.reorderPoint;
}

// Helper function to get stock status
export function getStockStatus(product: Product): "in-stock" | "low-stock" | "out-of-stock" {
  if (product.stockLevel === 0) return "out-of-stock";
  if (product.stockLevel <= product.lowStockThreshold) return "low-stock";
  return "in-stock";
}

