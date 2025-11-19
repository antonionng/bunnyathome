import { createClient } from "@/lib/supabase/server";
import { communicationPreferencesSchema } from "@/lib/validations/settings";
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
    const validatedData = communicationPreferencesSchema.parse(body);

    // Update communication preferences
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ communication_preferences: validatedData })
      .eq("id", user.id);

    if (updateError) {
      console.error("Communication preferences update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update communication preferences" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Communication preferences updated successfully",
    });
  } catch (error: any) {
    console.error("Communication preferences update error:", error);

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

