import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateProductDescription } from "@/lib/ai/product-generator";
import type { AIDescriptionRequest } from "@/types/product";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin, admin_role")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const body: AIDescriptionRequest = await request.json();

    if (!body.productName || !body.category) {
      return NextResponse.json(
        { error: "Product name and category are required" },
        { status: 400 }
      );
    }

    // Generate description using AI
    const result = await generateProductDescription(body);

    // Track AI generation
    await supabase.from("ai_generations").insert({
      generation_type: "description",
      entity_type: "product",
      prompt: JSON.stringify(body),
      model: "gpt-4-turbo-preview",
      result: JSON.stringify(result),
      status: "completed",
      generated_by: user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to generate description:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}

