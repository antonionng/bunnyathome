import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendAbandonedCartEmail } from "@/lib/email/send";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Find carts that haven't been updated in 24 hours and haven't been converted to orders
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: abandonedCarts, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        profiles(id, full_name)
      `)
      .lt("updated_at", oneDayAgo)
      .is("email_sent_at", null);

    if (error) {
      console.error("Error fetching abandoned carts:", error);
      return NextResponse.json({ error: "Failed to fetch abandoned carts" }, { status: 500 });
    }

    const results = [];

    for (const cart of abandonedCarts || []) {
      try {
        const { data: user } = await supabase.auth.admin.getUserById(cart.user_id);

        if (!user.user?.email) continue;

        const cartData = cart.cart_data;
        if (!cartData.items || cartData.items.length === 0) continue;

        // Calculate total
        const total = cartData.items.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );

        // Send abandoned cart email with special promo
        await sendAbandonedCartEmail({
          email: user.user.email,
          customerName: cart.profiles?.full_name || user.user.email.split("@")[0],
          items: cartData.items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          total,
          cartUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
          promoCode: "COMEBACK10",
          promoDiscount: 10,
        });

        // Mark as email sent
        await supabase
          .from("cart_items")
          .update({ email_sent_at: new Date().toISOString() })
          .eq("user_id", cart.user_id);

        results.push({ userId: cart.user_id, success: true });
      } catch (emailError) {
        console.error("Error sending abandoned cart email:", emailError);
        results.push({ userId: cart.user_id, success: false, error: emailError });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Error in abandoned cart job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

