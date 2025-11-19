"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SubscriptionTierCardProps {
  name: string;
  price: string;
  perks: string[];
  isPopular?: boolean;
  bgColor: string;
  accentColor: string;
}

export function SubscriptionTierCard({
  name,
  price,
  perks,
  isPopular = false,
  bgColor,
  accentColor,
}: SubscriptionTierCardProps) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border-3 border-black bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        isPopular ? "lg:scale-105 ring-4 ring-brand-curry" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -right-8 top-8 z-10 rotate-45 bg-brand-curry px-10 py-2 text-center text-xs font-black uppercase tracking-wider text-brand-black shadow-lg">
          Most Popular
        </div>
      )}

      <div className={`${bgColor} border-b-3 border-black px-8 py-6`}>
        <div className="flex items-start justify-between">
          <h3 className="text-2xl font-black text-brand-black lg:text-3xl">{name}</h3>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-5xl font-black text-brand-black">{price}</span>
          <span className="text-sm font-bold text-brand-black/70">/box</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-8">
        <ul className="space-y-4 text-sm font-semibold text-ink">
          {perks.map((perk, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${accentColor}`}
              >
                <span className="text-sm font-bold text-white">✓</span>
              </span>
              <span className="leading-relaxed">{perk}</span>
            </li>
          ))}
        </ul>

        <Button
          size="lg"
          className={`mt-auto w-full border-3 border-black ${accentColor} text-base font-bold uppercase tracking-wide text-white shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5`}
          asChild
        >
          <Link href="/subscriptions">Lock this cadence</Link>
        </Button>

        {isPopular && (
          <p className="text-center text-xs font-bold uppercase tracking-wider text-brand-curry">
            500+ families on this plan
          </p>
        )}
      </div>
    </div>
  );
}

