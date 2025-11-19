import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET saved-for-later items
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: items, error } = await supabase
      .from("saved_for_later")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching saved-for-later:", error);
      return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error in saved-for-later fetch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Save item for later
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productData } = await request.json();

    const { data: item, error } = await supabase
      .from("saved_for_later")
      .insert({
        user_id: user.id,
        product_data: productData,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving item:", error);
      return NextResponse.json({ error: "Failed to save item" }, { status: 500 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Error saving item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Remove saved item
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("saved_for_later")
      .delete()
      .eq("id", itemId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting saved item:", error);
      return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting saved item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

