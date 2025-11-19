"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { magicLinkSchema, type MagicLinkFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface MagicLinkFormProps {
  redirectTo?: string;
}

export function MagicLinkForm({ redirectTo = "/account" }: MagicLinkFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  });

  const onSubmit = async (data: MagicLinkFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
        },
      });

      if (error) {
        toast.error("Eish, couldn't send the link", {
          description: error.message,
        });
        return;
      }

      setIsSuccess(true);
      toast.success("Link sent, check your inbox!", {
        description: "Click the link in your email to log in, sharp sharp.",
      });
    } catch (error) {
      toast.error("Eish, something went wrong", {
        description: "Give it another bash in a bit.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-lg border-2 border-brand-green bg-brand-green/20 p-6 text-center">
        <div className="mb-4 text-4xl">📧</div>
        <h3 className="mb-2 text-lg font-bold text-ink">Check your email</h3>
        <p className="text-sm text-ink-muted">
          We've sent you a magic link. Click the link in the email to sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="email" required>
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <p className="mt-2 text-xs text-ink-muted">
          We'll send you a magic link for a password-free sign in
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Sending link..." : "Send magic link"}
      </Button>
    </form>
  );
}


