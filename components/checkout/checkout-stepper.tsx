"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCheckoutStore } from "@/store/checkout-store";

interface CheckoutStepperProps {
  currentStep: "delivery" | "schedule" | "payment" | "confirmation";
}

const steps = [
  { id: "delivery", label: "Delivery", number: 1, path: "/checkout/delivery" },
  { id: "schedule", label: "Schedule", number: 2, path: "/checkout/schedule" },
  { id: "payment", label: "Payment", number: 3, path: "/checkout/payment" },
];

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const router = useRouter();
  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  const deliveryAddress = useCheckoutStore((state) => state.deliveryAddress);
  const deliverySchedule = useCheckoutStore((state) => state.deliverySchedule);

  const isStepValid = (stepId: string) => {
    if (stepId === "delivery") return !!deliveryAddress;
    if (stepId === "schedule") return !!deliverySchedule && !!deliveryAddress;
    if (stepId === "payment") return !!deliverySchedule && !!deliveryAddress;
    return false;
  };

  const handleStepClick = (step: typeof steps[0], index: number) => {
    // Only allow clicking on completed steps or current step
    if (index < currentIndex) {
      router.push(step.path);
    }
  };

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = step.id === currentStep;
        const isUpcoming = index > currentIndex;
        const isValid = isStepValid(step.id);
        const isClickable = index < currentIndex;

        return (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleStepClick(step, index)}
                disabled={!isClickable}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all",
                  isCompleted && isValid && "border-brand-green bg-brand-green text-brand-black hover:scale-110",
                  isCompleted && !isValid && "border-brand-coral bg-brand-coral text-white",
                  isCurrent && "border-brand-curry bg-brand-curry text-brand-black",
                  isUpcoming && "border-gray-300 bg-white text-gray-400",
                  isClickable && "cursor-pointer hover:shadow-lg",
                  !isClickable && "cursor-not-allowed"
                )}
                aria-label={`Go to ${step.label} step`}
              >
                {isCompleted ? (isValid ? "✓" : "!") : step.number}
              </button>
              <span
                className={cn(
                  "mt-2 text-xs font-bold uppercase tracking-wider text-center",
                  (isCompleted || isCurrent) && "text-ink",
                  isUpcoming && "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 transition-colors",
                  index < currentIndex && isValid ? "bg-brand-green" : "bg-gray-300"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}


