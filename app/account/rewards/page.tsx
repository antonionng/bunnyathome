"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFromPence } from "@/lib/currency";
import { toast } from "sonner";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import { motion } from "framer-motion";
import { Trophy, Star, Gift, TrendingUp, Zap } from "lucide-react";

interface LoyaltyData {
  profile: {
    points_balance: number;
    loyalty_tier: string;
    total_spend: number;
    orders_count: number;
  };
  tier: {
    current: string;
    next: string | null;
    progress: number;
    benefits: string[];
  };
  achievements: any[];
  transactions: any[];
}

const REWARDS = [
  {
    id: "discount-5",
    name: "£5 Off Your Order",
    pointsCost: 500,
    description: "Get £5 off any order over £25",
    icon: "💰",
  },
  {
    id: "discount-10",
    name: "£10 Off Your Order",
    pointsCost: 1000,
    description: "Get £10 off any order over £50",
    icon: "💎",
  },
  {
    id: "free-delivery",
    name: "Free Delivery",
    pointsCost: 250,
    description: "Free delivery on your next order",
    icon: "🚚",
  },
  {
    id: "free-side",
    name: "Free Side Dish",
    pointsCost: 300,
    description: "Add a free side to your next order",
    icon: "🥗",
  },
  {
    id: "discount-20",
    name: "£20 Off Premium Box",
    pointsCost: 2000,
    description: "Get £20 off any order over £100",
    icon: "🎁",
  },
  {
    id: "surprise-box",
    name: "Mystery Surprise Box",
    pointsCost: 1500,
    description: "Get a surprise bunny chow box curated by our chefs",
    icon: "🎉",
  },
];

export default function RewardsPage() {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { confirm, dialogProps } = useConfirmDialog();

  useEffect(() => {
    const loadRewards = async () => {
      try {
        const response = await fetch("/api/loyalty");
        if (response.ok) {
          const data = await response.json();
          setLoyaltyData(data);
        }
      } catch (error) {
        console.error("Failed to load loyalty data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRewards();
  }, []);

  const handleRedeem = (reward: typeof REWARDS[0]) => {
    if (!loyaltyData) return;

    if (loyaltyData.profile.points_balance < reward.pointsCost) {
      toast.error("Eish, not enough points!", {
        description: `You need ${reward.pointsCost - loyaltyData.profile.points_balance} more points.`,
      });
      return;
    }

    confirm({
      title: `Redeem ${reward.name}?`,
      description: `This will cost ${reward.pointsCost} points. You'll get a promo code to use on your next order.`,
      confirmText: "Redeem Now",
      cancelText: "Save for Later",
      onConfirm: async () => {
        setIsRedeeming(true);
        try {
          const response = await fetch("/api/loyalty", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "redeem",
              data: {
                rewardId: reward.id,
                pointsCost: reward.pointsCost,
              },
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to redeem");
          }

          const result = await response.json();

          toast.success("Reward redeemed!", {
            description: `Your promo code: ${result.promoCode}`,
            duration: 10000,
          });

          // Reload loyalty data
          const loyaltyResponse = await fetch("/api/loyalty");
          if (loyaltyResponse.ok) {
            const data = await loyaltyResponse.json();
            setLoyaltyData(data);
          }
        } catch (error) {
          toast.error("Eish, couldn't redeem reward", {
            description: "Give it another bash, bru.",
          });
        } finally {
          setIsRedeeming(false);
        }
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!loyaltyData) {
    return <div>Failed to load rewards data</div>;
  }

  const { profile, tier, achievements, transactions } = loyaltyData;
  const tierColors: Record<string, string> = {
    bronze: "from-orange-600 to-orange-400",
    silver: "from-gray-400 to-gray-300",
    gold: "from-yellow-500 to-yellow-300",
    platinum: "from-purple-600 to-purple-400",
  };

  const tierIcons: Record<string, React.ReactNode> = {
    bronze: <Star className="h-8 w-8 text-white" />,
    silver: <Trophy className="h-8 w-8 text-white" />,
    gold: <Zap className="h-8 w-8 text-white" />,
    platinum: <Gift className="h-8 w-8 text-white" />,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Rewards & Points</h1>
        <p className="mt-2 text-ink-muted">Stack points and unlock lekker rewards, bru</p>
      </div>

      {/* Points & Tier Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Points Card with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border-2 border-black bg-gradient-curry p-8 shadow-lg"
        >
          <div className="relative z-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-black/70">
              Your Points
            </h3>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mt-2 text-5xl font-bold text-brand-black md:text-6xl"
            >
              {profile.points_balance.toLocaleString()}
            </motion.p>
            <p className="mt-2 text-sm text-brand-black">
              That's worth {formatFromPence(profile.points_balance)} in rewards
            </p>
          </div>
          {/* Animated background circles */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20"
          />
        </motion.div>

        {/* Tier Card with Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`relative overflow-hidden rounded-2xl border-2 border-black bg-gradient-to-br p-8 shadow-lg ${tierColors[tier.current]}`}
        >
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30">
                {tierIcons[tier.current]}
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/80">
                  Your Tier
                </h3>
                <p className="text-2xl font-bold capitalize text-white">{tier.current}</p>
              </div>
            </div>
            {tier.next && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-white">
                  <span>Progress to {tier.next}</span>
                  <span className="font-bold">{tier.progress}%</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tier.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tier Benefits */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-ink">Your {tier.current} Benefits</h2>
        <ul className="space-y-2">
          {tier.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-brand-curry">✓</span>
              <span className="text-ink">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rewards Store */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ink">Rewards Store</h2>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {REWARDS.map((reward, index) => {
            const canAfford = profile.points_balance >= reward.pointsCost;
            return (
              <motion.div
                key={reward.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className={`group relative overflow-hidden rounded-2xl border-2 border-black bg-white p-6 shadow-lg transition-all duration-300 ${
                  canAfford ? "hover:-translate-y-1 hover:shadow-elevated" : "opacity-60"
                }`}
              >
                {!canAfford && (
                  <div className="absolute right-3 top-3">
                    <Badge variant="default" className="text-xs">
                      Locked
                    </Badge>
                  </div>
                )}
                <div className="mb-4 text-5xl">{reward.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-ink">{reward.name}</h3>
                <p className="mb-4 text-sm text-ink-muted">{reward.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-brand-curry">
                      {reward.pointsCost.toLocaleString()}
                    </span>
                    <span className="text-xs text-ink-muted">pts</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || isRedeeming}
                    className={!canAfford ? "cursor-not-allowed" : ""}
                  >
                    {canAfford ? "Redeem" : "Locked"}
                  </Button>
                </div>
                {canAfford && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-1 origin-left bg-brand-curry"
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-ink">
            <Trophy className="h-6 w-6 text-brand-curry" />
            Your Achievements
          </h2>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                className="group rounded-xl border-2 border-black bg-gradient-green p-4 shadow-lg transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-brand-black">{achievement.achievement_name}</h4>
                    <p className="text-sm text-brand-black/70">
                      +{achievement.points_awarded} points
                    </p>
                  </div>
                  <motion.span
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl"
                  >
                    🏆
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-ink">Recent Activity</h2>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{transaction.description}</p>
                  <p className="text-xs text-ink-muted">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`font-bold ${
                    transaction.points > 0 ? "text-brand-green" : "text-red-600"
                  }`}
                >
                  {transaction.points > 0 ? "+" : ""}
                  {transaction.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
