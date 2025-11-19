"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Bell, Sparkles, Globe, Mail, MessageSquare, Smartphone, Download } from "lucide-react";
import { AvatarUpload } from "@/components/account/avatar-upload";
import { TwoFactorSetup } from "@/components/account/two-factor-setup";
import { PasswordChangeForm } from "@/components/account/password-change-form";
import { DeleteAccountDialog } from "@/components/account/delete-account-dialog";
import { extractFirstName } from "@/lib/utils/name-extractor";

type Tab = "profile" | "security" | "notifications" | "ai" | "privacy";

const TIMEZONES = [
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "af", label: "Afrikaans" },
  { value: "zu", label: "Zulu" },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  // AI Preferences
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [spiceLevel, setSpiceLevel] = useState(3);

  // Notification preferences
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [recipes, setRecipes] = useState(true);

  // Communication preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);

  // Privacy settings
  const [timezone, setTimezone] = useState("Europe/London");
  const [language, setLanguage] = useState("en");

  const supabase = createClient();

  const tabs = [
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "security" as Tab, label: "Security", icon: Shield },
    { id: "notifications" as Tab, label: "Notifications", icon: Bell },
    { id: "ai" as Tab, label: "AI Preferences", icon: Sparkles },
    { id: "privacy" as Tab, label: "Privacy", icon: Globe },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || "");
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
          setAvatarUrl(data.avatar_url);
          setDietaryPreferences(data.dietary_preferences || "");
          setSpiceLevel(data.spice_level || 3);
          setTimezone(data.timezone || "Europe/London");
          setLanguage(data.language || "en");

          // Load notification preferences
          const notifPrefs = data.notification_preferences || {};
          setOrderUpdates(notifPrefs.order_updates ?? true);
          setMarketing(notifPrefs.marketing ?? true);
          setRecipes(notifPrefs.recipes ?? true);

          // Load communication preferences
          const commPrefs = data.communication_preferences || {};
          setEmailNotifications(commPrefs.email ?? true);
          setSmsNotifications(commPrefs.sms ?? false);
          setWhatsappNotifications(commPrefs.whatsapp ?? false);
        }
      }

      setIsLoading(false);
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone: phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail) {
      toast.error("Please enter a new email address");
      return;
    }

    setIsChangingEmail(true);

    try {
      const response = await fetch("/api/settings/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change email");
      }

      toast.success(data.message);
      setNewEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to change email");
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_updates: orderUpdates,
          marketing: marketing,
          recipes: recipes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save notification preferences");
      }

      toast.success("Notification preferences updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save notification preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAI = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dietary_preferences: dietaryPreferences,
          spice_level: spiceLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save AI preferences");
      }

      toast.success("AI preferences updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save AI preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsSaving(true);

    try {
      const [commResponse, profileResponse] = await Promise.all([
        fetch("/api/settings/communication", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailNotifications,
            sms: smsNotifications,
            whatsapp: whatsappNotifications,
          }),
        }),
        fetch("/api/settings/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timezone: timezone,
            language: language,
          }),
        }),
      ]);

      if (!commResponse.ok || !profileResponse.ok) {
        throw new Error("Failed to save privacy settings");
      }

      toast.success("Privacy settings updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save privacy settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/settings/export");

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bunny-at-home-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to export data");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const firstName = extractFirstName(fullName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Your Settings</h1>
        <p className="mt-2 text-ink-muted">Sort out your details and what we send you</p>
      </div>

      {/* Tab Navigation */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 border-b-2 border-black/10 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-3 text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-ink"
                    : "text-ink-muted hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-curry"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-ink">Profile Information</h2>
                <div className="space-y-6">
                  <AvatarUpload
                    currentAvatar={avatarUrl}
                    userName={fullName}
                    onUploadSuccess={(url) => setAvatarUrl(url)}
                  />

                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Like 'Sipho Mkhize' or 'Sarah Johnson'"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="So we can WhatsApp you about delivery"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="space-y-2">
                      <Input
                        id="email"
                        type="email"
                        value={userEmail}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-ink-muted">
                        Your current email. To change it, enter a new one below.
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newEmail">New Email Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter new email address"
                      />
                      <Button
                        onClick={handleChangeEmail}
                        disabled={isChangingEmail || !newEmail}
                        variant="outline"
                      >
                        {isChangingEmail ? "Sending..." : "Change Email"}
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">
                      You'll need to verify your new email address
                    </p>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <PasswordChangeForm />

              <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-ink">Two-Factor Authentication</h2>
                <TwoFactorSetup
                  isEnabled={profile?.two_factor_enabled || false}
                  onStatusChange={(enabled) =>
                    setProfile({ ...profile, two_factor_enabled: enabled })
                  }
                />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-ink">Notification Preferences</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between rounded-lg border-2 border-black/10 p-4 transition-colors hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-bold text-ink">Order Updates</p>
                      <p className="text-sm text-ink-muted">
                        Where your box is (you'll want this one, bru)
                      </p>
                    </div>
                    <button
                      onClick={() => setOrderUpdates(!orderUpdates)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        orderUpdates ? "bg-brand-curry" : "bg-gray-300"
                      }`}
                    >
                      <motion.div
                        animate={{ x: orderUpdates ? 20 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 h-4 w-4 rounded-full bg-white"
                      />
                    </button>
                  </label>

                  <label className="flex items-center justify-between rounded-lg border-2 border-black/10 p-4 transition-colors hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-bold text-ink">Marketing & Deals</p>
                      <p className="text-sm text-ink-muted">
                        New bunny chow drops and lekker deals
                      </p>
                    </div>
                    <button
                      onClick={() => setMarketing(!marketing)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        marketing ? "bg-brand-curry" : "bg-gray-300"
                      }`}
                    >
                      <motion.div
                        animate={{ x: marketing ? 20 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 h-4 w-4 rounded-full bg-white"
                      />
                    </button>
                  </label>

                  <label className="flex items-center justify-between rounded-lg border-2 border-black/10 p-4 transition-colors hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-bold text-ink">Recipes & Tips</p>
                      <p className="text-sm text-ink-muted">
                        How to make it even more lekker
                      </p>
                    </div>
                    <button
                      onClick={() => setRecipes(!recipes)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        recipes ? "bg-brand-curry" : "bg-gray-300"
                      }`}
                    >
                      <motion.div
                        animate={{ x: recipes ? 20 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 h-4 w-4 rounded-full bg-white"
                      />
                    </button>
                  </label>
                </div>

                <Button onClick={handleSaveNotifications} disabled={isSaving} className="mt-6">
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-black bg-gradient-to-br from-purple-500 to-pink-500 p-6 shadow-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-white" />
                  <div>
                    <h2 className="mb-1 text-xl font-bold text-white">AI Personalization</h2>
                    <p className="text-sm text-white/80">
                      Help our AI give you better recommendations and a more personal experience
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-bold text-ink">Preferences</h3>
                <div className="space-y-4">
                  <div className="rounded-lg border-2 border-brand-curry/20 bg-brand-curry/10 p-4">
                    <p className="text-sm font-bold text-ink">
                      We'll call you: <span className="text-brand-curry">{firstName}</span>
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      Extracted from your full name. Update your full name in the Profile tab to change this.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="dietaryPreferences">Dietary Restrictions</Label>
                    <Textarea
                      id="dietaryPreferences"
                      value={dietaryPreferences}
                      onChange={(e) => setDietaryPreferences(e.target.value)}
                      placeholder="E.g., vegetarian, halal, no peanuts..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Spice Tolerance</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={spiceLevel}
                        onChange={(e) => setSpiceLevel(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <div className="flex h-10 w-16 items-center justify-center rounded-full border-2 border-brand-curry bg-brand-curry/10 font-bold text-ink">
                        {spiceLevel}/5
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">
                      We'll recommend curries based on your heat preference
                    </p>
                  </div>

                  <Button onClick={handleSaveAI} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save AI Preferences"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-ink">Communication Preferences</h2>
                <p className="mb-4 text-sm text-ink-muted">
                  Choose how you'd like us to reach you
                </p>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 rounded-lg border-2 border-black/10 p-4 transition-colors hover:bg-gray-50">
                    <Mail className="h-5 w-5 text-ink-muted" />
                    <div className="flex-1">
                      <p className="font-bold text-ink">Email</p>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        emailNotifications ? "bg-brand-curry" : "bg-gray-300"
                      }`}
                    >
                      <motion.div
                        animate={{ x: emailNotifications ? 20 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 h-4 w-4 rounded-full bg-white"
                      />
                    </button>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border-2 border-black/10 p-4 transition-colors hover:bg-gray-50">
                    <Smartphone className="h-5 w-5 text-ink-muted" />
                    <div className="flex-1">
                      <p className="font-bold text-ink">SMS</p>
                    </div>
                    <button
                      onClick={() => setSmsNotifications(!smsNotifications)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        smsNotifications ? "bg-brand-curry" : "bg-gray-300"
                      }`}
                    >
                      <motion.div
                        animate={{ x: smsNotifications ? 20 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 h-4 w-4 rounded-full bg-white"
                      />
                    </button>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border-2 border-black/10 p-4 transition-colors hover:bg-gray-50">
                    <MessageSquare className="h-5 w-5 text-ink-muted" />
                    <div className="flex-1">
                      <p className="font-bold text-ink">WhatsApp</p>
                    </div>
                    <button
                      onClick={() => setWhatsappNotifications(!whatsappNotifications)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        whatsappNotifications ? "bg-brand-curry" : "bg-gray-300"
                      }`}
                    >
                      <motion.div
                        animate={{ x: whatsappNotifications ? 20 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 h-4 w-4 rounded-full bg-white"
                      />
                    </button>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-ink">Regional Settings</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      id="timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-ink">Data & Privacy</h2>
                <div className="space-y-3">
                  <Button variant="outline" onClick={handleExportData} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download My Data
                  </Button>
                </div>
              </div>

              <Button onClick={handleSavePrivacy} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Privacy Settings"}
              </Button>

              <DeleteAccountDialog requires2FA={profile?.two_factor_enabled} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
