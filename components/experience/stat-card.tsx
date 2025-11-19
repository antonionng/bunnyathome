"use client";

import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  stat: string;
  label: string;
  description: string;
  icon: string;
  bgColor: string;
}

export function StatCard({ stat, label, description, icon, bgColor }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Extract number from stat string for animation
  const numericValue = parseInt(stat.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setAnimatedValue(numericValue);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, numericValue]);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-3xl border-2 border-black ${bgColor} p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
    >
      <div className="space-y-6">
        <div className="flex items-start">
          <div className="inline-flex items-center justify-center rounded-full bg-white/90 p-3 shadow-md ring-2 ring-black/10">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-curry text-2xl">
              {icon}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-5xl font-black leading-none text-brand-black lg:text-6xl">
            {isVisible ? (
              <>
                {animatedValue.toLocaleString()}
                {stat.includes("+") && "+"}
                {stat.includes("%") && "%"}
              </>
            ) : (
              "0"
            )}
          </div>
          <h3 className="text-lg font-bold leading-tight text-brand-black md:text-xl">
            {label}
          </h3>
          <p className="text-sm leading-relaxed text-brand-black/80">
            {description}
          </p>
        </div>

        <div className="h-1 w-16 rounded-full bg-brand-black/20 transition-all duration-500 group-hover:w-24 group-hover:bg-brand-black/40" />
      </div>
    </div>
  );
}

