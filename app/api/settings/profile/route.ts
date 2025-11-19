import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/validations/settings";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

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

    // Treat empty optional strings (like phone) as undefined so they pass validation
    if (typeof body.phone === "string" && body.phone.trim() === "") {
      delete body.phone;
    }

    const validatedData = profileUpdateSchema.parse(body);

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update(validatedData)
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Profile update error:", error);

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

