"use client";

import { create } from "zustand";
import type {
  BuilderSelection,
  BuilderStep,
  CalculatedTotals,
  QuantityProduct,
} from "@/types/builder";

type StepOrder = [BuilderStep, BuilderStep, BuilderStep, BuilderStep, BuilderStep];

const steps: StepOrder = ["curry", "sides", "sauces", "drinks", "summary"];

interface BuilderState extends BuilderSelection {
  step: BuilderStep;
  showBunnyModal: boolean;
  bunnyPromptSeen: boolean;
  goToStep: (step: BuilderStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectCurry: (curryId: string) => void;
  setCurrySpiceLevel: (level: BuilderSelection["currySpiceLevel"]) => void;
  incrementItem: (category: "sides" | "sauces" | "drinks", product: QuantityProduct) => void;
  decrementItem: (category: "sides" | "sauces" | "drinks", productId: string) => void;
  setItemQuantity: (category: "sides" | "sauces" | "drinks", productId: string, quantity: number) => void;
  reset: () => void;
  openBunnyModal: () => void;
  closeBunnyModal: () => void;
  markBunnyPromptSeen: () => void;
}

const initialState: BuilderSelection & {
  step: BuilderStep;
  showBunnyModal: boolean;
  bunnyPromptSeen: boolean;
} = {
  curryId: null,
  currySpiceLevel: "Mild",
  sides: {},
  sauces: {},
  drinks: {},
  notes: undefined,
  step: "curry",
  showBunnyModal: false,
  bunnyPromptSeen: false,
};

export const useBuilderStore = create<BuilderState>((set) => ({
  ...initialState,
  showBunnyModal: false,
  bunnyPromptSeen: false,
  goToStep: (step) => set(() => ({ step })),
  nextStep: () =>
    set((state) => {
      const index = steps.indexOf(state.step);
      const next = steps[Math.min(index + 1, steps.length - 1)];
      return { step: next };
    }),
  prevStep: () =>
    set((state) => {
      const index = steps.indexOf(state.step);
      const prev = steps[Math.max(index - 1, 0)];
      return { step: prev };
    }),
  selectCurry: (curryId) =>
    set(() => ({
      curryId,
    })),
  setCurrySpiceLevel: (level) => set(() => ({ currySpiceLevel: level })),
  incrementItem: (category, product) =>
    set((state) => {
      const bucket = { ...state[category] } as Record<string, number>;
      const current = bucket[product.id] ?? 0;
      if (product.maxQuantity && current >= product.maxQuantity) {
        return {};
      }
      bucket[product.id] = current + 1;
      return { [category]: bucket } as Partial<BuilderState>;
    }),
  decrementItem: (category, productId) =>
    set((state) => {
      const bucket = { ...state[category] } as Record<string, number>;
      const current = bucket[productId];
      if (!current) {
        return {};
      }
      if (current === 1) {
        delete bucket[productId];
      } else {
        bucket[productId] = current - 1;
      }
      return { [category]: bucket } as Partial<BuilderState>;
    }),
  setItemQuantity: (category, productId, quantity) =>
    set((state) => {
      const bucket = { ...state[category] } as Record<string, number>;
      if (quantity <= 0) {
        delete bucket[productId];
      } else {
        bucket[productId] = quantity;
      }
      return { [category]: bucket } as Partial<BuilderState>;
    }),
  reset: () => set(() => ({ ...initialState })),
  openBunnyModal: () => set(() => ({ showBunnyModal: true })),
  closeBunnyModal: () => set(() => ({ showBunnyModal: false })),
  markBunnyPromptSeen: () => set(() => ({ bunnyPromptSeen: true })),
}));

export const calculateTotals = (
  selection: BuilderSelection,
  prices: Record<string, number>,
  curryPrice: number | null
): CalculatedTotals => {
  let subtotal = curryPrice ?? 0;
  let itemCount = curryPrice ? 1 : 0;

  const groups: Array<Record<string, number>> = [
    selection.sides,
    selection.sauces,
    selection.drinks,
  ];

  groups.forEach((group) => {
    Object.entries(group).forEach(([id, quantity]) => {
      const price = prices[id] ?? 0;
      subtotal += price * quantity;
      itemCount += quantity;
    });
  });

  return { subtotal, itemCount };
};

