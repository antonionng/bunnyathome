"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Remove 'admin' from start
  const breadcrumbSegments = segments.slice(1);

  if (breadcrumbSegments.length === 0) {
    return null;
  }

  const formatSegment = (segment: string): string => {
    // Convert kebab-case to Title Case
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <Link href="/admin" className="hover:text-orange-600 transition-colors">
        Dashboard
      </Link>

      {breadcrumbSegments.map((segment, index) => {
        const isLast = index === breadcrumbSegments.length - 1;
        const href = `/admin/${breadcrumbSegments.slice(0, index + 1).join("/")}`;

        return (
          <div key={segment} className="flex items-center gap-2">
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
                d="M9 5l7 7-7 7"
              />
            </svg>

            {isLast ? (
              <span className="text-gray-900 font-medium">{formatSegment(segment)}</span>
            ) : (
              <Link href={href} className="hover:text-orange-600 transition-colors">
                {formatSegment(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

