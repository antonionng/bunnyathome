"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength indicators
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      toast.error("Please meet all password requirements");
      return;
    }

    setIsChanging(true);

    try {
      const response = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-ink">Change Password</h2>
        
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="space-y-2 rounded-lg border-2 border-black/10 bg-gray-50 p-4 text-sm">
              <p className="font-bold text-ink">Password Requirements:</p>
              <div className="space-y-1">
                <div className={`flex items-center gap-2 ${hasMinLength ? "text-brand-green" : "text-ink-muted"}`}>
                  {hasMinLength ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${hasUppercase ? "text-brand-green" : "text-ink-muted"}`}>
                  {hasUppercase ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center gap-2 ${hasLowercase ? "text-brand-green" : "text-ink-muted"}`}>
                  {hasLowercase ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  <span>One lowercase letter</span>
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? "text-brand-green" : "text-ink-muted"}`}>
                  {hasNumber ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  <span>One number</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-sm text-red-600">Passwords don't match</p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="mt-1 text-sm text-brand-green">Passwords match!</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isChanging || !isValid}>
            {isChanging && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Change Password
          </Button>
        </div>
      </div>
    </form>
  );
}

