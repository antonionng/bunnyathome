import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  const redirectTo = searchParams.redirectTo || "/account";

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-ink">Get yourself sorted, bru</h1>
        <p className="mt-2 text-ink-muted">
          Sign up and start stacking those lekker bunny chow boxes
        </p>
      </div>

      <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
        <SignupForm redirectTo={redirectTo} />

        <div className="mt-6 text-center">
          <p className="text-sm text-ink-muted">
            Already got an account?{" "}
            <Link
              href={`/auth/login${redirectTo !== "/account" ? `?redirectTo=${redirectTo}` : ""}`}
              className="font-bold text-brand-coral hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>

        <div className="mt-8 rounded-lg border-2 border-black bg-brand-curry/10 p-4 text-xs text-ink-muted">
          <p className="font-bold text-ink">What you get when you sign up:</p>
          <ul className="mt-2 space-y-1">
            <li>• Stash your lekker box combos for next time</li>
            <li>• Reorder in two clicks, sharp sharp</li>
            <li>• Keep tabs on where your boxes are</li>
            <li>• Stack loyalty points like a legend</li>
            <li>• Sort your subscription, easy peasy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


