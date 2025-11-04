import { cn } from "@/lib/utils";
import type { BuilderStep } from "@/types/builder";

const stepLabels: Record<Exclude<BuilderStep, "summary">, string> = {
  curry: "Choose curry",
  sides: "Select sides",
  sauces: "Add sauces",
  drinks: "Pick drinks",
};

const order: BuilderStep[] = ["curry", "sides", "sauces", "drinks", "summary"];

interface StepperProps {
  current: BuilderStep;
  onStepClick?: (step: BuilderStep) => void;
}

export function Stepper({ current, onStepClick }: StepperProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
      {order.map((step, index) => {
        if (step === "summary") {
          const isActive = current === "summary";
          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-lg border-2 px-3 py-2",
                isActive
                  ? "border-black bg-brand-curry shadow-md"
                  : "border-black bg-white"
              )}
            >
              <span
                className={cn(
                  "h-10 w-10 rounded-full border-2 text-center text-sm font-bold leading-9",
                  isActive
                    ? "border-black bg-white text-brand-black"
                    : "border-black bg-white text-ink"
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-bold uppercase tracking-[0.2em]",
                  isActive ? "text-brand-black" : "text-ink-muted"
                )}
              >
                Summary
              </span>
            </div>
          );
        }

        const isActive = step === current;
        const isCompleted = order.indexOf(current) > index;
        const label = stepLabels[step];

        return (
          <button
            key={step}
            type="button"
            onClick={() => onStepClick?.(step)}
            className={cn(
              "flex flex-1 items-center gap-3 rounded-lg border-2 px-3 py-2 text-left transition-colors shadow-md",
              isActive
                ? "border-black bg-brand-curry text-brand-black"
                : isCompleted
                  ? "border-black bg-brand-green text-brand-black"
                  : "border-black bg-white text-ink hover:bg-gray-50"
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold",
                isActive
                  ? "border-black bg-white text-brand-black"
                  : isCompleted
                    ? "border-black bg-white text-brand-black"
                    : "border-black bg-white text-ink"
              )}
            >
              {index + 1}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Step {index + 1}</span>
              <span className="text-sm font-bold">{label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

