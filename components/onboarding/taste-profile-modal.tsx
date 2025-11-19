"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X } from "lucide-react";

interface TasteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SPICE_LEVELS = [
  { value: "mild", label: "Mild", emoji: "😊", description: "Gentle heat, family-friendly" },
  { value: "medium", label: "Medium", emoji: "🌶️", description: "Balanced, traditional flavor" },
  { value: "hot", label: "Hot", emoji: "🔥", description: "Serious heat, for spice lovers" },
  { value: "extra-hot", label: "Extra Hot", emoji: "💀", description: "Extreme! Not for the faint-hearted" },
];

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
];

const CUISINE_PREFERENCES = [
  { value: "traditional", label: "Traditional Durban Style" },
  { value: "fusion", label: "Modern Fusion" },
  { value: "mild", label: "Mild & Creamy" },
  { value: "spicy", label: "Spicy & Bold" },
];

export function TasteProfileModal({ isOpen, onClose }: TasteProfileModalProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    spice_preference: "medium",
    dietary_restrictions: [] as string[],
    favorite_cuisines: [] as string[],
    disliked_ingredients: "",
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/profile/taste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast.success("Taste profile saved!", {
          description: "You earned 100 bonus points!",
        });
        onClose();
      }
    } catch (error) {
      toast.error("Failed to save profile");
    }
  };

  const toggleDietary = (value: string) => {
    setProfile((prev) => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(value)
        ? prev.dietary_restrictions.filter((v) => v !== value)
        : [...prev.dietary_restrictions, value],
    }));
  };

  const toggleCuisine = (value: string) => {
    setProfile((prev) => ({
      ...prev,
      favorite_cuisines: prev.favorite_cuisines.includes(value)
        ? prev.favorite_cuisines.filter((v) => v !== value)
        : [...prev.favorite_cuisines, value],
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-black bg-white p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink">Build Your Taste Profile</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Help us personalize your bunny chow experience • Step {step} of 3
              </p>
              <div className="mt-4 flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full ${
                      s <= step ? "bg-brand-curry" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-ink">What's your spice tolerance?</h3>
                <div className="grid gap-3">
                  {SPICE_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setProfile({ ...profile, spice_preference: level.value })}
                      className={`flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all ${
                        profile.spice_preference === level.value
                          ? "border-brand-curry bg-brand-curry/10"
                          : "border-black hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-4xl">{level.emoji}</span>
                      <div>
                        <p className="font-bold text-ink">{level.label}</p>
                        <p className="text-sm text-ink-muted">{level.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-ink">Any dietary preferences?</h3>
                <p className="text-sm text-ink-muted">Select all that apply</p>
                <div className="grid grid-cols-2 gap-3">
                  {DIETARY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleDietary(option.value)}
                      className={`rounded-lg border-2 p-4 text-center font-bold transition-all ${
                        profile.dietary_restrictions.includes(option.value)
                          ? "border-brand-green bg-brand-green/10"
                          : "border-black hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="pt-4">
                  <h3 className="mb-2 text-lg font-bold text-ink">Style preferences</h3>
                  <div className="grid gap-2">
                    {CUISINE_PREFERENCES.map((pref) => (
                      <button
                        key={pref.value}
                        onClick={() => toggleCuisine(pref.value)}
                        className={`rounded-lg border-2 p-3 text-left font-medium transition-all ${
                          profile.favorite_cuisines.includes(pref.value)
                            ? "border-brand-curry bg-brand-curry/10"
                            : "border-black hover:bg-gray-50"
                        }`}
                      >
                        {pref.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-ink">Anything you don't like?</h3>
                <p className="text-sm text-ink-muted">Optional - helps us avoid ingredients you prefer not to have</p>
                <textarea
                  value={profile.disliked_ingredients}
                  onChange={(e) => setProfile({ ...profile, disliked_ingredients: e.target.value })}
                  placeholder="e.g., mushrooms, coconut, peanuts..."
                  className="w-full rounded-lg border-2 border-black p-4 focus:border-brand-curry focus:outline-none"
                  rows={4}
                />
              </motion.div>
            )}

            <div className="mt-6 flex gap-3">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)} className="flex-1">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex-1">
                  Complete Profile (+100 points)
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

