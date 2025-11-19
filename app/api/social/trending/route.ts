import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET trending products
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");
    const timeframe = searchParams.get("timeframe") || "7d"; // 1d, 7d, 30d

    // Calculate date threshold
    const daysAgo = timeframe === "1d" ? 1 : timeframe === "7d" ? 7 : 30;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysAgo);

    // Get recent orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("items")
      .gte("created_at", thresholdDate.toISOString())
      .in("status", ["confirmed", "preparing", "shipped", "delivered"]);

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Failed to fetch trending items" }, { status: 500 });
    }

    // Count item frequency
    const itemCounts: Record<string, { count: number; item: any }> = {};

    orders?.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const key = item.productId;
          if (!itemCounts[key]) {
            itemCounts[key] = { count: 0, item };
          }
          itemCounts[key].count += item.quantity;
        });
      }
    });

    // Sort by count and get top items
    const trending = Object.entries(itemCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, limit)
      .map(([productId, { count, item }]) => ({
        productId,
        name: item.name,
        type: item.type,
        price: item.price,
        image: item.image,
        orderCount: count,
        trending: count > 10, // Mark as "hot" if ordered more than 10 times
      }));

    return NextResponse.json({ trending });
  } catch (error) {
    console.error("Error in trending fetch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

