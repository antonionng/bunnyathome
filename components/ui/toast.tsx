"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "border-2 border-black shadow-lg rounded-lg",
          title: "font-bold text-ink",
          description: "text-ink-muted",
          success: "bg-brand-green",
          error: "bg-red-100",
          warning: "bg-brand-curry",
          info: "bg-brand-blue",
        },
      }}
    />
  );
}



