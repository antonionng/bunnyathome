import { createClient } from "@/lib/supabase/server";
import { accountDeletionSchema } from "@/lib/validations/settings";
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
    const validatedData = accountDeletionSchema.parse(body);

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

    // Get profile to check 2FA status and clean up avatar
    const { data: profile } = await supabase
      .from("profiles")
      .select("two_factor_secret, two_factor_enabled, avatar_url")
      .eq("id", user.id)
      .single();

    // If 2FA is enabled, verify the code
    if (profile?.two_factor_enabled && profile.two_factor_secret) {
      if (!validatedData.code) {
        return NextResponse.json(
          { error: "2FA code is required" },
          { status: 400 }
        );
      }

      const verified = speakeasy.totp.verify({
        secret: profile.two_factor_secret,
        encoding: "base32",
        token: validatedData.code,
        window: 2,
      });

      if (!verified) {
        return NextResponse.json(
          { error: "Invalid 2FA code" },
          { status: 400 }
        );
      }
    }

    // Cancel active subscriptions first
    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("id, stripe_subscription_id")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (subscriptions && subscriptions.length > 0) {
      // In production, you would call Stripe API here to cancel subscriptions
      // For now, just mark them as cancelled in the database
      for (const subscription of subscriptions) {
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("id", subscription.id);
      }
    }

    // Delete user avatar from storage if exists
    if (profile?.avatar_url) {
      try {
        const url = new URL(profile.avatar_url);
        const segments = url.pathname.split("/");
        const bucketIndex = segments.findIndex((segment) => segment === "avatars");
        if (bucketIndex !== -1 && bucketIndex + 1 < segments.length) {
          const filePath = segments.slice(bucketIndex + 1).join("/");
          if (filePath) {
            await supabase.storage.from("avatars").remove([filePath]);
          }
        }
      } catch (e) {
        console.error("Failed to parse avatar URL for deletion:", e);
      }
    }

    // Soft delete: Anonymize profile data instead of hard delete
    // This preserves order history for business records
    const { error: anonymizeError } = await supabase
      .from("profiles")
      .update({
        full_name: "Deleted User",
        phone: null,
        avatar_url: null,
        preferred_name: null,
        dietary_preferences: null,
        notification_preferences: { order_updates: false, marketing: false, recipes: false },
        communication_preferences: { email: false, sms: false, whatsapp: false },
        two_factor_enabled: false,
        two_factor_secret: null,
      })
      .eq("id", user.id);

    if (anonymizeError) {
      console.error("Profile anonymization error:", anonymizeError);
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: 500 }
      );
    }

    // Delete the auth user (this will cascade delete via foreign keys)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("User deletion error:", deleteError);
      // If we can't delete auth user, at least the profile is anonymized
      return NextResponse.json(
        { 
          success: true,
          message: "Account data anonymized. Please contact support to complete deletion." 
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error: any) {
    console.error("Account deletion error:", error);

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

