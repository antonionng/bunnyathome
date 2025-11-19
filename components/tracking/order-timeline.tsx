"use client";

import { motion } from "framer-motion";

interface TimelineStep {
  status: string;
  label: string;
  description: string;
  state: "completed" | "current" | "upcoming";
  timestamp: string | null;
}

interface OrderTimelineProps {
  timeline: TimelineStep[];
}

export function OrderTimeline({ timeline }: OrderTimelineProps) {
  return (
    <div className="relative">
      {timeline.map((step, index) => {
        const isLast = index === timeline.length - 1;

        return (
          <motion.div
            key={step.status}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pb-8"
          >
            {/* Connector line */}
            {!isLast && (
              <div
                className={`absolute left-5 top-12 h-full w-0.5 ${
                  step.state === "completed" ? "bg-brand-green" : "bg-gray-300"
                }`}
              />
            )}

            <div className="flex items-start gap-4">
              {/* Status icon */}
              <div
                className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                  step.state === "completed"
                    ? "border-brand-green bg-brand-green"
                    : step.state === "current"
                    ? "border-brand-curry bg-brand-curry"
                    : "border-gray-300 bg-white"
                }`}
              >
                {step.state === "completed" ? (
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : step.state === "current" ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-3 w-3 rounded-full bg-white"
                  />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-gray-300" />
                )}
              </div>

              {/* Status content */}
              <div className="flex-1 pt-1">
                <h3
                  className={`text-lg font-bold ${
                    step.state === "current"
                      ? "text-brand-curry"
                      : step.state === "completed"
                      ? "text-brand-green"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    step.state === "upcoming" ? "text-gray-400" : "text-ink-muted"
                  }`}
                >
                  {step.description}
                </p>
                {step.timestamp && (
                  <p className="mt-1 text-xs text-ink-muted">
                    {new Date(step.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

