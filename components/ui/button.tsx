"use client";

import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full border-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "border-black bg-brand-curry text-brand-black hover:opacity-90 focus-visible:ring-brand-curry shadow-md",
        ghost:
          "border-black bg-white text-ink hover:bg-gray-50 focus-visible:ring-brand-curry shadow-md",
        outline:
          "border-black bg-white text-ink hover:bg-gray-50 focus-visible:ring-brand-curry shadow-md",
      },
      size: {
        sm: "h-9 px-4", 
        md: "h-11 px-6 text-base",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    icon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    icon,
    trailingIcon,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const content = (
      <span className="flex items-center justify-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        <span className="font-semibold">{children}</span>
        {trailingIcon && <span className="text-base">{trailingIcon}</span>}
      </span>
    );
    return (
      <Comp
        ref={ref as never}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = "Button";

