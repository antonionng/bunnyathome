import { createClient } from "@/lib/supabase/server";
import { twoFactorDisableSchema } from "@/lib/validations/settings";
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
    const validatedData = twoFactorDisableSchema.parse(body);

    // Verify password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: validatedData.password,
    });

    if (signInError) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Get profile with 2FA secret
    const { data: profile } = await supabase
      .from("profiles")
      .select("two_factor_secret, two_factor_enabled")
      .eq("id", user.id)
      .single();

    if (!profile?.two_factor_enabled) {
      return NextResponse.json({ error: "2FA is not enabled" }, { status: 400 });
    }

    // Verify 2FA code
    const verified = speakeasy.totp.verify({
      secret: profile.two_factor_secret!,
      encoding: "base32",
      token: validatedData.code,
      window: 2,
    });

    if (!verified) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Disable 2FA
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        two_factor_enabled: false,
        two_factor_secret: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("2FA disable error:", updateError);
      return NextResponse.json(
        { error: "Failed to disable 2FA" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "2FA disabled successfully",
    });
  } catch (error: any) {
    console.error("2FA disable error:", error);

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

