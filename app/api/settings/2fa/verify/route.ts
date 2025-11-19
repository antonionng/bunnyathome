import { createClient } from "@/lib/supabase/server";
import { twoFactorEnableSchema } from "@/lib/validations/settings";
import { NextResponse } from "next/server";
import * as speakeasy from "speakeasy";

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = twoFactorEnableSchema.parse(body);

    // Get profile with 2FA secret
    const { data: profile } = await supabase
      .from("profiles")
      .select("two_factor_secret, two_factor_enabled")
      .eq("id", user.id)
      .single();

    if (!profile?.two_factor_enabled || !profile.two_factor_secret) {
      return NextResponse.json(
        { error: "2FA is not enabled" },
        { status: 400 }
      );
    }

    // Verify the code
    const verified = speakeasy.totp.verify({
      secret: profile.two_factor_secret,
      encoding: "base32",
      token: validatedData.code,
      window: 2,
    });

    return NextResponse.json({
      success: true,
      verified,
    });
  } catch (error: any) {
    console.error("2FA verify error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

