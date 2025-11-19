import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all user data
    const [profile, addresses, savedBoxes, orders, subscription] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("addresses").select("*").eq("user_id", user.id),
        supabase.from("saved_boxes").select("*").eq("user_id", user.id),
        supabase.from("orders").select("*").eq("user_id", user.id),
        supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single(),
      ]);

    // Compile export data
    const exportData = {
      exported_at: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      profile: profile.data,
      addresses: addresses.data || [],
      saved_boxes: savedBoxes.data || [],
      orders: orders.data || [],
      subscription: subscription.data || null,
    };

    // Return as JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="bunny-at-home-data-${Date.now()}.json"`,
      },
    });
  } catch (error: any) {
    console.error("Data export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

