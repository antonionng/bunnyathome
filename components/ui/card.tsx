import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "compact" | "spacious";
  accent?: "curry" | "green" | "pink" | "blue" | "coral" | "none";
}

export function Card({ children, className, variant = "default", accent = "none" }: CardProps) {
  const baseClass = variant === "compact" 
    ? "card-compact"
    : variant === "spacious"
    ? "card-spacious"
    : "card-base";

  const accentClass = accent !== "none"
    ? `section-border-${accent}`
    : "";

  return (
    <div className={cn(baseClass, accentClass, className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("space-tight mb-6", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn("text-xl font-bold text-ink", className)}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-ink-muted", className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("space-element", className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("mt-6 space-y-3", className)}>
      {children}
    </div>
  );
}


