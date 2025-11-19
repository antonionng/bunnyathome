import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border-2 border-black bg-white px-4 py-3 text-sm text-ink transition-colors",
            "placeholder:text-ink-muted",
            "focus:outline-none focus:ring-2 focus:ring-brand-curry focus:border-brand-curry",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-y",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };



