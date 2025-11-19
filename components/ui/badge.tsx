import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-ink",
        success: "bg-brand-green text-brand-black",
        warning: "bg-brand-curry text-brand-black",
        error: "bg-red-100 text-red-700",
        info: "bg-brand-blue text-brand-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };



