import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST - Reorder from a past order
export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return the order items so they can be added to cart
    return NextResponse.json({
      success: true,
      items: order.items,
      orderNumber: order.order_number,
    });
  } catch (error) {
    console.error("Error in reorder:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

