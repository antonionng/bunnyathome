import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST - Add a saved box to cart (one-click reorder)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ boxId: string }> }
) {
  try {
    const { boxId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the saved box
    const { data: box, error: boxError } = await supabase
      .from("saved_boxes")
      .select("*")
      .eq("id", boxId)
      .eq("user_id", user.id)
      .single();

    if (boxError || !box) {
      return NextResponse.json({ error: "Saved box not found" }, { status: 404 });
    }

    // The configuration contains the builder selection
    // We'll return it so the client can add it to the cart
    return NextResponse.json({
      success: true,
      configuration: box.configuration,
      name: box.name,
    });
  } catch (error) {
    console.error("Error in reorder:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

