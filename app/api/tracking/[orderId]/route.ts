import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET order tracking information
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Build tracking timeline
    const timeline = buildTrackingTimeline(order);

    return NextResponse.json({
      order: {
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        created_at: order.created_at,
        delivery_date: order.delivery_date,
        delivery_time_slot: order.delivery_time_slot,
        delivery_address: order.delivery_address,
      },
      timeline,
    });
  } catch (error) {
    console.error("Error fetching tracking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildTrackingTimeline(order: any) {
  const statuses = ["pending", "confirmed", "preparing", "shipped", "delivered"];
  const statusLabels: Record<string, string> = {
    pending: "Order Received",
    confirmed: "Order Confirmed",
    preparing: "Preparing Your Box",
    shipped: "On the Way",
    delivered: "Delivered",
  };

  const statusDescriptions: Record<string, string> = {
    pending: "We've received your order and processing payment",
    confirmed: "Payment confirmed! We're getting ready to prepare your bunny chow",
    preparing: "Our kitchen is preparing your delicious curry, sharp sharp!",
    shipped: "Your order is on its way to you, boet!",
    delivered: "Delivered! Enjoy your lekker bunny chow!",
  };

  const currentStatusIndex = statuses.indexOf(order.status);

  return statuses.map((status, index) => {
    let statusState: "completed" | "current" | "upcoming" = "upcoming";
    
    if (index < currentStatusIndex) {
      statusState = "completed";
    } else if (index === currentStatusIndex) {
      statusState = "current";
    }

    return {
      status,
      label: statusLabels[status],
      description: statusDescriptions[status],
      state: statusState,
      timestamp: statusState === "completed" ? order.updated_at : null,
    };
  });
}

