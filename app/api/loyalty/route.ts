import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET user's loyalty status, achievements, and transactions
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get profile with loyalty info
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Get achievements
    const { data: achievements } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id)
      .order("unlocked_at", { ascending: false });

    // Get recent points transactions
    const { data: transactions } = await supabase
      .from("points_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Calculate tier progress
    const tierThresholds = {
      bronze: 0,
      silver: 10000, // £100 spent
      gold: 20000, // £200 spent
      platinum: 50000, // £500 spent
    };

    const currentTier = profile?.loyalty_tier || "bronze";
    const totalSpend = profile?.total_spend || 0;

    // Find next tier
    const tiers = ["bronze", "silver", "gold", "platinum"];
    const currentTierIndex = tiers.indexOf(currentTier);
    const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;
    const nextTierThreshold = nextTier ? tierThresholds[nextTier as keyof typeof tierThresholds] : null;

    const tierProgress = nextTierThreshold
      ? Math.round(((totalSpend - tierThresholds[currentTier as keyof typeof tierThresholds]) /
          (nextTierThreshold - tierThresholds[currentTier as keyof typeof tierThresholds])) *
          100)
      : 100;

    return NextResponse.json({
      profile: {
        points_balance: profile?.points_balance || 0,
        loyalty_tier: currentTier,
        total_spend: totalSpend,
        orders_count: profile?.orders_count || 0,
      },
      tier: {
        current: currentTier,
        next: nextTier,
        progress: tierProgress,
        benefits: getTierBenefits(currentTier),
      },
      achievements: achievements || [],
      transactions: transactions || [],
    });
  } catch (error) {
    console.error("Error fetching loyalty data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Redeem points for rewards
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, data: actionData } = await request.json();

    if (action === "redeem") {
      const { rewardId, pointsCost } = actionData;

      // Get current points balance
      const { data: profile } = await supabase
        .from("profiles")
        .select("points_balance")
        .eq("id", user.id)
        .single();

      if (!profile || profile.points_balance < pointsCost) {
        return NextResponse.json(
          { error: "Insufficient points" },
          { status: 400 }
        );
      }

      // Use the database function to redeem points
      const { data, error } = await supabase.rpc("redeem_points", {
        user_uuid: user.id,
        points_to_redeem: pointsCost,
        description: `Redeemed reward: ${rewardId}`,
      });

      if (error || !data) {
        return NextResponse.json(
          { error: "Failed to redeem points" },
          { status: 500 }
        );
      }

      // Generate promo code for the reward (would be integrated with promo system)
      const promoCode = `REWARD${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      return NextResponse.json({
        success: true,
        promoCode,
        message: "Reward redeemed successfully!",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error redeeming reward:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getTierBenefits(tier: string) {
  const benefits: Record<string, string[]> = {
    bronze: [
      "Earn 1 point per £1 spent",
      "Birthday bonus: 100 points",
      "Access to member-only promotions",
    ],
    silver: [
      "Earn 1.25 points per £1 spent",
      "Birthday bonus: 250 points",
      "Free delivery on all orders",
      "Early access to new products",
    ],
    gold: [
      "Earn 1.5 points per £1 spent",
      "Birthday bonus: 500 points",
      "Free delivery + priority shipping",
      "Exclusive Gold member discounts",
      "Monthly surprise treat",
    ],
    platinum: [
      "Earn 2 points per £1 spent",
      "Birthday bonus: 1000 points",
      "Free express delivery always",
      "VIP support hotline",
      "Quarterly gift boxes",
      "Platinum exclusive menu items",
    ],
  };

  return benefits[tier] || benefits.bronze;
}

