import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ProductRecommendation {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  score: number;
  reason: string;
}

// GET recommendations for a user
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "general"; // general, cart, product
    const productId = searchParams.get("productId");
    const limit = parseInt(searchParams.get("limit") || "6");

    const recommendations: ProductRecommendation[] = [];

    if (user) {
      // Personalized recommendations based on order history
      const { data: orders } = await supabase
        .from("orders")
        .select("items")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (orders && orders.length > 0) {
        // Analyze order history to find frequently purchased items
        const itemFrequency: Record<string, number> = {};
        const itemDetails: Record<string, any> = {};

        orders.forEach((order) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
              const key = item.productId;
              itemFrequency[key] = (itemFrequency[key] || 0) + 1;
              itemDetails[key] = item;
            });
          }
        });

        // Sort by frequency and add to recommendations
        Object.entries(itemFrequency)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .forEach(([productId, frequency]) => {
            const item = itemDetails[productId];
            recommendations.push({
              id: productId,
              name: item.name,
              type: item.type,
              price: item.price,
              image: item.image,
              score: frequency,
              reason: `You've ordered this ${frequency} time${frequency > 1 ? "s" : ""}`,
            });
          });
      }
    }

    // Get popular products (fallback or supplement)
    const { data: popularOrders } = await supabase
      .from("orders")
      .select("items")
      .eq("status", "delivered")
      .order("created_at", { ascending: false })
      .limit(50);

    if (popularOrders) {
      const popularItems: Record<string, { count: number; item: any }> = {};

      popularOrders.forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const key = item.productId;
            if (!popularItems[key]) {
              popularItems[key] = { count: 0, item };
            }
            popularItems[key].count += 1;
          });
        }
      });

      // Add popular items that aren't already in recommendations
      const existingIds = new Set(recommendations.map((r) => r.id));
      Object.entries(popularItems)
        .sort(([, a], [, b]) => b.count - a.count)
        .filter(([id]) => !existingIds.has(id))
        .slice(0, limit - recommendations.length)
        .forEach(([productId, { item, count }]) => {
          recommendations.push({
            id: productId,
            name: item.name,
            type: item.type,
            price: item.price,
            image: item.image,
            score: count,
            reason: "Popular choice among customers",
          });
        });
    }

    // If specific product recommendations requested
    if (type === "product" && productId) {
      // Find products frequently bought with this product
      const { data: relatedOrders } = await supabase
        .from("orders")
        .select("items")
        .contains("items", [{ productId }])
        .limit(100);

      if (relatedOrders) {
        const coOccurrence: Record<string, number> = {};

        relatedOrders.forEach((order) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
              if (item.productId !== productId) {
                coOccurrence[item.productId] = (coOccurrence[item.productId] || 0) + 1;
              }
            });
          }
        });

        return NextResponse.json({
          recommendations: Object.entries(coOccurrence)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id, count]) => ({
              id,
              score: count,
              reason: "Frequently bought together",
            })),
        });
      }
    }

    return NextResponse.json({
      recommendations: recommendations.slice(0, limit),
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

