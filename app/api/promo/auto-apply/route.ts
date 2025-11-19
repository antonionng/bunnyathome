import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST - Find and apply best auto-apply promo
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { cartTotal, items } = await request.json();

    // Get all active auto-apply promos
    const { data: promos } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("active", true)
      .eq("auto_apply", true)
      .lte("valid_from", new Date().toISOString())
      .gte("valid_until", new Date().toISOString())
      .order("priority", { ascending: false });

    if (!promos || promos.length === 0) {
      return NextResponse.json({ promo: null });
    }

    // If user is logged in, check which promos they can use
    let bestPromo = null;
    let maxDiscount = 0;

    for (const promo of promos) {
      // Check basic requirements
      if (promo.minimum_order_value && cartTotal < promo.minimum_order_value) {
        continue;
      }

      if (promo.max_uses && promo.current_uses >= promo.max_uses) {
        continue;
      }

      // If user is logged in, check advanced restrictions
      if (user) {
        const { data: validationResult } = await supabase.rpc("can_use_promo", {
          promo_id: promo.id,
          user_uuid: user.id,
          cart_total: cartTotal,
        });

        if (!validationResult?.valid) {
          continue;
        }

        // Check per-user usage
        if (promo.usage_per_user) {
          const { count } = await supabase
            .from("promo_usage")
            .select("*", { count: "exact", head: true })
            .eq("promo_code_id", promo.id)
            .eq("user_id", user.id);

          if (count && count >= promo.usage_per_user) {
            continue;
          }
        }
      }

      // Calculate discount
      let discount = 0;
      if (promo.discount_type === "percentage") {
        discount = Math.round((cartTotal * promo.discount_value) / 100);
      } else {
        discount = promo.discount_value;
      }

      // Track best promo
      if (discount > maxDiscount) {
        maxDiscount = discount;
        bestPromo = promo;
      }
    }

    if (bestPromo) {
      return NextResponse.json({
        promo: {
          code: bestPromo.code,
          discountType: bestPromo.discount_type,
          discountValue: bestPromo.discount_value,
          description: bestPromo.description,
          isValid: true,
          autoApplied: true,
        },
      });
    }

    return NextResponse.json({ promo: null });
  } catch (error) {
    console.error("Error finding auto-apply promo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

