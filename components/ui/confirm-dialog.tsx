"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleCancel = () => {
    onCancel?.();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-black bg-white p-6 shadow-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-ink">{title}</h3>
            <p className="text-sm text-ink-muted">{description}</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
            <Button
              size="md"
              className={`flex-1 ${
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : ""
              }`}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook to manage confirm dialog state
export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "danger";
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const confirm = (options: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "danger";
    onConfirm: () => void;
  }) => {
    setState({
      open: true,
      ...options,
    });
  };

  const handleOpenChange = (open: boolean) => {
    setState((prev) => ({ ...prev, open }));
  };

  return {
    confirm,
    dialogProps: {
      ...state,
      onOpenChange: handleOpenChange,
    },
  };
}


