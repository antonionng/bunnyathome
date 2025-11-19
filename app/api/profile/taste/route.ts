import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET taste profile
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("taste_profile")
      .eq("id", user.id)
      .single();

    return NextResponse.json({ tasteProfile: profile?.taste_profile || {} });
  } catch (error) {
    console.error("Error fetching taste profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Update taste profile
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasteProfile = await request.json();

    // Add completion timestamp
    tasteProfile.completed_at = new Date().toISOString();

    const { error } = await supabase
      .from("profiles")
      .update({ taste_profile: tasteProfile })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating taste profile:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    // Award points for completing taste profile
    await supabase.rpc("increment_points", {
      user_uuid: user.id,
      points_to_add: 100,
      description: "Completed taste profile",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating taste profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

