import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET reviews for a product or all reviews
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("reviews")
      .select(`
        *,
        profiles(full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (productId) {
      query = query.eq("product_id", productId);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error in reviews fetch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new review
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, productId, rating, comment, images } = await request.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Product ID and valid rating (1-5) are required" },
        { status: 400 }
      );
    }

    // Check if user has ordered this product
    const { data: order } = await supabase
      .from("orders")
      .select("items")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or you didn't place this order" },
        { status: 404 }
      );
    }

    // Verify product is in order
    const hasProduct = order.items?.some((item: any) => item.productId === productId);
    if (!hasProduct) {
      return NextResponse.json(
        { error: "This product was not in your order" },
        { status: 400 }
      );
    }

    // Create review
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        order_id: orderId,
        product_id: productId,
        rating,
        comment,
        images: images || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }

    // Award points for reviewing
    await supabase.rpc("increment_points", {
      user_uuid: user.id,
      points_to_add: 50,
      description: "Review bonus",
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

