"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface RecentOrder {
  id: string;
  message: string;
  timeAgo: string;
}

export function RecentOrdersFeed() {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch("/api/social/recent-orders?limit=20");
        if (response.ok) {
          const data = await response.json();
          setOrders(data.recentOrders || []);
        }
      } catch (error) {
        console.error("Failed to fetch recent orders:", error);
      }
    };

    fetchRecentOrders();

    // Refresh every 30 seconds
    const interval = setInterval(fetchRecentOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    // Cycle through orders every 5 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % orders.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [orders.length]);

  if (orders.length === 0) return null;

  const currentOrder = orders[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <AnimatePresence mode="wait">
        {isVisible && currentOrder && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border-2 border-black bg-white p-4 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-curry">
                <span className="text-xl">🔥</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{currentOrder.message}</p>
                <p className="text-xs text-ink-muted">{currentOrder.timeAgo}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

