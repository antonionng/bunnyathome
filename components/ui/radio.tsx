import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id={id}
          className={cn(
            "h-5 w-5 border-2 border-black text-brand-curry transition-colors",
            "focus:ring-2 focus:ring-brand-curry focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className="cursor-pointer text-sm font-medium text-ink"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";

export { Radio };



