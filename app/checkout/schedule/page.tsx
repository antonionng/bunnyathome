"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deliveryScheduleSchema, type DeliveryScheduleFormData } from "@/lib/validations/checkout";
import { useCheckoutStore } from "@/store/checkout-store";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Radio } from "@/components/ui/radio";
import { addDays, format, isWeekend } from "date-fns";

const TIME_SLOTS = [
  { id: "morning", label: "Morning slot", value: "morning" as const, timeRange: "8:00 AM - 12:00 PM" },
  { id: "afternoon", label: "Afternoon slot", value: "afternoon" as const, timeRange: "12:00 PM - 5:00 PM" },
  { id: "evening", label: "Evening slot", value: "evening" as const, timeRange: "5:00 PM - 9:00 PM" },
];

const SUBSCRIPTION_OPTIONS = [
  { id: "none", label: "Just this once", value: "none" as const, description: "One-time order, boet" },
  { id: "weekly", label: "Every week", value: "weekly" as const, description: "Weekly bunny chow drops" },
  { id: "biweekly", label: "Every 2 weeks", value: "biweekly" as const, description: "Delivered every 2 weeks" },
  { id: "monthly", label: "Monthly vibes", value: "monthly" as const, description: "Once a month delivery" },
];

export default function SchedulePage() {
  const router = useRouter();
  const deliverySchedule = useCheckoutStore((state) => state.deliverySchedule);
  const subscriptionFrequency = useCheckoutStore((state) => state.subscriptionFrequency);
  const setDeliverySchedule = useCheckoutStore((state) => state.setDeliverySchedule);
  const setSubscriptionFrequency = useCheckoutStore((state) => state.setSubscriptionFrequency);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    deliverySchedule?.date
      ? deliverySchedule.date instanceof Date
        ? deliverySchedule.date
        : new Date(deliverySchedule.date)
      : null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    deliverySchedule?.timeSlot || ""
  );
  const [selectedFrequency, setSelectedFrequency] = useState(subscriptionFrequency);

  // Generate available dates (next 14 days, excluding weekends)
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 2))
    .filter((date) => !isWeekend(date));

  const handleSubmit = () => {
    if (!selectedDate || !selectedTimeSlot) {
      return;
    }

    setDeliverySchedule({
      date: selectedDate,
      timeSlot: selectedTimeSlot as any,
    });
    setSubscriptionFrequency(selectedFrequency);

    router.push("/checkout/payment");
  };

  const canContinue = selectedDate && selectedTimeSlot;

  return (
    <div className="space-y-8">
      <CheckoutStepper currentStep="schedule" />

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-xl font-bold text-ink">When's It Landing?</h2>

            <div className="space-y-6">
              <div>
                <Label>Pick a day</Label>
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {availableDates.map((date) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center rounded-lg border-2 p-4 transition-colors ${
                          isSelected
                            ? "border-brand-curry bg-brand-curry text-brand-black"
                            : "border-black bg-white hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-xs font-bold uppercase">
                          {format(date, "EEE")}
                        </span>
                        <span className="mt-1 text-2xl font-bold">{format(date, "d")}</span>
                        <span className="text-xs">{format(date, "MMM")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>What time works, bru?</Label>
                <div className="mt-3 space-y-3">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.value;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedTimeSlot(slot.value)}
                        className={`flex w-full items-center justify-between rounded-lg border-2 p-4 text-left transition-colors ${
                          isSelected
                            ? "border-brand-curry bg-brand-curry/20"
                            : "border-black bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-ink">{slot.label}</p>
                          <p className="text-sm text-ink-muted">{slot.timeRange}</p>
                        </div>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-brand-curry bg-brand-curry"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <div className="h-2.5 w-2.5 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>How often you want it?</Label>
                <p className="mt-1 text-sm text-ink-muted">
                  Get your Durban feast on repeat and save 10%, sharp sharp
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {SUBSCRIPTION_OPTIONS.map((option) => {
                    const isSelected = selectedFrequency === option.value;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedFrequency(option.value)}
                        className={`flex flex-col rounded-lg border-2 p-4 text-left transition-colors ${
                          isSelected
                            ? "border-brand-curry bg-brand-curry/20"
                            : "border-black bg-white hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-bold text-ink">{option.label}</span>
                        <span className="text-sm text-ink-muted">{option.description}</span>
                        {option.value !== "none" && (
                          <span className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-coral">
                            Save 10%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => router.push("/checkout/delivery")}
              >
                Go back
              </Button>
              <Button
                type="button"
                size="lg"
                className="flex-1 whitespace-nowrap"
                onClick={handleSubmit}
                disabled={!canContinue}
              >
                Sort payment now
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg section-border-pink">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}


