import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 2MB" },
        { status: 400 }
      );
    }

    // Generate unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        {
          error:
            uploadError.message ||
            "Failed to upload avatar. Check that the 'avatars' storage bucket exists and your storage policies allow uploads.",
        },
        { status: 500 }
      );
    }

    // Get a signed URL so avatars work even when the bucket is private
    const { data: signedData, error: signedError } = await supabase.storage
      .from("avatars")
      .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

    if (signedError || !signedData?.signedUrl) {
      console.error("Signed URL error:", signedError);
      return NextResponse.json(
        {
          error:
            signedError?.message ||
            "Avatar uploaded but failed to create access URL. Please try again.",
        },
        { status: 500 }
      );
    }

    const avatarUrl = signedData.signedUrl;

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: updateError.message || "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      avatar_url: avatarUrl,
      message: "Avatar uploaded successfully",
    });
  } catch (error: any) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove avatar
export async function DELETE(request: Request) {
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

    // Get current avatar URL from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profile?.avatar_url) {
      try {
        const url = new URL(profile.avatar_url);
        const segments = url.pathname.split("/");
        // Find the bucket name segment ("avatars") and take everything after it as the file path
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

    // Remove avatar URL from profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: "Failed to remove avatar" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Avatar removed successfully",
    });
  } catch (error: any) {
    console.error("Avatar removal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

