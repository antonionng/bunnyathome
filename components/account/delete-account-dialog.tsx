"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteAccountDialogProps {
  requires2FA?: boolean;
}

export function DeleteAccountDialog({ requires2FA }: DeleteAccountDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [code2FA, setCode2FA] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (!confirmed) {
      toast.error("Please confirm account deletion");
      return;
    }

    if (requires2FA && code2FA.length !== 6) {
      toast.error("Please enter your 6-digit 2FA code");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/settings/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          confirmation: confirmed,
          code: requires2FA ? code2FA : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      toast.success("Account deleted successfully. Goodbye! 👋");
      
      // Redirect to home after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  const openDialog = () => {
    setIsOpen(true);
    setPassword("");
    setCode2FA("");
    setConfirmed(false);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setPassword("");
    setCode2FA("");
    setConfirmed(false);
  };

  if (!isOpen) {
    return (
      <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-ink">Danger Zone</h2>
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-red-600 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-bold text-red-600">Delete Account</p>
                <p className="mt-1 text-sm text-red-600/80">
                  Once you delete your account, there is no going back. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={openDialog} className="border-red-600 text-red-600 hover:bg-red-50">
            Delete My Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border-4 border-black bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-ink">Delete Account?</h2>
        </div>

        <div className="mb-6 space-y-4">
          <p className="text-ink">
            This action is permanent and cannot be undone. All your data will be permanently deleted:
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-ink-muted">
            <li>Your profile and preferences</li>
            <li>Saved boxes and recipes</li>
            <li>Order history</li>
            <li>Subscription will be cancelled</li>
            <li>Rewards points will be forfeited</li>
          </ul>

          <div className="space-y-4 rounded-lg border-2 border-red-600/20 bg-red-50 p-4">
            <div>
              <Label htmlFor="deletePassword">Confirm Your Password</Label>
              <Input
                id="deletePassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isDeleting}
              />
            </div>

            {requires2FA && (
              <div>
                <Label htmlFor="delete2FA">2FA Code</Label>
                <Input
                  id="delete2FA"
                  type="text"
                  value={code2FA}
                  onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  disabled={isDeleting}
                />
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                disabled={isDeleting}
                className="mt-1 h-4 w-4 rounded border-2 border-black"
              />
              <span className="text-sm text-ink">
                I understand this action cannot be undone and I want to permanently delete my account
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleDelete}
            disabled={isDeleting || !confirmed || !password}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Delete My Account
          </Button>
          <Button variant="outline" onClick={closeDialog} disabled={isDeleting} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

