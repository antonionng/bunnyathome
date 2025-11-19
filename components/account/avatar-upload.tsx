"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils/name-extractor";
import Image from "next/image";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userName?: string | null;
  onUploadSuccess?: (avatarUrl: string) => void;
}

export function AvatarUpload({
  currentAvatar,
  userName,
  onUploadSuccess,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/settings/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Avatar updated successfully!");
      if (onUploadSuccess) {
        onUploadSuccess(data.avatar_url);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
      setPreviewUrl(currentAvatar || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);

    try {
      const response = await fetch("/api/settings/avatar", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove avatar");
      }

      setPreviewUrl(null);
      toast.success("Avatar removed successfully!");
      if (onUploadSuccess) {
        onUploadSuccess("");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to remove avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const initials = getInitials(userName);

  return (
    <div className="flex items-start gap-6">
      <div
        className={`group relative flex h-32 w-32 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-black bg-brand-curry shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl ${
          isDragging ? "scale-105 ring-4 ring-brand-curry/50" : ""
        } ${isUploading ? "opacity-50" : ""}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Avatar"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="text-4xl font-bold text-brand-black">{initials}</span>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-black/70">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-brand-black/0 opacity-0 transition-all group-hover:bg-brand-black/60 group-hover:opacity-100">
          <Upload className="h-8 w-8 text-white" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex-1 space-y-3">
        <div>
          <p className="text-sm font-bold text-ink">Profile Picture</p>
          <p className="text-xs text-ink-muted">
            Drag & drop or click to upload. Max 2MB. JPEG, PNG, or WebP.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleClick}
            variant="outline"
            size="sm"
            disabled={isUploading}
            icon={<Upload className="h-4 w-4" />}
            className="border-2 border-black"
          >
            {previewUrl ? "Change Avatar" : "Upload Avatar"}
          </Button>

          {previewUrl && (
            <Button
              onClick={handleRemove}
              variant="outline"
              size="sm"
              disabled={isUploading}
              icon={<X className="h-4 w-4" />}
              className="border-2 border-black text-red-600 hover:bg-red-50"
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

