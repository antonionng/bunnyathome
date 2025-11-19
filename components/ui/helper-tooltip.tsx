"use client";

import { cn } from "@/lib/utils";

interface HelperTooltipProps {
  children: React.ReactNode;
  variant?: "info" | "tip" | "warning";
  className?: string;
}

export function HelperTooltip({
  children,
  variant = "info",
  className,
}: HelperTooltipProps) {
  const variantStyles = {
    info: "bg-brand-blue",
    tip: "bg-brand-green",
    warning: "bg-brand-curry",
  };

  const variantIcons = {
    info: "💡",
    tip: "✨",
    warning: "👀",
  };

  return (
    <div
      className={cn(
        "rounded-lg p-4 text-sm text-brand-black shadow-md",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none" aria-hidden="true">
          {variantIcons[variant]}
        </span>
        <div className="flex-1 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

