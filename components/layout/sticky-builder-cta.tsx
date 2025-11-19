"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StickyBuilderCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerWidth < 768 ? 260 : 420;
      setVisible(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40">
      <div className="pointer-events-auto rounded-full border-2 border-black bg-brand-black/95 px-4 py-3 shadow-card backdrop-blur-sm">
        <div className="flex flex-col items-start gap-3 text-xs text-white md:flex-row md:items-center md:text-sm">
          <span className="font-semibold uppercase tracking-[0.25em] text-brand-curry">
            Next braai run closes soon
          </span>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="bg-brand-curry px-4 py-2 text-xs md:text-sm" asChild>
              <Link href="/builder?flow=bunny">Start with a bunny</Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="border-white bg-white/5 px-4 py-2 text-xs text-white hover:bg-white/10 md:text-sm"
              asChild
            >
              <Link href="/builder?flow=curry">Start with a curry</Link>
            </Button>
            <Button
              size="sm"
              className="border-2 border-black bg-brand-curry px-4 py-2 text-xs text-brand-black hover:bg-brand-curry/90 md:text-sm"
              asChild
            >
              <Link href="/menu">View menu</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


