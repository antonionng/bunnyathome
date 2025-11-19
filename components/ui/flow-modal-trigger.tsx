"use client";

import { useState } from "react";
import { FlowModal } from "@/components/builder/flow-modal";
import { Button } from "@/components/ui/button";

interface FlowModalTriggerProps {
  variant?: "primary" | "secondary" | "tertiary";
  children: React.ReactNode;
  className?: string;
}

export function FlowModalTrigger({ variant = "primary", children, className }: FlowModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children}
      </Button>
      <FlowModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

