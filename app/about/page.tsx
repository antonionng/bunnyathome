import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const founderStory = {
  name: "Sipho Naidoo",
  title: "Founder & former Nando's area manager",
  origin: "Durban-born · Now feeding the UK",
  story:
    "Sipho spent a decade opening Nando's sites across Joburg and London before realising the dishes he missed most — bunny chow, carrot sambals, and masala-drenched chips — were still impossible to find. So he started simmering family recipes after service, hand-carrying spice packs back from Durban, and building BunnyAtHome for friends who craved the same warmth.",
  highlights: [
    "Led 12 Nando's kitchens and trained 300+ grillers across SA & UK.",
    "Partners with Grey Street spice merchants for every masala batch.",
    "Hosts monthly \"Durban Table\" supper clubs in Brixton.",
  ],
  quote:
    `"The first time I served bunny chow at a London supper club, the room went silent — the bread tore, the steam hit, and everyone finally tasted home."`,
  image:
    "https://images.unsplash.com/photo-1541535881962-3bb380b08458?auto=format&fit=crop&w=1200&q=80",
};

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 rounded-2xl border-3 border-black bg-gradient-to-br from-brand-blue/20 via-white to-brand-pink/20 p-10 shadow-xl section-border-blue lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden rounded-2xl border-3 border-black bg-brand-coral/20 shadow-xl">
          <Image
            src={founderStory.image}
            alt={`${founderStory.name} founder portrait`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 420px, 100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-3 text-white">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-white px-4 py-1 text-xs font-bold uppercase tracking-[0.3em]">
              {founderStory.origin}
            </span>
            <p className="text-sm opacity-90">{founderStory.title}</p>
            <p className="text-2xl font-semibold leading-tight">{founderStory.name}</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="tag-pill w-fit bg-brand-pink text-brand-black">About</span>
            <h1 className="text-3xl font-bold text-ink">A Durban manager who missed feeding the block.</h1>
            <p className="text-base leading-relaxed text-ink-muted">{founderStory.story}</p>
          </div>
          <ul className="grid gap-3 rounded-2xl border-2 border-black bg-white/70 p-5 text-sm text-ink shadow-inner md:grid-cols-2">
            {founderStory.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-black bg-brand-curry text-[10px] font-black text-brand-black">
                  ●
                </span>
                <span className="leading-snug">{highlight}</span>
              </li>
            ))}
          </ul>
          <blockquote className="rounded-2xl border-3 border-black bg-white px-6 py-5 text-base font-medium leading-relaxed text-ink shadow-md">
            {founderStory.quote}
          </blockquote>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border-3 border-black bg-[#FDBB30] px-12 py-14 shadow-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-coral/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-green/30 blur-3xl" />
        
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-3 shadow-md">
              <span className="text-2xl">🏠</span>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-black">Our Story</span>
            </div>
            <h2 className="text-4xl font-bold text-brand-black lg:text-[42px]">
              From Durban&apos;s heart to your kitchen.
            </h2>
            <p className="text-lg leading-relaxed text-brand-black/80">
              Every box carries the warmth of Grey Street, the precision of years in professional kitchens, and the soul of family recipes.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button size="lg" className="border-2 border-black bg-brand-coral px-8 py-6 text-base font-bold text-brand-black shadow-md transition-all hover:scale-[1.02] hover:bg-brand-coral/90" asChild>
              <Link href="/builder">Try it yourself</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-black bg-white px-8 py-6 text-base font-bold text-brand-black shadow-md transition-all hover:scale-[1.02]" asChild>
              <Link href="/community">Join the community</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

