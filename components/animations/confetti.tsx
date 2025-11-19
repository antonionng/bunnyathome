"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiProps {
  trigger: boolean;
}

export function Confetti({ trigger }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (trigger) {
      const colors = ["#f97316", "#fbbf24", "#22c55e", "#3b82f6", "#ec4899"];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);

      setTimeout(() => setParticles([]), 3000);
    }
  }, [trigger]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1000] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ x: particle.x, y: particle.y, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            x: particle.x + (Math.random() - 0.5) * 200,
            opacity: 0,
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 2 + Math.random(), ease: "easeIn" }}
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            backgroundColor: particle.color,
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
}

