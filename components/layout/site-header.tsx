"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { FlowModal } from "@/components/builder/flow-modal";

const primaryLinks = [
  { href: "/experience", label: "Experience" },
  { href: "/boxes", label: "Boxes" },
  { href: "/community", label: "Community" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/about", label: "About" },
];

const supportLinks = [
  { href: "/help", label: "Help centre" },
  { href: "/help#track", label: "Track order" },
  { href: "https://wa.me/447700900000", label: "Chat on WhatsApp", external: true },
];

export function SiteHeader() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [flowModalOpen, setFlowModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (response.ok) {
          const { profile } = await response.json();
          setProfile(profile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadProfile();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadProfile();
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-white shadow-md">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10 xl:px-16">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="BunnyAtHome"
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-ink md:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-brand-curry"
            >
              {link.label}
            </Link>
          ))}
          <div 
            className="relative"
            onMouseEnter={() => setHelpOpen(true)}
            onMouseLeave={() => setHelpOpen(false)}
          >
            <button
              type="button"
              className="transition-colors hover:text-brand-curry"
            >
              Help & Track
            </button>
            {helpOpen && (
              <div className="absolute right-0 top-full pt-2 w-56">
                <div className="rounded-xl border-2 border-black bg-white p-2 shadow-xl">
                  {supportLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-ink transition-all hover:bg-brand-curry/10 hover:text-brand-curry"
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      <span>{item.label}</span>
                      {item.label === "Chat on WhatsApp" && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-[10px] font-bold text-white">
                          WA
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center rounded-full border-2 border-black bg-white p-2 transition-all hover:bg-gray-50"
          >
            <ShoppingCart className="h-5 w-5 text-ink" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-brand-curry text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href="https://wa.me/447700900000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm transition-all hover:bg-green-50 sm:flex"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-[10px] text-white">
              WA
            </span>
            <span>Chat</span>
          </Link>
          {user ? (
            <div 
              className="relative hidden md:block"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-gray-50"
              >
                {profile?.avatar_url ? (
                  <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-black bg-gray-100">
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || "Profile avatar"}
                      fill
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                    <User className="h-4 w-4" />
                  </span>
                )}
                <span>{profile?.full_name || user.email?.split("@")[0] || "Account"}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full pt-2 w-56">
                  <div className="rounded-xl border-2 border-black bg-white p-2 shadow-xl">
                    <Link
                      href="/account"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-ink transition-all hover:bg-brand-curry/10"
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-ink transition-all hover:bg-brand-curry/10"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/account/boxes"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-ink transition-all hover:bg-brand-curry/10"
                    >
                      My Boxes
                    </Link>
                    <Link
                      href="/account/rewards"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-ink transition-all hover:bg-brand-curry/10"
                    >
                      Rewards {profile?.points_balance > 0 && `(${profile.points_balance})`}
                    </Link>
                    <div className="my-1 h-px bg-gray-200" />
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-gray-50 md:inline-flex"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/menu"
            className="rounded-full border-2 border-black bg-brand-curry px-4 py-2 text-sm font-bold text-brand-black shadow-sm transition-colors hover:bg-brand-curry/90"
          >
            View menu
          </Link>
          <button
            onClick={() => setFlowModalOpen(true)}
            className="rounded-full border-2 border-black bg-brand-coral px-6 py-2 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            Build your box
          </button>
        </div>
      </div>

      {/* Flow Selection Modal */}
      <FlowModal isOpen={flowModalOpen} onClose={() => setFlowModalOpen(false)} />
    </header>
  );
}

