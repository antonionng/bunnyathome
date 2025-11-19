"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationBell } from "./notification-bell";

interface AdminHeaderProps {
  adminName?: string;
  adminEmail?: string;
}

export function AdminHeader({ adminName, adminEmail }: AdminHeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    // Sign out logic will be implemented with Supabase
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <input
            type="search"
            placeholder="Search products, orders, customers..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <NotificationBell />

          {/* Quick Actions */}
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            onClick={() => router.push("/admin/products/new")}
          >
            + New Product
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-medium">
                {adminName ? adminName[0].toUpperCase() : "A"}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-gray-900">
                  {adminName || "Admin"}
                </div>
                <div className="text-xs text-gray-500">
                  {adminEmail || "admin@bunnyathome.com"}
                </div>
              </div>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => router.push("/account/settings")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  View Store
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

