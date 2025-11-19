"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <WifiOff className="mb-6 h-24 w-24 text-ink-muted" />
      <h1 className="mb-4 text-4xl font-bold text-ink">Eish, no connection bru!</h1>
      <p className="mb-8 max-w-md text-lg text-ink-muted">
        Looks like you're offline. Don't stress though - check your connection and give it another bash.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => window.location.reload()}
          size="lg"
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
        >
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}

