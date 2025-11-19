import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET all saved boxes for a user
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: boxes, error } = await supabase
      .from("saved_boxes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching saved boxes:", error);
      return NextResponse.json({ error: "Failed to fetch saved boxes" }, { status: 500 });
    }

    return NextResponse.json({ boxes });
  } catch (error) {
    console.error("Error in saved boxes fetch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create a new saved box
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, configuration, totalPrice } = await request.json();

    if (!name || !configuration) {
      return NextResponse.json(
        { error: "Name and configuration are required" },
        { status: 400 }
      );
    }

    const { data: box, error } = await supabase
      .from("saved_boxes")
      .insert({
        user_id: user.id,
        name,
        description,
        configuration,
        total_price: totalPrice,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating saved box:", error);
      return NextResponse.json({ error: "Failed to create saved box" }, { status: 500 });
    }

    return NextResponse.json({ box });
  } catch (error) {
    console.error("Error in saved box creation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

