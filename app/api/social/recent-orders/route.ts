import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET recent orders for social proof
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Get recent confirmed/delivered orders
    // Note: This may fail due to RLS policies if not authenticated
    // In that case, we'll return mock data for social proof
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        delivery_address,
        items
      `)
      .in("status", ["confirmed", "preparing", "shipped", "delivered"])
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent orders:", error);
      // Return empty array instead of error for better UX
      // The social proof component will handle this gracefully
      return NextResponse.json({ recentOrders: [] });
    }

    // Format for social proof (anonymize)
    const socialProof = orders?.map((order) => {
      const city = order.delivery_address?.city || "the UK";
      const itemCount = order.items?.length || 1;
      const firstItem = order.items?.[0]?.name || "Bunny Chow";
      
      return {
        id: order.id,
        message: `Someone in ${city} just ordered ${itemCount > 1 ? `${itemCount} items including` : ""} ${firstItem}`,
        timestamp: order.created_at,
        timeAgo: getTimeAgo(new Date(order.created_at)),
      };
    }) || [];

    return NextResponse.json({ recentOrders: socialProof });
  } catch (error) {
    console.error("Error in recent orders fetch:", error);
    // Return empty array instead of error for better UX
    return NextResponse.json({ recentOrders: [] });
  }
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}

