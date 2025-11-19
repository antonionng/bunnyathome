"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SpiceLevel } from "@/types/builder";

interface ChilliDialProps {
  value: SpiceLevel;
  onChange: (level: SpiceLevel) => void;
  size?: "sm" | "md" | "lg";
}

const spiceLevels: SpiceLevel[] = ["Mild", "Hot", "Very Hot"];

const spiceMessages = {
  Mild: { text: "Nice and gentle, boet", emoji: "😌", color: "text-green-600" },
  Hot: { text: "Now we're talking! 🌶️", emoji: "🔥", color: "text-orange-600" },
  "Very Hot": { text: "EISH! You can handle the heat? 🔥🔥", emoji: "💥", color: "text-red-600" },
};

const spiceColors = {
  Mild: "from-green-400 to-yellow-400",
  Hot: "from-yellow-400 to-orange-500",
  "Very Hot": "from-orange-500 to-red-600",
};

export function ChilliDial({ value, onChange, size = "md" }: ChilliDialProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [justChanged, setJustChanged] = useState(false);

  const handleChange = (level: SpiceLevel) => {
    onChange(level);
    setShowMessage(true);
    setJustChanged(true);
    setTimeout(() => setShowMessage(false), 2500);
    setTimeout(() => setJustChanged(false), 600);
  };

  const sizeClasses = {
    sm: "h-24 gap-2",
    md: "h-32 gap-3",
    lg: "h-40 gap-4",
  };

  const buttonSizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <div className="space-y-3">
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        {/* Chilli-shaped background gradient */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br opacity-20 blur-xl transition-all duration-500",
            spiceColors[value],
            justChanged && "scale-110 opacity-40"
          )}
        />

        {/* Level buttons */}
        <div className="relative z-10 flex w-full items-center justify-center gap-2">
          {spiceLevels.map((level) => {
            const isActive = level === value;
            const message = spiceMessages[level];

            return (
              <motion.button
                key={level}
                type="button"
                onClick={() => handleChange(level)}
                className={cn(
                  "relative flex-1 rounded-xl border-3 border-black font-bold uppercase tracking-wider shadow-lg transition-all duration-300",
                  buttonSizes[size],
                  isActive
                    ? `bg-gradient-to-br ${spiceColors[level]} text-white scale-105 shadow-2xl`
                    : "bg-white text-ink hover:scale-105 hover:shadow-xl"
                )}
                whileTap={{ scale: 0.95 }}
                animate={isActive && justChanged ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-1">
                  {isActive && <span className="text-lg">{message.emoji}</span>}
                  {level}
                </span>
                
                {/* Glow effect on Very Hot */}
                {isActive && level === "Very Hot" && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-400 to-orange-400 opacity-50 blur-md"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Floating particles for Very Hot */}
        {value === "Very Hot" && (
          <div className="pointer-events-none absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -40],
                  x: [0, (i - 1) * 20],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut",
                }}
                style={{
                  left: `${30 + i * 20}%`,
                  bottom: "20%",
                }}
              >
                🔥
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Validation message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "rounded-full border-2 border-black bg-white px-4 py-2 text-center font-bold shadow-lg",
              spiceMessages[value].color
            )}
          >
            {spiceMessages[value].text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

