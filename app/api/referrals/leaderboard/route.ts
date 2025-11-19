import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET referral leaderboard
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get top referrers
    const { data: leaderboard } = await supabase
      .from("referrals")
      .select(`
        referrer_id,
        profiles!referrals_referrer_id_fkey(full_name, loyalty_tier),
        reward_points
      `)
      .eq("status", "completed_order");

    if (!leaderboard) {
      return NextResponse.json({ leaderboard: [] });
    }

    // Aggregate by referrer
    const aggregated = leaderboard.reduce((acc: any, curr: any) => {
      const referrerId = curr.referrer_id;
      if (!acc[referrerId]) {
        acc[referrerId] = {
          referrer_id: referrerId,
          name: curr.profiles?.full_name || "Anonymous",
          tier: curr.profiles?.loyalty_tier || "bronze",
          total_referrals: 0,
          total_rewards: 0,
        };
      }
      acc[referrerId].total_referrals += 1;
      acc[referrerId].total_rewards += curr.reward_points || 0;
      return acc;
    }, {});

    // Convert to array and sort
    const sortedLeaderboard = Object.values(aggregated)
      .sort((a: any, b: any) => b.total_referrals - a.total_referrals)
      .slice(0, 10);

    return NextResponse.json({ leaderboard: sortedLeaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

