import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Failed to fetch profile:", error);
      return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error in profile endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

