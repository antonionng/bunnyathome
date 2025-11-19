"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SignupFormProps {
  redirectTo?: string;
}

export function SignupForm({ redirectTo = "/account" }: SignupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
        },
      });

      if (error) {
        toast.error("Eish, sign up didn't work", {
          description: error.message,
        });
        return;
      }

      toast.success("Sorted! You're in, boet", {
        description: "Check your email to verify, then you're good to go.",
      });
      
      // Optionally redirect to a "check your email" page
      // router.push("/auth/verify-email");
    } catch (error) {
      toast.error("Eish, something went wrong", {
        description: "Give it another bash in a bit.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="fullName" required>
          Full name
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
      </div>

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
      </div>

      <div>
        <Label htmlFor="password" required>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          {...register("password")}
        />
        <p className="mt-2 text-xs text-ink-muted">
          Must be 8+ characters with uppercase, lowercase, and a number
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}


