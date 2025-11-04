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
    <div className="glass-panel flex flex-wrap items-center justify-between gap-4 p-5 sm:flex-nowrap">
      {order.map((step, index) => {
        if (step === "summary") {
          const isActive = current === "summary";
          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-3 py-2",
                isActive
                  ? "border-brand-curry bg-brand-curry/15"
                  : "border-border-subtle bg-white/70"
              )}
            >
              <span
                className={cn(
                  "h-10 w-10 rounded-full border text-center text-sm font-semibold leading-10",
                  isActive
                    ? "border-brand-curry bg-brand-curry text-brand-black"
                    : "border-border-subtle bg-white text-ink"
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold uppercase tracking-[0.2em]",
                  isActive ? "text-ink" : "text-ink-muted"
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
              "flex flex-1 items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-colors",
              isActive
                ? "border-brand-curry bg-brand-curry/15 text-ink"
                : isCompleted
                  ? "border-brand-green/50 bg-brand-green/15 text-ink"
                  : "border-border-subtle bg-surface text-ink-muted hover:border-brand-curry/40"
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold",
                isActive
                  ? "border-brand-curry bg-brand-curry text-brand-black"
                  : isCompleted
                    ? "border-brand-green bg-brand-green text-brand-black"
                    : "border-border-subtle bg-white/70 text-ink"
              )}
            >
              {index + 1}
            </span>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.2em]">Step {index + 1}</span>
              <span className="text-sm font-semibold">{label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

