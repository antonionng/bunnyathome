"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast["type"], duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

const toastStyles = {
  success: "bg-brand-green border-black text-brand-black",
  info: "bg-brand-blue border-black text-brand-black",
  warning: "bg-brand-curry border-black text-brand-black",
  error: "bg-brand-coral border-black text-white",
};

const toastEmojis = {
  success: "✓",
  info: "ℹ️",
  warning: "⚠️",
  error: "✕",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success", duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-xl border-3 px-6 py-4 shadow-2xl",
                toastStyles[toast.type]
              )}
            >
              <span className="text-2xl">{toastEmojis[toast.type]}</span>
              <span className="text-base font-bold">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

