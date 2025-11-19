import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET a specific saved box
export async function GET(
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

    const { data: box, error } = await supabase
      .from("saved_boxes")
      .select("*")
      .eq("id", boxId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching saved box:", error);
      return NextResponse.json({ error: "Saved box not found" }, { status: 404 });
    }

    return NextResponse.json({ box });
  } catch (error) {
    console.error("Error in saved box fetch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update a saved box
export async function PUT(
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

    const { name, description, configuration, totalPrice } = await request.json();

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (configuration !== undefined) updateData.configuration = configuration;
    if (totalPrice !== undefined) updateData.total_price = totalPrice;

    const { data: box, error } = await supabase
      .from("saved_boxes")
      .update(updateData)
      .eq("id", boxId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating saved box:", error);
      return NextResponse.json({ error: "Failed to update saved box" }, { status: 500 });
    }

    return NextResponse.json({ box });
  } catch (error) {
    console.error("Error in saved box update:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a saved box
export async function DELETE(
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

    const { error } = await supabase
      .from("saved_boxes")
      .delete()
      .eq("id", boxId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting saved box:", error);
      return NextResponse.json({ error: "Failed to delete saved box" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in saved box deletion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

