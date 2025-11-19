"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartItem,
  CartState,
  PromoCode,
  CartTotals,
  AddToCartPayload,
  AddCatalogItemPayload,
  AddCatalogItemResult,
} from "@/types/cart";
import type { BuilderSelection } from "@/types/builder";

interface CartStore extends CartState {
  addFromBuilder: (payload: AddToCartPayload) => void;
  addCatalogItem: (payload: AddCatalogItemPayload) => AddCatalogItemResult;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: PromoCode | null) => void;
  getTotals: () => CartTotals;
  syncWithServer: (userId: string, merge?: boolean) => Promise<void>;
  loadFromServer: () => Promise<void>;
  getVolumeDiscount: () => number;
}

const DELIVERY_FEE = 500; // £5 in pence
const catalogCategoryToCartType: Record<AddCatalogItemPayload["catalogCategory"], CartItem["type"]> = {
  bunnyFillings: "bunny",
  familyCurries: "family",
  sides: "side",
  sauces: "sauce",
  drinks: "drink",
};

const calculateItemCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

const calculateSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const calculateVolumeDiscount = (items: CartItem[]): number => {
  const itemCount = calculateItemCount(items);
  const subtotal = calculateSubtotal(items);

  if (itemCount >= 15) {
    return Math.round(subtotal * 0.15);
  }
  if (itemCount >= 10) {
    return Math.round(subtotal * 0.1);
  }
  if (itemCount >= 5) {
    return Math.round(subtotal * 0.05);
  }
  return 0;
};

export const calculateCartTotals = (
  items: CartItem[],
  promoCode: PromoCode | null
): CartTotals => {
  const subtotal = calculateSubtotal(items);

  let discount = 0;

  if (promoCode?.isValid) {
    if (promoCode.discountType === "percentage") {
      discount = Math.round((subtotal * promoCode.discountValue) / 100);
    } else {
      discount = promoCode.discountValue;
    }
  }

  const volumeDiscount = calculateVolumeDiscount(items);
  discount += volumeDiscount;

  const deliveryFee = subtotal >= 5000 ? 0 : DELIVERY_FEE;
  const total = Math.max(0, subtotal + deliveryFee - discount);
  const itemCount = calculateItemCount(items);

  return {
    subtotal,
    discount,
    deliveryFee,
    total,
    itemCount,
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      lastSyncedAt: null,

      addFromBuilder: (payload) => {
        const { selection, catalog } = payload;
        const newItems: CartItem[] = [];

        // Add bunny fillings
        Object.entries(selection.bunnyFillings).forEach(([id, curry]) => {
          const product = catalog.bunnyFillings.find((p) => p.id === id);
          if (product) {
            newItems.push({
              id: `bunny-${id}-${Date.now()}`,
              productId: id,
              name: product.name,
              price: product.price,
              quantity: curry.quantity,
              image: product.bunnyImage || product.image,
              type: "bunny",
              spiceLevel: curry.spiceLevel,
            });
          }
        });

        // Add family curries
        Object.entries(selection.familyCurries).forEach(([id, curry]) => {
          const product = catalog.familyCurries.find((p) => p.id === id);
          if (product) {
            newItems.push({
              id: `family-${id}-${Date.now()}`,
              productId: id,
              name: product.name,
              price: product.price,
              quantity: curry.quantity,
              image: product.image,
              type: "family",
              spiceLevel: curry.spiceLevel,
            });
          }
        });

        // Add sides
        Object.entries(selection.sides).forEach(([id, quantity]) => {
          const product = catalog.sides.find((p) => p.id === id);
          if (product) {
            newItems.push({
              id: `side-${id}-${Date.now()}`,
              productId: id,
              name: product.name,
              price: product.price,
              quantity,
              image: product.image,
              type: "side",
              maxQuantity: product.maxQuantity,
            });
          }
        });

        // Add sauces
        Object.entries(selection.sauces).forEach(([id, quantity]) => {
          const product = catalog.sauces.find((p) => p.id === id);
          if (product) {
            newItems.push({
              id: `sauce-${id}-${Date.now()}`,
              productId: id,
              name: product.name,
              price: product.price,
              quantity,
              image: product.image,
              type: "sauce",
              maxQuantity: product.maxQuantity,
            });
          }
        });

        // Add drinks
        Object.entries(selection.drinks).forEach(([id, quantity]) => {
          const product = catalog.drinks.find((p) => p.id === id);
          if (product) {
            newItems.push({
              id: `drink-${id}-${Date.now()}`,
              productId: id,
              name: product.name,
              price: product.price,
              quantity,
              image: product.image,
              type: "drink",
              maxQuantity: product.maxQuantity,
            });
          }
        });

        // Merge with existing items instead of replacing
        set((state) => ({ items: [...state.items, ...newItems] }));
      },

      addCatalogItem: (payload) => {
        let added = false;
        let limitReached = false;
        let remaining: number | undefined = payload.maxQuantity;

        set((state) => {
          const quantityToAdd = payload.quantity ?? 1;
          const itemId = `menu-${payload.productId}`;
          const existingItem = state.items.find((item) => item.id === itemId);
          const currentQuantity = existingItem?.quantity ?? 0;
          const maxQuantity = payload.maxQuantity ?? Infinity;
          const allowableIncrement = Math.min(quantityToAdd, Math.max(maxQuantity - currentQuantity, 0));

          if (allowableIncrement <= 0) {
            limitReached = true;
            remaining = 0;
            return state;
          }

          added = true;
          remaining = payload.maxQuantity ? Math.max(maxQuantity - (currentQuantity + allowableIncrement), 0) : undefined;

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity + allowableIncrement }
                  : item
              ),
            };
          }

          const newItem: CartItem = {
            id: itemId,
            productId: payload.productId,
            name: payload.name,
            price: payload.price,
            quantity: allowableIncrement,
            image: payload.image,
            type: catalogCategoryToCartType[payload.catalogCategory],
            spiceLevel: payload.spiceLevel,
            maxQuantity: payload.maxQuantity,
          };

          return { items: [...state.items, newItem] };
        });

        return {
          added,
          limitReached,
          remaining,
        };
      },

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], promoCode: null });
      },

      applyPromoCode: (code) => {
        set({ promoCode: code });
      },

      getVolumeDiscount: (): number => {
        return calculateVolumeDiscount(get().items);
      },

      getTotals: (): CartTotals => {
        const state = get();
        return calculateCartTotals(state.items, state.promoCode);
      },

      syncWithServer: async (userId, merge = true) => {
        const state = get();
        try {
          const response = await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartData: {
                items: state.items,
                promoCode: state.promoCode,
              },
              merge,
            }),
          });

          if (response.ok) {
            const { cartData } = await response.json();
            if (merge && cartData) {
              // Update local cart with merged data
              set({
                items: cartData.items || state.items,
                promoCode: cartData.promoCode || state.promoCode,
                lastSyncedAt: new Date(),
              });
            } else {
              set({ lastSyncedAt: new Date() });
            }
          }
        } catch (error) {
          console.error("Failed to sync cart:", error);
        }
      },

      loadFromServer: async () => {
        try {
          const response = await fetch("/api/cart/sync");
          if (response.ok) {
            const { cartData } = await response.json();
            if (cartData && cartData.items) {
              set({
                items: cartData.items,
                promoCode: cartData.promoCode || null,
                lastSyncedAt: new Date(),
              });
            }
          }
        } catch (error) {
          console.error("Failed to load cart from server:", error);
        }
      },
    }),
    {
      name: "bunny-cart",
    }
  )
);


