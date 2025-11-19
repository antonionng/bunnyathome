"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface QuickActionMenuProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActionMenu({ actions, className }: QuickActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white transition-colors hover:bg-gray-50"
        aria-label="Quick actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-50 min-w-[180px] overflow-hidden rounded-xl border-2 border-black bg-white shadow-elevated"
          >
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!action.disabled) {
                      action.onClick();
                      setIsOpen(false);
                    }
                  }}
                  disabled={action.disabled}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors",
                    action.variant === "danger"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-ink hover:bg-gray-50",
                    action.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {action.icon && (
                    <span className="flex h-5 w-5 items-center justify-center">
                      {action.icon}
                    </span>
                  )}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

