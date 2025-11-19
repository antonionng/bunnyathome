"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: "curry" | "pink" | "blue" | "coral" | "green";
  link?: {
    href: string;
    label: string;
  };
  className?: string;
  delay?: number;
}

const gradientClasses = {
  curry: "bg-gradient-curry",
  pink: "bg-gradient-pink",
  blue: "bg-gradient-blue",
  coral: "bg-gradient-coral",
  green: "bg-gradient-green",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient = "curry",
  link,
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 border-black p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        gradientClasses[gradient],
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-sm font-bold uppercase tracking-wider text-brand-black opacity-90">
        {title}
      </h3>

      {/* Value */}
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.1, duration: 0.4, type: "spring" }}
        className="mt-2 text-4xl font-bold text-brand-black sm:text-5xl"
      >
        {value}
      </motion.p>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2 text-sm text-brand-black opacity-80">{subtitle}</p>
      )}

      {/* Link */}
      {link && (
        <Link
          href={link.href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-black transition-all hover:gap-2 hover:underline"
        >
          <span>{link.label}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}

      {/* Decorative element */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-150" />
    </motion.div>
  );
}

