import { createClient } from "@/lib/supabase/server";
import { emailChangeSchema } from "@/lib/validations/settings";
import { NextResponse } from "next/server";

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
    const validatedData = emailChangeSchema.parse(body);

    // Update email via Supabase Auth
    // This will send a confirmation email to the new address
    const { error: updateError } = await supabase.auth.updateUser({
      email: validatedData.newEmail,
    });

    if (updateError) {
      console.error("Email update error:", updateError);
      return NextResponse.json(
        { error: updateError.message || "Failed to update email" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Verification email sent! Please check your new email address to confirm the change.",
    });
  } catch (error: any) {
    console.error("Email update error:", error);

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

