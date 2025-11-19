import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { isValid: false, errorMessage: "Promo code is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({
        isValid: false,
        errorMessage: "Invalid promo code",
      });
    }

    // Check if code is still valid
    const now = new Date();
    const validFrom = new Date(data.valid_from);
    const validUntil = new Date(data.valid_until);

    if (now < validFrom || now > validUntil) {
      return NextResponse.json({
        isValid: false,
        errorMessage: "This promo code has expired",
      });
    }

    if (data.current_uses >= data.max_uses) {
      return NextResponse.json({
        isValid: false,
        errorMessage: "This promo code has reached its usage limit",
      });
    }

    return NextResponse.json({
      isValid: true,
      code: data.code,
      discountType: data.discount_type,
      discountValue: data.discount_value,
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return NextResponse.json(
      { isValid: false, errorMessage: "Failed to validate promo code" },
      { status: 500 }
    );
  }
}



