import { createClient } from "@/lib/supabase/server";
import { notificationPreferencesSchema } from "@/lib/validations/settings";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
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
    const validatedData = notificationPreferencesSchema.parse(body);

    // Update notification preferences
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ notification_preferences: validatedData })
      .eq("id", user.id);

    if (updateError) {
      console.error("Notification preferences update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update notification preferences" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification preferences updated successfully",
    });
  } catch (error: any) {
    console.error("Notification preferences update error:", error);

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

