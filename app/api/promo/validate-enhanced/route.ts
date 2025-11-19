import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST - Enhanced validation with detailed feedback
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { code, cartTotal } = await request.json();

    // Get promo code
    const { data: promo } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();

    if (!promo) {
      return NextResponse.json({
        valid: false,
        message: "Promo code not found",
      });
    }

    // Use database function for validation if user is logged in
    if (user) {
      const { data: validationResult } = await supabase.rpc("can_use_promo", {
        promo_id: promo.id,
        user_uuid: user.id,
        cart_total: cartTotal,
      });

      if (!validationResult?.valid) {
        return NextResponse.json({
          valid: false,
          message: validationResult.reason || "Invalid promo code",
        });
      }
    } else {
      // Basic validation for guest users
      if (!promo.active) {
        return NextResponse.json({
          valid: false,
          message: "This promo code is no longer active",
        });
      }

      if (promo.valid_from && new Date() < new Date(promo.valid_from)) {
        return NextResponse.json({
          valid: false,
          message: "This promo code is not yet valid",
        });
      }

      if (promo.valid_until && new Date() > new Date(promo.valid_until)) {
        return NextResponse.json({
          valid: false,
          message: "This promo code has expired",
        });
      }

      if (promo.minimum_order_value && cartTotal < promo.minimum_order_value) {
        return NextResponse.json({
          valid: false,
          message: `Minimum order of £${(promo.minimum_order_value / 100).toFixed(2)} required`,
        });
      }

      if (promo.max_uses && promo.current_uses >= promo.max_uses) {
        return NextResponse.json({
          valid: false,
          message: "This promo code has reached its usage limit",
        });
      }

      // Check new customers only restriction
      if (promo.customer_restrictions?.new_customers_only) {
        return NextResponse.json({
          valid: false,
          message: "This promo code is for new customers only. Please sign in or create an account.",
        });
      }
    }

    // Calculate discount
    let discount = 0;
    if (promo.discount_type === "percentage") {
      discount = Math.round((cartTotal * promo.discount_value) / 100);
    } else {
      discount = promo.discount_value;
    }

    return NextResponse.json({
      valid: true,
      promo: {
        id: promo.id,
        code: promo.code,
        discountType: promo.discount_type,
        discountValue: promo.discount_value,
        description: promo.description,
        stackable: promo.stackable,
        calculatedDiscount: discount,
      },
      message: `Promo applied! You save £${(discount / 100).toFixed(2)}`,
    });
  } catch (error) {
    console.error("Error validating promo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

