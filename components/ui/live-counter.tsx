"use client";

import { useEffect, useState } from "react";

export function LiveCounter() {
  const [count, setCount] = useState(247);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCount((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 600);
    }, 8000 + Math.random() * 12000); // Random interval between 8-20 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-black/80">
          Live orders today
        </span>
      </div>
      <div className="relative">
        <span
          className={`text-5xl font-black text-brand-black tabular-nums transition-all duration-300 ${
            isAnimating ? "scale-110 text-green-600" : "scale-100"
          }`}
        >
          {count}
        </span>
        {isAnimating && (
          <span className="absolute -right-8 top-1 animate-ping text-2xl">
            +1
          </span>
        )}
      </div>
    </div>
  );
}

