import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { MagicLinkForm } from "@/components/auth/magic-link-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; tab?: string };
}) {
  const redirectTo = searchParams.redirectTo || "/account";
  const activeTab = searchParams.tab || "password";

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-ink">Howzit, welcome back!</h1>
        <p className="mt-2 text-ink-muted">
          Log in and let's get that bunny chow sorted
        </p>
      </div>

      <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
        {/* Tab Switcher */}
        <div className="mb-6 flex gap-2 rounded-lg border-2 border-black bg-gray-50 p-1">
          <Link
            href={`/auth/login?tab=password${redirectTo !== "/account" ? `&redirectTo=${redirectTo}` : ""}`}
            className={`flex-1 rounded-md py-2 text-center text-sm font-bold transition-colors ${
              activeTab === "password"
                ? "bg-white text-ink shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Password
          </Link>
          <Link
            href={`/auth/login?tab=magic${redirectTo !== "/account" ? `&redirectTo=${redirectTo}` : ""}`}
            className={`flex-1 rounded-md py-2 text-center text-sm font-bold transition-colors ${
              activeTab === "magic"
                ? "bg-white text-ink shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Magic Link
          </Link>
        </div>

        {activeTab === "password" ? (
          <LoginForm redirectTo={redirectTo} />
        ) : (
          <MagicLinkForm redirectTo={redirectTo} />
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-ink-muted">
            New here, bru?{" "}
            <Link
              href={`/auth/signup${redirectTo !== "/account" ? `?redirectTo=${redirectTo}` : ""}`}
              className="font-bold text-brand-coral hover:underline"
            >
              Get yourself sorted
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


