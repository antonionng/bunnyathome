"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CheckoutState, DeliveryAddress, DeliverySchedule, SubscriptionFrequency, CheckoutStep } from "@/types/checkout";

interface CheckoutStore extends CheckoutState {
  setStep: (step: CheckoutStep) => void;
  setDeliveryAddress: (address: DeliveryAddress | null) => void;
  setDeliverySchedule: (schedule: DeliverySchedule | null) => void;
  setSubscriptionFrequency: (frequency: SubscriptionFrequency) => void;
  setSaveAddress: (save: boolean) => void;
  setSavePaymentMethod: (save: boolean) => void;
  setGuestEmail: (email: string | null) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

const initialState: CheckoutState = {
  step: "cart",
  deliveryAddress: null,
  deliverySchedule: null,
  subscriptionFrequency: "none",
  saveAddress: false,
  savePaymentMethod: false,
  guestEmail: null,
  notes: "",
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),
      setDeliveryAddress: (address) => set({ deliveryAddress: address }),
      setDeliverySchedule: (schedule) => set({ deliverySchedule: schedule }),
      setSubscriptionFrequency: (frequency) => set({ subscriptionFrequency: frequency }),
      setSaveAddress: (save) => set({ saveAddress: save }),
      setSavePaymentMethod: (save) => set({ savePaymentMethod: save }),
      setGuestEmail: (email) => set({ guestEmail: email }),
      setNotes: (notes) => set({ notes }),
      reset: () => set(initialState),
    }),
    {
      name: "bunny-checkout",
    }
  )
);


