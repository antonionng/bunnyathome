import { createClient } from "@/lib/supabase/server";
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

    const body = await request.json();
    const { code } = body;

    // If code is provided, verify and enable 2FA
    if (code) {
      // Get the temp secret from the session (you'll need to implement session storage)
      // For now, we'll get it from the profile if it's already there
      const { data: profile } = await supabase
        .from("profiles")
        .select("two_factor_secret")
        .eq("id", user.id)
        .single();

      if (!profile?.two_factor_secret) {
        return NextResponse.json(
          { error: "No 2FA setup in progress" },
          { status: 400 }
        );
      }

      // Verify the code
      const verified = speakeasy.totp.verify({
        secret: profile.two_factor_secret,
        encoding: "base32",
        token: code,
        window: 2,
      });

      if (!verified) {
        return NextResponse.json(
          { error: "Invalid verification code" },
          { status: 400 }
        );
      }

      // Enable 2FA
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ two_factor_enabled: true })
        .eq("id", user.id);

      if (updateError) {
        console.error("2FA enable error:", updateError);
        return NextResponse.json(
          { error: "Failed to enable 2FA" },
          { status: 500 }
        );
      }

      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () =>
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );

      return NextResponse.json({
        success: true,
        message: "2FA enabled successfully",
        backupCodes,
      });
    } else {
      // Generate new secret and return QR code data
      const secret = speakeasy.generateSecret({
        name: `Bunny At Home (${user.email})`,
        issuer: "Bunny At Home",
      });

      // Save the secret temporarily (should be saved only after verification)
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ two_factor_secret: secret.base32 })
        .eq("id", user.id);

      if (updateError) {
        console.error("2FA secret save error:", updateError);
        return NextResponse.json(
          { error: "Failed to generate 2FA secret" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        secret: secret.base32,
        qrCodeUrl: secret.otpauth_url,
      });
    }
  } catch (error: any) {
    console.error("2FA enable error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

