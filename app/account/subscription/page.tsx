"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/account/stat-card";
import { EmptyState } from "@/components/account/empty-state";
import { formatFromPence } from "@/lib/currency";
import { format, addDays } from "date-fns";
import { EmptySubscriptionIllustration } from "@/components/icons/account-icons";
import { toast } from "sonner";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import { motion } from "framer-motion";
import { Calendar, RefreshCcw, Pause, XCircle, Check, Truck } from "lucide-react";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const supabase = createClient();
  const { confirm, dialogProps } = useConfirmDialog();

  useEffect(() => {
    const loadSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        setSubscription(data);
      }

      setIsLoading(false);
    };

    loadSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManageSubscription = async (action: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/subscription/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          subscriptionId: subscription.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to manage subscription");
      }

      const result = await response.json();

      toast.success(result.message || "Subscription updated successfully");

      // Reload subscription data
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", subscription.user_id)
        .eq("status", "active")
        .single();

      setSubscription(data);
    } catch (error) {
      toast.error("Eish, something went wrong", {
        description: "Give it another bash, bru.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    confirm({
      title: "Skip next delivery?",
      description: "Your next box will be pushed back by one cycle. No stress, bru!",
      confirmText: "Yeah, skip it",
      cancelText: "Nah, keep it",
      onConfirm: () => handleManageSubscription("skip"),
    });
  };

  const handlePause = () => {
    confirm({
      title: "Pause subscription?",
      description: "Your subscription will be paused. You can resume anytime, sharp sharp!",
      confirmText: "Pause it",
      cancelText: "Keep it going",
      onConfirm: () => handleManageSubscription("pause"),
    });
  };

  const handleCancel = () => {
    confirm({
      title: "Cancel subscription?",
      description: "Eish! Are you sure, bru? You'll lose your 10% subscriber discount.",
      confirmText: "Yeah, cancel it",
      cancelText: "Keep my subscription",
      variant: "danger",
      onConfirm: () => handleManageSubscription("cancel"),
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink">Your Subscription</h1>
          <p className="mt-2 text-ink-muted">Keep the bunny chow flowing on repeat</p>
        </div>

        <EmptyState
          icon={<EmptySubscriptionIllustration className="h-full w-full" />}
          title="Not on a sub yet, bru!"
          description="Get your lekker Durban boxes on repeat and save 10%. Sharp sharp, no stress"
          action={{
            label: "Check out subscription plans",
            href: "/subscriptions",
          }}
        />

        {/* Benefits Preview */}
        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border-2 border-black bg-white p-6 text-center shadow-lg"
          >
            <div className="mb-3 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-curry">
                <Check className="h-6 w-6 text-brand-black" />
              </div>
            </div>
            <h3 className="mb-2 font-bold text-ink">Save 10%</h3>
            <p className="text-sm text-ink-muted">On every single delivery</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border-2 border-black bg-white p-6 text-center shadow-lg"
          >
            <div className="mb-3 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue">
                <Calendar className="h-6 w-6 text-brand-black" />
              </div>
            </div>
            <h3 className="mb-2 font-bold text-ink">Flexible</h3>
            <p className="text-sm text-ink-muted">Skip, pause or cancel anytime</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border-2 border-black bg-white p-6 text-center shadow-lg"
          >
            <div className="mb-3 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green">
                <Truck className="h-6 w-6 text-brand-black" />
              </div>
            </div>
            <h3 className="mb-2 font-bold text-ink">Convenient</h3>
            <p className="text-sm text-ink-muted">Regular deliveries on your schedule</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Calculate upcoming deliveries
  const upcomingDeliveries = [
    { date: new Date(subscription.next_delivery_date), status: "upcoming" },
    { date: addDays(new Date(subscription.next_delivery_date), 30), status: "scheduled" },
    { date: addDays(new Date(subscription.next_delivery_date), 60), status: "scheduled" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Your Subscription</h1>
        <p className="mt-2 text-ink-muted">Keep the bunny chow flowing on repeat</p>
      </div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border-2 border-black bg-gradient-curry shadow-elevated"
      >
        <div className="p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-brand-black">{subscription.plan_type}</h2>
              <p className="mt-2 text-lg text-brand-black/80 capitalize">
                {subscription.frequency} drops
              </p>
            </div>
            <Badge variant="success" className="text-base">
              <Check className="mr-1 h-4 w-4" />
              Active
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-white/30 p-4 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-black/70">
                Next Box Landing
              </p>
              <p className="mt-2 text-2xl font-bold text-brand-black">
                {format(new Date(subscription.next_delivery_date), "MMM d, yyyy")}
              </p>
            </div>

            <div className="rounded-xl bg-white/30 p-4 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-black/70">
                Member Since
              </p>
              <p className="mt-2 text-xl font-bold text-brand-black">
                {format(new Date(subscription.created_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delivery Timeline */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-ink">Upcoming Deliveries</h3>
        <div className="space-y-3">
          {upcomingDeliveries.map((delivery, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 rounded-lg border-2 border-black/10 p-4"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                delivery.status === "upcoming"
                  ? "bg-brand-curry"
                  : "bg-gray-200"
              }`}>
                <Calendar className={`h-5 w-5 ${
                  delivery.status === "upcoming" ? "text-brand-black" : "text-gray-500"
                }`} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-ink">
                  {format(delivery.date, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-sm text-ink-muted">
                  {delivery.status === "upcoming" ? "Next delivery" : "Scheduled"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
          onClick={handleSkip}
          disabled={isProcessing}
        >
          <RefreshCcw className="h-5 w-5" />
          <span>Skip Next</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
          onClick={handlePause}
          disabled={isProcessing}
        >
          <Pause className="h-5 w-5" />
          <span>Pause</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
          disabled={isProcessing}
        >
          <Calendar className="h-5 w-5" />
          <span>Change Plan</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-4 text-red-600 hover:bg-red-50"
          onClick={handleCancel}
          disabled={isProcessing}
        >
          <XCircle className="h-5 w-5" />
          <span>Cancel</span>
        </Button>
      </div>

      {/* Savings Highlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border-2 border-black bg-gradient-green p-6 shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30">
            <Check className="h-6 w-6 text-brand-black" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-brand-black">
              You're saving 10% every drop, boet!
            </h3>
            <p className="text-brand-black/80">
              Keep this going to lock in your subscriber perks and keep the bunny chow flowing lekker.
            </p>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}

