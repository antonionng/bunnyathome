import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function normalizeCartData(cartData: any) {
  if (!cartData || typeof cartData !== "object") {
    return {
      items: [],
      promoCode: null,
    };
  }

  return {
    items: Array.isArray(cartData.items) ? cartData.items : [],
    promoCode: cartData.promoCode || null,
  };
}

// Merge local cart with server cart
function mergeCartData(localCart: any, serverCart: any) {
  const normalizedLocal = normalizeCartData(localCart);
  const normalizedServer = normalizeCartData(serverCart);

  if (normalizedServer.items.length === 0) {
    return normalizedLocal;
  }

  if (normalizedLocal.items.length === 0) {
    return normalizedServer;
  }

  // Create a map of items by product ID and type for merging
  const mergedItemsMap = new Map();

  // Add server items first
  normalizedServer.items.forEach((item: any) => {
    const key = `${item.productId}-${item.type}-${item.spiceLevel || ""}`;
    mergedItemsMap.set(key, item);
  });

  // Merge local items (sum quantities for duplicates)
  normalizedLocal.items.forEach((item: any) => {
    const key = `${item.productId}-${item.type}-${item.spiceLevel || ""}`;
    const existing = mergedItemsMap.get(key);

    if (existing) {
      // Item exists in both - sum quantities
      mergedItemsMap.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      // New item from local cart
      mergedItemsMap.set(key, item);
    }
  });

  return {
    items: Array.from(mergedItemsMap.values()),
    promoCode: normalizedLocal.promoCode || normalizedServer.promoCode,
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure profile exists (in case trigger didn't fire)
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      // Create profile if it doesn't exist
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          referral_code: generateReferralCode(),
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        // Continue anyway, as the profile might have been created by another request
      }
    }

    let body: any = null;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Invalid cart sync payload:", parseError);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const merge = Boolean(body?.merge);
    const normalizedCartData = normalizeCartData(body?.cartData);
    let finalCartData = normalizedCartData;

    if (merge) {
      // Fetch existing server cart
      const { data: existingCart } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existingCart) {
        // Merge local and server carts
        finalCartData = mergeCartData(normalizedCartData, existingCart.cart_data);
      }
    }

    // Upsert merged cart data
    const { error } = await supabase
      .from("cart_items")
      .upsert({
        user_id: user.id,
        cart_data: finalCartData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error syncing cart:", error);
      return NextResponse.json(
        {
          error: "Failed to sync cart",
          details: {
            message: error.message,
            code: error.code,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, cartData: finalCartData });
  } catch (error) {
    console.error("Error in cart sync:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

// Simple referral code generator (matches the database function logic)
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select("cart_data")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No cart found
        return NextResponse.json({ cartData: null });
      }
      console.error("Error fetching cart:", error);
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }

    return NextResponse.json({ cartData: data.cart_data });
  } catch (error) {
    console.error("Error in cart fetch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
