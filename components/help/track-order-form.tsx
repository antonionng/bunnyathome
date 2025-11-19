"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TrackOrderForm() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) {
      return;
    }

    router.push(`/track/${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <Input
        value={orderId}
        onChange={(event) => setOrderId(event.target.value)}
        placeholder="Enter order ID"
        className="h-12 border-2 border-black text-base"
        aria-label="Order ID"
      />
      <Button
        type="submit"
        className="h-12 flex-1 border-2 border-black bg-brand-coral text-brand-black shadow-md transition hover:scale-[1.01] hover:bg-brand-coral/90 sm:flex-none sm:px-10"
        disabled={!orderId.trim()}
      >
        Track order
      </Button>
    </form>
  );
}


