"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { extractFirstName } from "@/lib/utils/name-extractor";

interface PersonalGreetingProps {
  userName?: string;
  userEmail?: string;
  className?: string;
}

const greetings = [
  "Howzit",
  "Howzit",
  "Hey there",
  "Lekker to see you",
  "Sharp sharp",
  "Eita",
];

const compliments = [
  "legend",
  "boet",
  "chommie",
  "chief",
  "bru",
  "my friend",
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function PersonalGreeting({
  userName,
  userEmail,
  className,
}: PersonalGreetingProps) {
  // Memoize the greeting to prevent re-generation on every render
  const greeting = useMemo(() => {
    const useTimeGreeting = Math.random() < 0.4;
    return useTimeGreeting ? getTimeBasedGreeting() : getRandomItem(greetings);
  }, []);
  
  const compliment = useMemo(() => getRandomItem(compliments), []);
  
  // Extract first name using utility function
  const firstName = extractFirstName(userName) !== "friend"
    ? extractFirstName(userName)
    : userEmail?.split("@")[0] || compliment;

  return (
    <div className={cn("space-y-2", className)}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold text-ink md:text-4xl"
      >
        {greeting}, {firstName}!
      </motion.h1>
      {userEmail && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-ink-muted"
        >
          {userEmail}
        </motion.p>
      )}
    </div>
  );
}

