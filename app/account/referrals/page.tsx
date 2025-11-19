"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Share2, Trophy, Users, Gift } from "lucide-react";
import { motion } from "framer-motion";

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  completedReferrals: number;
  totalRewards: number;
  referrals: any[];
}

interface LeaderboardEntry {
  name: string;
  tier: string;
  total_referrals: number;
  total_rewards: number;
}

export default function ReferralsPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");

  const loadData = async () => {
    try {
      const [statsRes, leaderboardRes] = await Promise.all([
        fetch("/api/referrals"),
        fetch("/api/referrals/leaderboard"),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      if (leaderboardRes.ok) {
        const data = await leaderboardRes.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (error) {
      console.error("Error loading referral data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/auth/signup?ref=${stats?.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied!", {
      description: "Share it with your friends to earn rewards",
    });
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/auth/signup?ref=${stats?.referralCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Bunny At Home!",
          text: "Get £2 off your first order with my referral code!",
          url: link,
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Refer & Earn</h1>
        <p className="mt-2 text-ink-muted">
          Share the lekker vibes and stack those rewards, bru!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border-2 border-black bg-gradient-to-br from-brand-curry to-orange-400 p-6 text-white shadow-lg"
        >
          <Users className="mb-3 h-8 w-8" />
          <p className="text-sm font-bold uppercase tracking-wider opacity-90">Total Referrals</p>
          <p className="mt-2 text-4xl font-bold">{stats?.totalReferrals || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border-2 border-black bg-gradient-to-br from-brand-green to-emerald-400 p-6 text-white shadow-lg"
        >
          <Gift className="mb-3 h-8 w-8" />
          <p className="text-sm font-bold uppercase tracking-wider opacity-90">Completed</p>
          <p className="mt-2 text-4xl font-bold">{stats?.completedReferrals || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border-2 border-black bg-gradient-to-br from-brand-coral to-pink-400 p-6 text-white shadow-lg"
        >
          <Trophy className="mb-3 h-8 w-8" />
          <p className="text-sm font-bold uppercase tracking-wider opacity-90">Points Earned</p>
          <p className="mt-2 text-4xl font-bold">{stats?.totalRewards || 0}</p>
        </motion.div>
      </div>

      {/* Referral Link Card */}
      <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-ink">Your Referral Link</h2>
        <div className="mb-6 flex gap-3">
          <Input
            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/signup?ref=${stats?.referralCode || ''}`}
            readOnly
            className="flex-1"
          />
          <Button onClick={handleCopyLink} variant="outline">
            <Copy className="h-4 w-4" />
          </Button>
          <Button onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="rounded-lg bg-brand-curry/20 p-6">
          <h3 className="mb-2 font-bold text-ink">How it works:</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li>• Share your unique referral link with friends</li>
            <li>• They get £2 off their first order</li>
            <li>• You get 500 points when they complete their first order</li>
            <li>• They get 200 bonus points too!</li>
          </ul>
        </div>
      </div>

      {/* Leaderboard with Podium */}
      <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-ink">
          <Trophy className="h-6 w-6 text-brand-curry" />
          Referral Champions
        </h2>
        {leaderboard.length > 0 ? (
          <div className="space-y-6">
            {/* Podium for Top 3 */}
            {leaderboard.length >= 3 && (
              <div className="mb-8 flex items-end justify-center gap-4">
                {/* 2nd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-gray-400 to-gray-300 text-2xl font-bold text-white shadow-lg">
                    2
                  </div>
                  <div className="h-24 w-32 rounded-t-lg border-2 border-black bg-gradient-to-br from-gray-400 to-gray-300 p-3 text-center shadow-lg">
                    <p className="truncate text-sm font-bold text-white">{leaderboard[1].name}</p>
                    <p className="mt-1 text-xs text-white/80">{leaderboard[1].total_referrals} referrals</p>
                  </div>
                </motion.div>

                {/* 1st Place */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <Trophy className="mb-2 h-8 w-8 text-yellow-500" />
                  <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-yellow-500 to-yellow-300 text-3xl font-bold text-white shadow-lg">
                    1
                  </div>
                  <div className="h-32 w-36 rounded-t-lg border-2 border-black bg-gradient-to-br from-yellow-500 to-yellow-300 p-4 text-center shadow-lg">
                    <p className="truncate font-bold text-white">{leaderboard[0].name}</p>
                    <p className="mt-1 text-sm text-white/90">{leaderboard[0].total_referrals} referrals</p>
                    <Badge variant="warning" className="mt-2">
                      {leaderboard[0].total_rewards} pts
                    </Badge>
                  </div>
                </motion.div>

                {/* 3rd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-orange-400 to-orange-300 text-xl font-bold text-white shadow-lg">
                    3
                  </div>
                  <div className="h-20 w-28 rounded-t-lg border-2 border-black bg-gradient-to-br from-orange-400 to-orange-300 p-2 text-center shadow-lg">
                    <p className="truncate text-xs font-bold text-white">{leaderboard[2].name}</p>
                    <p className="mt-1 text-xs text-white/80">{leaderboard[2].total_referrals} referrals</p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Rest of Leaderboard */}
            {leaderboard.length > 3 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink-muted">
                  Other Top Referrers
                </h3>
                {leaderboard.slice(3).map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 3) * 0.1 }}
                    className="flex items-center justify-between rounded-lg border-2 border-black/10 bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white font-bold text-ink">
                        {index + 4}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{entry.name}</p>
                        <Badge variant="default">{entry.tier}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-ink">{entry.total_referrals}</p>
                      <p className="text-xs text-ink-muted">{entry.total_rewards} points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="py-8 text-center text-ink-muted">No referrals yet. Be the first!</p>
        )}
      </div>

      {/* Referral Timeline */}
      {stats && stats.referrals && stats.referrals.length > 0 && (
        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-ink">Your Referral History</h2>
          <div className="space-y-3">
            {stats.referrals.slice(0, 5).map((referral: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 rounded-lg border-2 border-black/10 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green">
                  <Check className="h-5 w-5 text-brand-black" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-ink">New referral signed up!</p>
                  <p className="text-sm text-ink-muted">+500 points earned</p>
                </div>
                <Badge variant="success">Completed</Badge>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

