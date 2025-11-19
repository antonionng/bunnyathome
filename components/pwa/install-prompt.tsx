"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if user dismissed before
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedAt = new Date(dismissed);
      const daysSince = (Date.now() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted install prompt");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-md md:left-auto md:right-6"
        >
          <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-2xl">
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-full border-2 border-black bg-brand-curry p-3">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-ink">Install Bunny At Home</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Get faster access and order offline, sharp sharp!
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleInstall} className="flex-1">
                Install App
              </Button>
              <Button onClick={handleDismiss} variant="outline" className="flex-1">
                Not Now
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

