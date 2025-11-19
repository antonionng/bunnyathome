"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

interface FlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FlowModal({ isOpen, onClose }: FlowModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-2xl"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white shadow-xl transition-all hover:scale-110 hover:bg-brand-coral"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal content */}
              <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-2xl md:p-8">
                {/* Header */}
                <div className="mb-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-curry px-4 py-2"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-black">
                      Let's get cooking
                    </span>
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-black text-ink md:text-3xl"
                  >
                    Howzit! Where do we start, boet?
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mx-auto mt-3 text-sm text-ink-muted md:text-base"
                  >
                    Pick your vibe — load the loaf first for classic bunny chow, or crank the curry if you're sorting a family feast!
                  </motion.p>
                </div>

                {/* Flow options */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Bunny-first flow */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border-2 border-black bg-brand-curry p-6 shadow-lg transition-all hover:shadow-xl"
                  >
                    <div className="relative z-10 space-y-3">
                      <div className="relative h-32 w-full overflow-hidden rounded-xl border-2 border-black bg-white/40">
                        <Image
                          src="/curries/bunny/chicken-bunny-placeholder.png"
                          alt="Bunny chow"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-black text-brand-black">
                        Load the loaf first
                      </h3>
                      <p className="text-sm text-brand-black/80">
                        Quarter it, hollow it, pack with curry — that's the Durban bunny chow way, sharp sharp!
                      </p>
                      
                      <div className="space-y-1 text-xs text-brand-black/70">
                        <p className="flex items-center gap-2">
                          <span>✓</span> Pick your loaf
                        </p>
                        <p className="flex items-center gap-2">
                          <span>✓</span> Choose bunny fillings
                        </p>
                        <p className="flex items-center gap-2">
                          <span>✓</span> Add family curries (optional)
                        </p>
                      </div>

                      <Link
                        href="/builder?flow=bunny"
                        onClick={onClose}
                        className="mt-4 block w-full rounded-xl border-2 border-black bg-brand-black px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-all hover:-translate-y-1 hover:shadow-lg"
                      >
                        Start with bunny →
                      </Link>
                    </div>
                  </motion.div>

                  {/* Curry-first flow */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border-2 border-black bg-brand-coral p-6 shadow-lg transition-all hover:shadow-xl"
                  >
                    <div className="relative z-10 space-y-3">
                      <div className="relative h-32 w-full overflow-hidden rounded-xl border-2 border-black bg-white/40">
                        <Image
                          src="/curries/chicken-durban-placeholder.png"
                          alt="Curry pot"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-black text-white">
                        Crank the curry first
                      </h3>
                      <p className="text-sm text-white/90">
                        Start with family-size curry pots, then add bunny chow if you fancy — feed the whole crew, boet!
                      </p>
                      
                      <div className="space-y-1 text-xs text-white/80">
                        <p className="flex items-center gap-2">
                          <span>✓</span> Pick family curries
                        </p>
                        <p className="flex items-center gap-2">
                          <span>✓</span> Add bunny chow (optional)
                        </p>
                        <p className="flex items-center gap-2">
                          <span>✓</span> Stack sides & treats
                        </p>
                      </div>

                      <Link
                        href="/builder?flow=curry"
                        onClick={onClose}
                        className="mt-4 block w-full rounded-xl border-2 border-black bg-white px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-brand-black transition-all hover:-translate-y-1 hover:shadow-lg"
                      >
                        Start with curry →
                      </Link>
                    </div>
                  </motion.div>
                </div>

                {/* Footer note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-ink-muted">
                    Don't stress! You can add both bunny chow <span className="font-bold">AND</span> family curries in any flow, legend.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

