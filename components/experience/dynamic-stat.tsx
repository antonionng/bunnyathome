"use client";

import { useEffect, useState } from "react";

interface DynamicStatProps {
  baseValue: number;
  variance: number;
  label?: string;
  suffix?: string;
}

export function DynamicStat({ baseValue, variance, label, suffix = "" }: DynamicStatProps) {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    // Generate a random value within the variance range
    const randomOffset = Math.floor(Math.random() * (variance * 2 + 1)) - variance;
    setValue(baseValue + randomOffset);
  }, [baseValue, variance]);

  return (
    <>
      {value}
      {suffix}
      {label && <span className="ml-1">{label}</span>}
    </>
  );
}

