"use client";

import Image from "next/image";

interface ImageWithOverlayProps {
  src: string;
  overlayText: string;
  alt: string;
  className?: string;
}

export function ImageWithOverlay({
  src,
  overlayText,
  alt,
  className = "",
}: ImageWithOverlayProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border-3 border-black shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${className}`}
    >
      <div className="relative h-64 w-full overflow-hidden lg:h-80">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 450px, 100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/40" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="rounded-xl border-3 border-black bg-brand-curry px-5 py-4 shadow-lg">
          <p className="text-lg font-bold leading-tight text-brand-black lg:text-xl">
            {overlayText}
          </p>
        </div>
      </div>
    </div>
  );
}

