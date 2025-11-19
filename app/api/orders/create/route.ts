import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/email/send";
import { format } from "date-fns";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BH-${timestamp}${random}`;
}

// Calculate loyalty points: 1 point per £1 spent
function calculateLoyaltyPoints(total: number): number {
  return Math.floor(total / 100);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const {
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      deliveryAddress,
      deliveryDate,
      deliveryTimeSlot,
      stripePaymentIntentId,
      notes,
      guestEmail,
      promoCode,
    } = await request.json();

    const orderNumber = generateOrderNumber();
    const userId = user?.id || null;

    // Create the order
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        order_number: orderNumber,
        status: "confirmed",
        items,
        subtotal,
        delivery_fee: deliveryFee,
        discount,
        total,
        delivery_address: deliveryAddress,
        delivery_date: deliveryDate,
        delivery_time_slot: deliveryTimeSlot,
        stripe_payment_intent_id: stripePaymentIntentId,
        notes,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Award loyalty points if user is logged in
    if (userId) {
      const points = calculateLoyaltyPoints(total);
      const { error: pointsError } = await supabase
        .from("profiles")
        .update({
          points_balance: supabase.rpc("increment_points", { points_to_add: points }),
        })
        .eq("id", userId);

      if (pointsError) {
        console.error("Error awarding points:", pointsError);
      }
    }

    // Increment promo code usage if applicable
    if (promoCode) {
      const { error: promoError } = await supabase
        .from("promo_codes")
        .update({ current_uses: supabase.rpc("increment", { increment_by: 1 }) })
        .eq("code", promoCode);

      if (promoError) {
        console.error("Error updating promo code:", promoError);
      }
    }

    // Get customer info for email
    let customerName = "Valued Customer";
    let customerEmail = guestEmail;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      customerName = profile?.full_name || user.email?.split("@")[0] || "Valued Customer";
      customerEmail = user.email || guestEmail;
    }

    // Send confirmation email
    if (customerEmail) {
      try {
        await sendOrderConfirmation({
          email: customerEmail,
          orderNumber,
          customerName,
          total,
          items: items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          deliveryAddress,
          deliveryDate: format(new Date(deliveryDate), "EEEE, MMMM d, yyyy"),
          deliveryTimeSlot,
          subtotal,
          deliveryFee,
          discount,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the order if email fails
      }
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error in order creation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



