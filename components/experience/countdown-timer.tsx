"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  variant?: "large" | "small";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getNextTuesday(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilTuesday = dayOfWeek <= 2 ? 2 - dayOfWeek : 9 - dayOfWeek;
  
  const nextTuesday = new Date(now);
  nextTuesday.setDate(now.getDate() + daysUntilTuesday);
  nextTuesday.setHours(23, 59, 59, 999);
  
  return nextTuesday;
}

function calculateTimeLeft(): TimeLeft {
  const targetDate = getNextTuesday();
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({ variant = "large" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className={variant === "large" ? "h-24" : "h-16"}>
        <div className="animate-pulse bg-gray-200 rounded-xl h-full" />
      </div>
    );
  }

  const isLarge = variant === "large";

  return (
    <div className={`flex justify-center ${isLarge ? "gap-4" : "gap-3"}`}>
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Min" },
        { value: timeLeft.seconds, label: "Sec" },
      ].map((item, idx) => (
        <div
          key={item.label}
          className={`flex flex-1 flex-col items-center justify-center rounded-xl border-3 border-black bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            isLarge ? "px-6 py-5 max-w-[120px]" : "px-4 py-3 max-w-[90px]"
          }`}
        >
          <div
            className={`font-black text-brand-black tabular-nums ${
              isLarge ? "text-4xl lg:text-5xl" : "text-2xl lg:text-3xl"
            }`}
          >
            {String(item.value).padStart(2, "0")}
          </div>
          <div
            className={`font-bold uppercase tracking-wider text-ink-muted ${
              isLarge ? "text-xs mt-1" : "text-[10px] mt-0.5"
            }`}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

