"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Download, Check, X } from "lucide-react";
import QRCode from "qrcode";
import Image from "next/image";

interface TwoFactorSetupProps {
  isEnabled: boolean;
  onStatusChange?: (enabled: boolean) => void;
}

export function TwoFactorSetup({ isEnabled, onStatusChange }: TwoFactorSetupProps) {
  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showDisableForm, setShowDisableForm] = useState(false);

  const startEnabling = async () => {
    setIsEnabling(true);

    try {
      const response = await fetch("/api/settings/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start 2FA setup");
      }

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(data.qrCodeUrl);
      setQrCodeUrl(qrDataUrl);
      setSecret(data.secret);
      setShowSetup(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to start 2FA setup");
    } finally {
      setIsEnabling(false);
    }
  };

  const verifyAndEnable = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsEnabling(true);

    try {
      const response = await fetch("/api/settings/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      setBackupCodes(data.backupCodes);
      toast.success("2FA enabled successfully!");
      if (onStatusChange) {
        onStatusChange(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to enable 2FA");
    } finally {
      setIsEnabling(false);
    }
  };

  const disable2FA = async () => {
    if (!disablePassword) {
      toast.error("Password is required");
      return;
    }

    if (disableCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsDisabling(true);

    try {
      const response = await fetch("/api/settings/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: disablePassword,
          code: disableCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to disable 2FA");
      }

      setShowDisableForm(false);
      setDisablePassword("");
      setDisableCode("");
      toast.success("2FA disabled successfully");
      if (onStatusChange) {
        onStatusChange(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to disable 2FA");
    } finally {
      setIsDisabling(false);
    }
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bunny-at-home-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const closeSetup = () => {
    setShowSetup(false);
    setQrCodeUrl("");
    setSecret("");
    setVerificationCode("");
    setBackupCodes([]);
  };

  if (isEnabled && !showDisableForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border-2 border-brand-green bg-brand-green/10 p-4">
          <Check className="h-5 w-5 text-brand-green" />
          <p className="font-bold text-ink">Two-factor authentication is enabled</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowDisableForm(true)}
          className="text-red-600"
        >
          Disable 2FA
        </Button>
      </div>
    );
  }

  if (showDisableForm) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border-2 border-black/10 bg-white p-4">
          <h3 className="mb-4 text-lg font-bold text-ink">Disable Two-Factor Authentication</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="disablePassword">Current Password</Label>
              <Input
                id="disablePassword"
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div>
              <Label htmlFor="disableCode">Verification Code</Label>
              <Input
                id="disableCode"
                type="text"
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={disable2FA} disabled={isDisabling}>
                {isDisabling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Disable 2FA
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDisableForm(false);
                  setDisablePassword("");
                  setDisableCode("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (backupCodes.length > 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border-2 border-brand-green bg-brand-green/10 p-4">
          <h3 className="mb-2 text-lg font-bold text-ink">Backup Codes</h3>
          <p className="mb-4 text-sm text-ink-muted">
            Save these backup codes somewhere safe. You can use them to access your account if you lose your authenticator device.
          </p>
          <div className="grid grid-cols-2 gap-2 rounded bg-white p-4 font-mono text-sm">
            {backupCodes.map((code, index) => (
              <div key={index} className="font-bold text-ink">{code}</div>
            ))}
          </div>
          <Button onClick={downloadBackupCodes} className="mt-4" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Codes
          </Button>
        </div>
        <Button onClick={closeSetup}>Done</Button>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border-2 border-black/10 bg-white p-4">
          <h3 className="mb-4 text-lg font-bold text-ink">Set Up Two-Factor Authentication</h3>
          
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-ink-muted">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
              </p>
              {qrCodeUrl && (
                <div className="flex justify-center">
                  <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} unoptimized />
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm text-ink-muted">Or enter this code manually:</p>
              <div className="rounded bg-gray-100 p-3 font-mono text-sm font-bold text-ink">
                {secret}
              </div>
            </div>

            <div>
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code from your app"
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={verifyAndEnable} disabled={isEnabling || verificationCode.length !== 6}>
                {isEnabling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Enable
              </Button>
              <Button variant="outline" onClick={closeSetup}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border-2 border-black/10 bg-white p-4">
        <X className="h-5 w-5 text-ink-muted" />
        <p className="text-ink-muted">Two-factor authentication is not enabled</p>
      </div>
      <Button onClick={startEnabling} disabled={isEnabling}>
        {isEnabling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enable 2FA
      </Button>
    </div>
  );
}

