import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateProductImage } from "@/lib/ai/image-generator";
import type { AIImageRequest } from "@/types/product";

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
    const body: AIImageRequest = await request.json();

    if (!body.productName || !body.category || !body.description) {
      return NextResponse.json(
        { error: "Product name, category, and description are required" },
        { status: 400 }
      );
    }

    // Generate image using AI
    const result = await generateProductImage(body);

    // Track AI generation
    await supabase.from("ai_generations").insert({
      generation_type: "image",
      entity_type: "product",
      prompt: result.prompt,
      model: "dall-e-3",
      result: result.imageUrl,
      result_metadata: result.metadata,
      status: "completed",
      generated_by: user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to generate image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

