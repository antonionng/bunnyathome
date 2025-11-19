"use client";

import { create } from "zustand";
import type {
  BuilderSelection,
  BuilderStep,
  BuilderFlow,
  CalculatedTotals,
  QuantityProduct,
} from "@/types/builder";

type StepOrder = BuilderStep[];

const bunnyFlowSteps: StepOrder = ["bunny-builder", "curry", "sides", "sauces", "drinks", "summary"];
const curryFlowSteps: StepOrder = ["curry", "bunny-builder", "sides", "sauces", "drinks", "summary"];
const defaultSteps: StepOrder = ["curry", "sides", "sauces", "drinks", "summary"];

interface BuilderState extends BuilderSelection {
  step: BuilderStep;
  flow: BuilderFlow;
  bunnyBuilderPart: 1 | 2;
  showBunnyModal: boolean;
  bunnyPromptSeen: boolean;
  hasUnsavedChanges: boolean;
  setFlow: (flow: BuilderFlow) => void;
  getStepOrder: () => StepOrder;
  goToStep: (step: BuilderStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToBunnyPart: (part: 1 | 2) => void;
  skipBunnyBuilder: () => void;
  addCurry: (type: "bunny" | "family", curryId: string, spiceLevel: BuilderSelection["bunnyFillings"][string]["spiceLevel"]) => void;
  removeCurry: (type: "bunny" | "family", curryId: string) => void;
  incrementCurry: (type: "bunny" | "family", curryId: string) => void;
  decrementCurry: (type: "bunny" | "family", curryId: string) => void;
  updateCurrySpice: (type: "bunny" | "family", curryId: string, spiceLevel: BuilderSelection["bunnyFillings"][string]["spiceLevel"]) => void;
  incrementItem: (category: "sides" | "sauces" | "drinks", product: QuantityProduct) => void;
  decrementItem: (category: "sides" | "sauces" | "drinks", productId: string) => void;
  setItemQuantity: (category: "sides" | "sauces" | "drinks", productId: string, quantity: number) => void;
  reset: () => void;
  markAsSaved: () => void;
  openBunnyModal: () => void;
  closeBunnyModal: () => void;
  markBunnyPromptSeen: () => void;
}

const initialState: BuilderSelection & {
  step: BuilderStep;
  flow: BuilderFlow;
  bunnyBuilderPart: 1 | 2;
  showBunnyModal: boolean;
  bunnyPromptSeen: boolean;
  hasUnsavedChanges: boolean;
} = {
  bunnyFillings: {},
  familyCurries: {},
  sides: {},
  sauces: {},
  drinks: {},
  notes: undefined,
  step: "curry",
  flow: null,
  bunnyBuilderPart: 1,
  showBunnyModal: false,
  bunnyPromptSeen: false,
  hasUnsavedChanges: false,
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  ...initialState,
  showBunnyModal: false,
  bunnyPromptSeen: false,
  hasUnsavedChanges: false,
  flow: null,
  bunnyBuilderPart: 1,
  setFlow: (flow) => set((state) => {
    const newStep = flow === "bunny" ? "bunny-builder" : "curry";
    return { flow, step: newStep, bunnyBuilderPart: 1 };
  }),
  goToBunnyPart: (part) => set({ bunnyBuilderPart: part }),
  skipBunnyBuilder: () => {
    const state = get();
    const steps = state.getStepOrder();
    const currentIndex = steps.indexOf("bunny-builder");
    const nextStep = steps[currentIndex + 1] || "summary";
    set({ step: nextStep as BuilderStep, bunnyBuilderPart: 1 });
  },
  getStepOrder: () => {
    const state = get();
    if (state.flow === "bunny") return bunnyFlowSteps;
    if (state.flow === "curry") return curryFlowSteps;
    return defaultSteps;
  },
  goToStep: (step) => set(() => ({ 
    step, 
    bunnyBuilderPart: step === "bunny-builder" ? 1 : get().bunnyBuilderPart 
  })),
  nextStep: () =>
    set((state) => {
      const steps = state.flow === "bunny" ? bunnyFlowSteps :
                   state.flow === "curry" ? curryFlowSteps : defaultSteps;
      const index = steps.indexOf(state.step);
      const next = steps[Math.min(index + 1, steps.length - 1)];
      return { step: next };
    }),
  prevStep: () =>
    set((state) => {
      const steps = state.flow === "bunny" ? bunnyFlowSteps :
                   state.flow === "curry" ? curryFlowSteps : defaultSteps;
      const index = steps.indexOf(state.step);
      const prev = steps[Math.max(index - 1, 0)];
      return { step: prev };
    }),
  addCurry: (type, curryId, spiceLevel) =>
    set((state) => {
      const key = type === "bunny" ? "bunnyFillings" : "familyCurries";
      const bucket = { ...state[key] };
      bucket[curryId] = { quantity: 1, spiceLevel };
      return { [key]: bucket, hasUnsavedChanges: true } as Partial<BuilderState>;
    }),
  removeCurry: (type, curryId) =>
    set((state) => {
      const key = type === "bunny" ? "bunnyFillings" : "familyCurries";
      const bucket = { ...state[key] };
      delete bucket[curryId];
      return { [key]: bucket, hasUnsavedChanges: true } as Partial<BuilderState>;
    }),
  incrementCurry: (type, curryId) =>
    set((state) => {
      const key = type === "bunny" ? "bunnyFillings" : "familyCurries";
      const bucket = { ...state[key] };
      if (bucket[curryId]) {
        bucket[curryId] = { ...bucket[curryId], quantity: bucket[curryId].quantity + 1 };
      }
      return { [key]: bucket, hasUnsavedChanges: true } as Partial<BuilderState>;
    }),
  decrementCurry: (type, curryId) =>
    set((state) => {
      const key = type === "bunny" ? "bunnyFillings" : "familyCurries";
      const bucket = { ...state[key] };
      if (bucket[curryId]) {
        const newQuantity = bucket[curryId].quantity - 1;
        if (newQuantity <= 0) {
          delete bucket[curryId];
        } else {
          bucket[curryId] = { ...bucket[curryId], quantity: newQuantity };
        }
      }
      return { [key]: bucket, hasUnsavedChanges: true } as Partial<BuilderState>;
    }),
  updateCurrySpice: (type, curryId, spiceLevel) =>
    set((state) => {
      const key = type === "bunny" ? "bunnyFillings" : "familyCurries";
      const bucket = { ...state[key] };
      if (bucket[curryId]) {
        bucket[curryId] = { ...bucket[curryId], spiceLevel };
      }
      return { [key]: bucket, hasUnsavedChanges: true } as Partial<BuilderState>;
    }),
  incrementItem: (category, product) =>
    set((state) => {
      const bucket = { ...state[category] } as Record<string, number>;
      const current = bucket[product.id] ?? 0;
      if (product.maxQuantity && current >= product.maxQuantity) {
        return {};
      }
      bucket[product.id] = current + 1;
      return { [category]: bucket, hasUnsavedChanges: true } as Partial<BuilderState>;
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
      return { [category]: bucket, hasUnsavedChanges: true } as Partial<BuilderState>;
    }),
  setItemQuantity: (category, productId, quantity) =>
    set((state) => {
      const bucket = { ...state[category] } as Record<string, number>;
      if (quantity <= 0) {
        delete bucket[productId];
      } else {
        bucket[productId] = quantity;
      }
      return { [category]: bucket, hasUnsavedChanges: true } as Partial<BuilderState>;
    }),
  reset: () => set(() => ({ ...initialState })),
  markAsSaved: () => set(() => ({ hasUnsavedChanges: false })),
  openBunnyModal: () => set(() => ({ showBunnyModal: true })),
  closeBunnyModal: () => set(() => ({ showBunnyModal: false })),
  markBunnyPromptSeen: () => set(() => ({ bunnyPromptSeen: true })),
}));

export const calculateTotals = (
  selection: BuilderSelection,
  bunnyFillingPrices: Record<string, number>,
  familyCurryPrices: Record<string, number>,
  otherPrices: Record<string, number>
): CalculatedTotals => {
  let subtotal = 0;
  let itemCount = 0;

  // Add bunny fillings
  Object.entries(selection.bunnyFillings).forEach(([id, currySelection]) => {
    const price = bunnyFillingPrices[id] ?? 0;
    subtotal += price * currySelection.quantity;
    itemCount += currySelection.quantity;
  });

  // Add family curries
  Object.entries(selection.familyCurries).forEach(([id, currySelection]) => {
    const price = familyCurryPrices[id] ?? 0;
    subtotal += price * currySelection.quantity;
    itemCount += currySelection.quantity;
  });

  // Add sides, sauces, drinks
  const groups: Array<Record<string, number>> = [
    selection.sides,
    selection.sauces,
    selection.drinks,
  ];

  groups.forEach((group) => {
    Object.entries(group).forEach(([id, quantity]) => {
      const price = otherPrices[id] ?? 0;
      subtotal += price * quantity;
      itemCount += quantity;
    });
  });

  return { subtotal, itemCount };
};

