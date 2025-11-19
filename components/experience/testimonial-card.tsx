"use client";

import Image from "next/image";

interface TestimonialCardProps {
  image: string;
  quote: string;
  author: string;
  location: string;
}

export function TestimonialCard({ image, quote, author, location }: TestimonialCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border-3 border-black bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={image}
          alt={author}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 380px, 100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative -mt-12 space-y-4 p-6">
        <div className="relative rounded-xl border-3 border-black bg-white p-6 shadow-lg">
          <div className="absolute -left-2 -top-2 h-6 w-6 rotate-45 border-l-3 border-t-3 border-black bg-white" />
          <p className="text-lg font-semibold italic leading-relaxed text-ink">
            "{quote}"
          </p>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="flex-1">
            <p className="font-bold text-brand-black">{author}</p>
            <p className="text-sm font-semibold text-ink-muted">{location}</p>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-brand-curry text-lg">
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

