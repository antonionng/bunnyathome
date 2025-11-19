"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FlowModalTrigger } from "@/components/ui/flow-modal-trigger";
import { CountdownTimer } from "@/components/experience/countdown-timer";
import { DynamicStat } from "@/components/experience/dynamic-stat";
import { StatCard } from "@/components/experience/stat-card";
import { SubscriptionTierCard } from "@/components/experience/subscription-tier-card";
import { TestimonialCard } from "@/components/experience/testimonial-card";
import { ImageWithOverlay } from "@/components/experience/image-with-overlay";

const stats = [
  {
    value: 4200,
    variance: 150,
    suffix: "+",
    label: "bunnies stacked",
    subtext: "And counting, sharp sharp",
    icon: "🍛",
  },
  {
    value: 94,
    variance: 2,
    suffix: "%",
    label: "reorder rate",
    subtext: "Once you taste, hooked",
    icon: "🔄",
  },
  {
    value: 17,
    variance: 3,
    suffix: " min",
    label: "cook time",
    subtext: "Faster than takeaway",
    icon: "⚡",
  },
];

const testimonials = [
  {
    quote: "Eish, it's like my ouma's kitchen landed in Leeds.",
    author: "Sipho",
    location: "Durban expat",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80",
  },
  {
    quote: "The masala is Grey Street accurate. My mates finally get it.",
    author: "Nomfundo",
    location: "Manchester",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  },
  {
    quote: "Friday bunny beats takeaway every time. Crew is hooked.",
    author: "James",
    location: "London",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    quote: "My kids ask for it weekly. It's our new ritual.",
    author: "Sarah",
    location: "Bristol",
    image: "https://images.unsplash.com/photo-1544723795-432537d12f6c?auto=format&fit=crop&w=600&q=80",
  },
];

const subscriptionTiers = [
  {
    name: "Regular",
    price: "£45",
    perks: ["Feeds 2-3", "Swap free", "Pause anytime"],
    bgColor: "bg-brand-coral",
    accentColor: "bg-brand-coral",
    isPopular: false,
  },
  {
    name: "Family",
    price: "£55",
    perks: ["Feeds 4-5", "Priority slots", "Free fritters"],
    bgColor: "bg-brand-curry",
    accentColor: "bg-brand-curry",
    isPopular: true,
  },
  {
    name: "Legends",
    price: "£79",
    perks: ["Double drop", "Chef specials", "Boerewors"],
    bgColor: "bg-brand-green",
    accentColor: "bg-brand-green",
    isPopular: false,
  },
];

export default function ExperiencePage() {
  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero - aligned with homepage patterns */}
      <section className="relative overflow-hidden rounded-2xl border-3 border-black bg-white p-8 shadow-lg section-border-curry md:p-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_0.9fr)] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-curry px-5 py-2 text-xs font-bold uppercase tracking-[0.35em] text-brand-black shadow-sm">
              Weeknight bunny ritual
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.03] tracking-tight text-ink sm:text-5xl lg:text-[52px] xl:text-[60px]">
              Orders lock Tuesday. The laaities eat Friday.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl">
              Slow-simmered gravies, soft loaves, QR prep films, and amapiano playlists turn your kitchen into Grey
              Street in under 20 minutes.
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink-muted">
              <DynamicStat baseValue={347} variance={25} /> families loading boxes this week
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <FlowModalTrigger className="border-3 border-black bg-brand-black px-9 py-6 text-base font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                  🔥 Build your box
                </FlowModalTrigger>
                <Button
                  size="lg"
                  className="border-3 border-black bg-brand-curry px-9 py-6 text-base font-bold text-brand-black shadow-xl transition hover:-translate-y-1 hover:bg-brand-curry/90"
                  asChild
                >
                  <Link href="/menu">View menu</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-ink-muted">
                <span>⭐ Trustpilot 4.5/5</span>
                <span className="h-1 w-1 rounded-full bg-ink" />
                <span>🚚 Free delivery £50+</span>
                <span className="h-1 w-1 rounded-full bg-ink" />
                <span>
                  <DynamicStat baseValue={47} variance={15} /> slots left
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ImageWithOverlay
              src="/curries/chicken-durban-placeholder.svg"
              alt="BunnyAtHome Durban bunny chow experience"
              overlayText="QR prep films, masala boosters, and Durban loaves in every box."
            />
            <div className="rounded-2xl border-3 border-black bg-brand-curry p-5 shadow-xl">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-black">
                Orders lock Tuesday 23:59
              </div>
              <CountdownTimer variant="small" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats - using shared stat cards */}
      <section className="rounded-2xl border-3 border-black bg-white p-8 shadow-lg section-border-pink md:p-10">
        <div className="mb-8 space-y-3 text-center">
          <span className="tag-pill mx-auto bg-brand-pink text-brand-black">Proof in the pot</span>
          <h2 className="text-3xl font-bold text-ink md:text-4xl">Friday bunny nights, by the numbers.</h2>
          <p className="text-sm text-ink-muted">
            Durban expats and UK food nerds keep the bunny ritual rolling week after week.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              stat={`${stat.value.toLocaleString()}${stat.suffix}`}
              label={stat.label}
              description={stat.subtext}
              icon={stat.icon}
              bgColor="bg-brand-curry"
            />
          ))}
        </div>
      </section>

      {/* Featured Drop - hero offer card */}
      <section className="rounded-3xl border-3 border-black bg-brand-green p-8 shadow-xl section-border-coral md:p-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,_1.15fr)_minmax(0,_0.85fr)] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full bg-brand-coral px-5 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-brand-black shadow-sm">
              Limited offer
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black leading-tight text-brand-black md:text-4xl lg:text-[40px]">
                Lock this feast before Tuesday, save £8
              </h2>

              <div className="flex items-baseline gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black/60 line-through">
                  Was £51
                </span>
                <span className="text-5xl font-black text-brand-black">£43</span>
              </div>
            </div>

            <ul className="space-y-1.5 text-sm font-semibold text-brand-black">
              <li>✓ Lamb curry (feeds 3)</li>
              <li>✓ Soft bunny loaf</li>
              <li>✓ 12 samoosas</li>
              <li>✓ Mrs Balls chutney</li>
            </ul>

            <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-black/70">
              Only <DynamicStat baseValue={23} variance={8} /> boxes left
            </p>

            <Button
              size="lg"
              className="mt-4 w-full rounded-full border-3 border-black bg-brand-black py-4 text-sm font-black uppercase tracking-[0.25em] text-white shadow-lg hover:-translate-y-0.5 hover:bg-brand-black/90"
              asChild
            >
              <Link href="/menu">Claim this drop</Link>
            </Button>
          </div>

          <div className="relative h-64 overflow-hidden rounded-3xl border-3 border-black bg-white lg:h-96">
            <Image
              src="/drops/drop-traditional-bunny.png"
              alt="Featured drop"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 520px, 100vw"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* The Experience - 4 Steps Compact */}
      <section className="rounded-2xl border-3 border-black bg-white p-6 shadow-lg section-border-blue md:p-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-black text-ink md:text-4xl">
            From order to plate in 20 minutes
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "Order Tuesday", icon: "📱", text: "Lock your box online" },
            { step: "We prep Thursday", icon: "👨‍🍳", text: "Like it's for our ma" },
            { step: "Lands Friday", icon: "📦", text: "Fresh at your door" },
            { step: "Plate in 20 min", icon: "🍽️", text: "Blow minds" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border-2 border-black bg-brand-pink p-4 text-center transition hover:-translate-y-1"
            >
              <div className="mb-2 text-3xl">{item.icon}</div>
              <div className="text-sm font-black uppercase tracking-wide text-brand-black">
                {item.step}
              </div>
              <div className="mt-1 text-xs text-brand-black/70">{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials - shared testimonial cards */}
      <section className="rounded-2xl border-3 border-black bg-white p-8 shadow-lg section-border-green md:p-10">
        <div className="mb-8 space-y-3 text-center">
          <span className="tag-pill mx-auto bg-brand-blue text-brand-black">Community</span>
          <h2 className="text-3xl font-bold text-ink md:text-4xl">What the crew says</h2>
          <p className="text-sm text-ink-muted">
            Stories from Durban expats and UK food nerds who turned Friday into bunny night.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.author}
              image={testimonial.image}
              quote={testimonial.quote}
              author={testimonial.author}
              location={testimonial.location}
            />
          ))}
        </div>
      </section>

      {/* Subscriptions - using shared subscription cards */}
      <section className="rounded-2xl border-3 border-black bg-white p-8 shadow-lg section-border-curry md:p-10">
        <div className="mb-8 space-y-3 text-center">
          <span className="tag-pill mx-auto bg-brand-curry text-brand-black">Subscriptions</span>
          <h2 className="text-3xl font-bold text-ink md:text-4xl">Subscribe and save</h2>
          <p className="mx-auto mt-1 max-w-2xl text-sm text-ink-muted">
            Skip December. Swap curries. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {subscriptionTiers.map((tier) => (
            <SubscriptionTierCard
              key={tier.name}
              name={tier.name}
              price={tier.price}
              perks={tier.perks}
              isPopular={tier.isPopular}
              bgColor={tier.bgColor}
              accentColor={tier.accentColor}
            />
          ))}
        </div>
      </section>

      {/* Final CTA - Clean & Bold */}
      <section className="rounded-2xl border-3 border-black bg-brand-black p-8 shadow-lg section-border-curry md:p-12">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h2 className="text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl">
            Orders lock Tuesday 23:59
          </h2>
          
          <p className="text-lg font-semibold text-white/80">
            Miss it and wait another week, boet
          </p>

          <div className="mx-auto max-w-md">
            <CountdownTimer variant="small" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <FlowModalTrigger className="border-3 border-white bg-brand-curry px-8 py-4 text-base font-bold uppercase text-brand-black shadow-lg transition hover:-translate-y-1">
              Build my box now
            </FlowModalTrigger>
            <Button
              size="lg"
              className="border-3 border-white bg-brand-coral px-8 py-4 font-bold uppercase text-white"
              asChild
            >
              <Link href="/menu">Grab a drop</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-wider text-white/80">
            <span>✓ Cancel anytime</span>
            <span>✓ Swap free</span>
            <span>✓ Skip deliveries</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border-2 border-brand-coral bg-brand-coral px-4 py-2 text-sm font-black uppercase text-brand-black">
            🔥 <DynamicStat baseValue={47} variance={15} /> slots left
          </div>
        </div>
      </section>
    </div>
  );
}
