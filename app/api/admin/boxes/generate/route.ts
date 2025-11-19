import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateBoxSuggestions } from "@/lib/ai/box-recommender";
import type { SeasonalBoxRequest } from "@/types/product";

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
    const body: SeasonalBoxRequest = await request.json();

    // TODO: Fetch available products from database
    // For now, use mock data from the catalog
    const availableProducts: any[] = [];

    // Generate box suggestions using AI
    const suggestions = await generateBoxSuggestions(availableProducts, body);

    // Track AI generation
    await supabase.from("ai_generations").insert({
      generation_type: "seasonal_box",
      entity_type: "box",
      prompt: JSON.stringify(body),
      model: "gpt-4-turbo-preview",
      result: JSON.stringify(suggestions),
      status: "completed",
      generated_by: user.id,
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Failed to generate box suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate box suggestions" },
      { status: 500 }
    );
  }
}

