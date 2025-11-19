import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET user's referral stats
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's referral code
    const { data: profile } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", user.id)
      .single();

    // Get referral stats
    const { data: referrals, count } = await supabase
      .from("referrals")
      .select("*", { count: "exact" })
      .eq("referrer_id", user.id)
      .order("created_at", { ascending: false });

    const completedReferrals = referrals?.filter((r) => r.status === "completed_order").length || 0;
    const totalRewards = referrals?.reduce((sum, r) => sum + (r.reward_points || 0), 0) || 0;

    return NextResponse.json({
      referralCode: profile?.referral_code,
      totalReferrals: count || 0,
      completedReferrals,
      totalRewards,
      referrals: referrals || [],
    });
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create referral link
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    // Get user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", user.id)
      .single();

    if (!profile?.referral_code) {
      return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
    }

    // Create referral record
    const { data: referral, error } = await supabase
      .from("referrals")
      .insert({
        referrer_id: user.id,
        referral_code: profile.referral_code,
        referred_email: email,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating referral:", error);
      return NextResponse.json({ error: "Failed to create referral" }, { status: 500 });
    }

    return NextResponse.json({ referral });
  } catch (error) {
    console.error("Error in referral creation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

