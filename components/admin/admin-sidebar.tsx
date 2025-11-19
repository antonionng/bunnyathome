"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/types/admin";
import { getAdminPermissions } from "@/types/admin";

interface AdminSidebarProps {
  adminRole?: AdminRole;
}

export function AdminSidebar({ adminRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const permissions = getAdminPermissions(adminRole);

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: "📊",
      show: true,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: "🍛",
      show: permissions.canManageProducts,
    },
    {
      title: "Inventory",
      href: "/admin/inventory",
      icon: "📦",
      show: permissions.canManageInventory,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: "🛍️",
      show: permissions.canManageOrders,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: "👥",
      show: permissions.canManageCustomers,
    },
    {
      title: "Ready Boxes",
      href: "/admin/boxes",
      icon: "📦",
      show: permissions.canUseAIFeatures,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: "🔔",
      show: true,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: "📈",
      show: permissions.canViewAnalytics,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="text-2xl">🐰</div>
          <div>
            <div className="font-bold text-lg">Bunny Admin</div>
            <div className="text-xs text-gray-500">At Home</div>
          </div>
        </Link>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (!item.show) return null;

            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 mt-auto">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">🏠</span>
          <span>Back to Store</span>
        </Link>
      </div>

      {adminRole && (
        <div className="px-4 pb-4">
          <div className="px-4 py-2 rounded-lg bg-gray-50 text-xs">
            <div className="text-gray-500">Role</div>
            <div className="font-medium text-gray-900 capitalize">
              {adminRole.replace("_", " ")}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

