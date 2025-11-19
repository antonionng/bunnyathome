"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  PackageIcon,
  StarIcon,
  MapPinIcon,
  RefreshIcon,
  GiftIcon,
  SettingsIcon,
} from "@/components/icons/account-icons";

const navigation = [
  { name: "My Spot", href: "/account", icon: HomeIcon },
  { name: "Orders", href: "/account/orders", icon: PackageIcon },
  { name: "My Boxes", href: "/account/boxes", icon: StarIcon },
  { name: "Addresses", href: "/account/addresses", icon: MapPinIcon },
  { name: "Subscription", href: "/account/subscription", icon: RefreshIcon },
  { name: "Rewards", href: "/account/rewards", icon: GiftIcon },
  { name: "Settings", href: "/account/settings", icon: SettingsIcon },
];

function getPageTitle(pathname: string): string {
  const page = navigation.find((item) => item.href === pathname);
  return page?.name || "Account";
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen">
      {/* Mobile Header & Menu Toggle */}
      <div className="sticky top-16 z-30 mb-6 flex items-center justify-between border-b-2 border-black bg-white p-4 lg:hidden">
        <div className="flex items-center gap-2">
          <ChevronRight className="h-5 w-5 text-brand-curry" />
          <h2 className="text-lg font-bold text-ink">{pageTitle}</h2>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-white transition-colors hover:bg-gray-50"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r-2 border-black bg-white shadow-2xl lg:hidden"
            >
              <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-ink">Your Account</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
                          isActive
                            ? "bg-brand-curry text-brand-black"
                            : "text-ink hover:bg-gray-100"
                        )}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar */}
        <nav className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border-2 border-black bg-white p-5 shadow-lg transition-all duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-ink">Your Account</h2>
              <p className="mt-1 text-sm text-ink-muted">Manage everything here</p>
            </div>
            <div className="space-y-1.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200",
                      isActive
                        ? "bg-brand-curry text-brand-black shadow-md"
                        : "text-ink hover:-translate-x-1 hover:bg-gray-50"
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        !isActive && "group-hover:scale-110"
                      )}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto h-2 w-2 rounded-full bg-brand-black"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-w-0 px-4 lg:px-0">{children}</main>
      </div>
    </div>
  );
}

