import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/experience/countdown-timer";
import { DynamicStat } from "@/components/experience/dynamic-stat";

const boxHighlights = [
  {
    name: "Grey Street Essentials",
    description:
      "Lamb bunny filling, soft loaf, sambals, and masala boosters for the midweek ritual.",
    perks: ["Feeds 2-3", "20-min reheat", "Grey Street masala blend"],
    image: "/drops/drop-durban-classic.png",
    accentClass: "bg-brand-coral",
    price: "£37",
    restaurantPrice: "£60+",
    slotsLeft: 23,
    customerQuote: "It's my Friday ritual now - Thabo, Manchester",
    special: "Masala blend from Grey Street spice merchants",
    soldOut: false,
  },
  {
    name: "Veggie Neighbourhood Drop",
    description:
      "Bean bunny, family curry, and vetkoek sliders for the crew that loves sharing plates.",
    perks: ["Vegan friendly", "Serves 2-3", "Tested by SA aunties"],
    image: "/drops/drop-vegetarian-delight.png",
    accentClass: "bg-brand-green",
    price: "£43",
    restaurantPrice: "£65+",
    slotsLeft: 31,
    customerQuote: "My mates fight over seconds - Priya, Bristol",
    special: "Bean curry recipe tested by 4 SA aunties",
    soldOut: false,
  },
  {
    name: "Braai Night Feast",
    description:
      "Short rib curry, boerie, biltong, and pumpkin fritters for a proper Sunday spread.",
    perks: ["Feeds 4-5", "6-hour slow-braised short rib", "Braai classics included"],
    image: "/drops/drop-meat-lover-feast.png",
    accentClass: "bg-brand-blue",
    price: "£58",
    restaurantPrice: "£95+",
    slotsLeft: 17,
    customerQuote: "My in-laws thought I hired a caterer - Marcus, London",
    special: "Chef-perfected slow-braise technique",
    soldOut: false,
  },
];

const highlightTreats = [
  {
    title: "Pumpkin fritters two ways",
    description: "Choose ready-to-eat dessert or the fry-at-home kit for brunch theatre.",
    pill: "Sweet finish",
    image: "/treats/pumpkin-fritters.png",
  },
  {
    title: "Loaf & vetkoek essentials",
    description: "Unsliced bunny loaf, gluten-free bake, or vetkoek sliders - pick your favourite carb base.",
    pill: "Bread bar",
    image: "/treats/bread-options.png",
  },
  {
    title: "Braai-ready extras",
    description: "Samoosas, boerewors coils, honey-mustard rashers, and spiced corn ribs for sharing.",
    pill: "Feast mode",
    image: "/treats/braai-extras.png",
  },
];

export default function BoxesPage() {
  return (
    <div className="space-y-16">
      <section className="space-y-8 rounded-2xl border-3 border-black bg-gradient-to-br from-brand-coral/30 via-brand-curry/20 to-white p-10 shadow-xl section-border-coral">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tag-pill bg-brand-coral text-brand-black">This Week&apos;s Drop</span>
            <span className="rounded-full border-2 border-black bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-brand-black shadow-md">
              🔥 Limited Batch
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight text-brand-black lg:text-5xl">
            This Week&apos;s Bunny Drop: Locks Tuesday Midnight
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-brand-black/80">
            Sharp sharp, these boxes move fast. Lock yours now or you&apos;re waiting another week, boet. Every box lands with mise en place fillings, QR prep films, and Grey Street masalas ready to blow minds.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border-2 border-black bg-brand-black px-5 py-2.5 shadow-md">
              <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-brand-coral" />
              <span className="text-sm font-bold text-white">
                Only <DynamicStat baseValue={47} variance={15} /> boxes left this week
              </span>
            </div>
            <div className="text-sm font-semibold text-brand-black/70">
              <span className="text-brand-coral">●</span> Themba in Leeds just locked his · 2 min ago
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-xl">
          <div className="mb-4 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-black">
              Orders lock in
            </p>
          </div>
          <CountdownTimer variant="small" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {boxHighlights.map((box) => (
            <div
              key={box.name}
              className="group flex flex-col overflow-hidden rounded-xl border-3 border-black bg-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                <Image
                  src={box.image}
                  alt={box.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  unoptimized
                  sizes="(min-width: 1024px) 320px, 100vw"
                />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span
                    className={`rounded-full border-2 border-black px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-brand-black shadow-md ${box.accentClass}`}
                  >
                    {box.price}
                  </span>
                  {box.soldOut ? (
                    <span className="rounded-full border-2 border-black bg-red-500 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-white shadow-md">
                      Sold Out
                    </span>
                  ) : (
                    <span className="rounded-full border-2 border-black bg-brand-black px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-white shadow-md">
                      Only {box.slotsLeft} left
                </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-lg border-2 border-black bg-white/95 px-3 py-2 text-xs italic text-brand-black backdrop-blur-sm">
                  &ldquo;{box.customerQuote}&rdquo;
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-5 p-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-brand-black leading-tight">{box.name}</h3>
                  <p className="text-sm leading-relaxed text-brand-black/70">{box.description}</p>
                </div>
                
                <div className="rounded-lg border-2 border-black bg-brand-curry/10 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-brand-black/70">Restaurant price:</span>
                    <span className="font-bold text-brand-black/50 line-through">{box.restaurantPrice}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-black/70">Your price:</span>
                    <span className="text-2xl font-black text-brand-coral">{box.price}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-brand-black/5 px-3 py-2 text-xs font-semibold text-brand-black/80">
                  ✨ {box.special}
                </div>
                
                <ul className="space-y-3 text-sm text-brand-black/80">
                  {box.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-black bg-white text-xs font-black">
                        ✓
                      </span>
                      <span className="leading-tight">{perk}</span>
                    </li>
                  ))}
                </ul>
                
                {box.soldOut ? (
                  <button
                    disabled
                    className="mt-auto inline-flex items-center justify-center rounded-lg border-2 border-black bg-gray-200 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-500 opacity-50"
                  >
                    Sold Out - Join Waitlist
                  </button>
                ) : (
                <Link
                  href="/builder"
                    className="mt-auto inline-flex items-center justify-between rounded-lg border-2 border-black bg-brand-coral px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-black shadow-md transition hover:scale-[1.02] hover:bg-brand-coral/90"
                >
                    🔥 Lock This Drop
                  <span aria-hidden>→</span>
                </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 rounded-2xl border-3 border-black bg-gradient-to-br from-brand-curry/30 via-white to-brand-pink/20 p-10 shadow-xl section-border-curry">
        <div className="flex flex-col gap-4 text-center">
          <span className="tag-pill mx-auto bg-brand-curry text-brand-black">Why We Sell Out</span>
          <h2 className="text-3xl font-bold text-brand-black lg:text-4xl">
            Not just curry - it&apos;s the full Grey Street experience at your door
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-brand-black/70">
            These aren&apos;t regular meal kits. Every box is a chef-curated drop that brings SA street food, spice markets, and family kitchens straight to your table.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="group flex flex-col gap-4 rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-brand-coral text-2xl shadow-md">
              🔥
            </div>
            <h3 className="text-xl font-bold text-brand-black">Limited Weekly Drops</h3>
            <p className="text-sm leading-relaxed text-brand-black/70">
              We only make 150 boxes per week in small batches. When they&apos;re gone, they&apos;re gone. No exceptions.
            </p>
          </div>

          <div className="group flex flex-col gap-4 rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-brand-green text-2xl shadow-md">
              ✨
            </div>
            <h3 className="text-xl font-bold text-brand-black">Impossible To Replicate</h3>
            <p className="text-sm leading-relaxed text-brand-black/70">
              Grey Street masala blends you can&apos;t find in UK shops + chef technique from ex-Nando&apos;s head chef who knows how to feed the masses.
            </p>
          </div>

          <div className="group flex flex-col gap-4 rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-brand-blue text-2xl shadow-md">
              🎬
            </div>
            <h3 className="text-xl font-bold text-brand-black">The Full Experience</h3>
            <p className="text-sm leading-relaxed text-brand-black/70">
              QR prep films, amapiano playlists, spice boosters, chef notes - it&apos;s dinner theatre, not just dinner.
            </p>
          </div>

          <div className="group flex flex-col gap-4 rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-brand-pink text-2xl shadow-md">
              💰
            </div>
            <h3 className="text-xl font-bold text-brand-black">Better Value</h3>
            <p className="text-sm leading-relaxed text-brand-black/70">
              Restaurant bunny chow for 3: £60+. Our box: £37 and you&apos;re the hero who plated it in 20 minutes.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8 rounded-2xl border-3 border-black bg-gradient-to-br from-brand-blue/25 via-white to-brand-green/20 p-10 shadow-xl section-border-blue">
        <div className="flex flex-col gap-4">
          <span className="tag-pill w-fit bg-brand-blue text-brand-black">What&apos;s Inside</span>
          <h2 className="text-3xl font-bold text-brand-black lg:text-4xl">
            Every Box Lands With...
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-brand-black/70">
            This isn&apos;t just ingredients in a box. It&apos;s the full SA bunny chow experience - from spice market to your kitchen table.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-1">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black bg-brand-curry text-3xl shadow-md">
              🌶️
            </div>
            <h3 className="mb-2 text-xl font-bold text-brand-black">Pre-Portioned Masala Packs</h3>
            <p className="text-sm leading-relaxed text-brand-black/70">
              Blended weekly by our Grey Street spice merchant - the exact heat and aromatics you&apos;d get on Victoria Street.
            </p>
          </div>

          <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-1">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black bg-brand-pink text-3xl shadow-md">
              🎬
            </div>
            <h3 className="mb-2 text-xl font-bold text-brand-black">QR-Linked Prep Film</h3>
            <p className="text-sm leading-relaxed text-brand-black/70">
              Watch Chef Greg show you the 20-min technique. No guessing, no stress - just follow along and plate like a pro.
            </p>
          </div>

          <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-1">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black bg-brand-green text-3xl shadow-md">
              🎵
            </div>
            <h3 className="mb-2 text-xl font-bold text-brand-black">Amapiano Playlist</h3>
            <p className="text-sm leading-relaxed text-brand-black/70">
              Soundtrack your cooking like you&apos;re on Florida Road. Every box comes with a curated playlist to set the vibe.
            </p>
          </div>

          <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-1">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black bg-brand-coral text-3xl shadow-md">
              ✍️
            </div>
            <h3 className="mb-2 text-xl font-bold text-brand-black">Chef&apos;s Notes</h3>
            <p className="text-sm leading-relaxed text-brand-black/70">
              Hand-written tips from the kitchen. Little tricks to make your bunny chow even better than the last one.
            </p>
          </div>

          <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-1">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black bg-[#FDBB30] text-3xl shadow-md">
              🥖
            </div>
            <h3 className="mb-2 text-xl font-bold text-brand-black">Fresh-Baked Loaves</h3>
            <p className="text-sm leading-relaxed text-brand-black/70">
              Soft white bunny loaves, vetkoek, or gluten-free options - pick your carb base and we&apos;ll bake it fresh.
            </p>
          </div>

          <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-1">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black bg-brand-blue text-3xl shadow-md">
              🎁
            </div>
            <h3 className="mb-2 text-xl font-bold text-brand-black">Members-Only Surprises</h3>
            <p className="text-sm leading-relaxed text-brand-black/70">
              Spice Locker members get surprise treats each month. This month: extra pumpkin fritters for early birds.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-black bg-brand-curry/20 p-6 text-center">
          <p className="text-sm font-bold text-brand-black">
            💡 <span className="font-normal">Plus braai extras, sambals, chutneys, and everything you need to feed the laaities in style.</span>
          </p>
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border-3 border-black bg-gradient-to-br from-brand-pink/30 via-white to-brand-coral/20 p-10 shadow-xl section-border-pink">
        <div className="text-center">
          <span className="tag-pill mx-auto bg-brand-pink text-brand-black">What The Crew Says</span>
          <h2 className="mt-4 text-2xl font-bold text-brand-black lg:text-3xl">
            Join 500+ SA expats and UK food nerds who turned Friday into bunny night
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-lg">
            <p className="mb-4 text-base font-medium italic leading-relaxed text-brand-black">
              &ldquo;Eish, Friday nights sorted. My mates finally understand what real bunny chow tastes like.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-brand-coral" />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black/70">
                Themba, Leeds
              </p>
            </div>
          </div>

          <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-lg">
            <p className="mb-4 text-base font-medium italic leading-relaxed text-brand-black">
              &ldquo;Better than the bunny chow I had back home. Sharp sharp, these boxes are legit.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-brand-green" />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black/70">
                Priya, London
              </p>
            </div>
          </div>

          <div className="rounded-2xl border-3 border-black bg-white p-6 shadow-lg">
            <p className="mb-4 text-base font-medium italic leading-relaxed text-brand-black">
              &ldquo;My mates ask me to cook every week now. I just heat and plate - they think I&apos;m a chef.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-brand-blue" />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black/70">
                Marcus, Bristol
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8 rounded-2xl border-3 border-black bg-gradient-to-br from-brand-green/30 via-white to-brand-curry/20 p-10 shadow-xl section-border-green">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tag-pill bg-brand-green text-brand-black">Inner Circle</span>
            <span className="rounded-full border-2 border-black bg-brand-coral px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-brand-black shadow-md">
              Members Only
            </span>
          </div>
          <h2 className="text-3xl font-bold text-brand-black lg:text-4xl">
            Join The Inner Circle: Get First Pick Every Monday
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-brand-black/70">
            Don&apos;t wait until Tuesday when boxes are flying. Members get early access, guaranteed allocation, and members-only drops every month.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6 rounded-2xl border-3 border-black bg-white p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-brand-black">What Members Get:</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-black bg-brand-coral text-sm font-black">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-brand-black">Early Access Monday</p>
                  <p className="text-sm text-brand-black/70">Lock your box 24 hours before the public. Never miss a drop.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-black bg-brand-curry text-sm font-black">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-brand-black">Members-Only Monthly Drops</p>
                  <p className="text-sm text-brand-black/70">This month: Oxtail potjie kit (members only). Next month: TBA.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-black bg-brand-green text-sm font-black">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-brand-black">Guaranteed Allocation</p>
                  <p className="text-sm text-brand-black/70">Even if public slots sell out, your box is locked in.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-black bg-brand-pink text-sm font-black">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-brand-black">Surprise Monthly Perks</p>
                  <p className="text-sm text-brand-black/70">Free pumpkin fritters, extra samoosas, spice upgrades - we spoil our crew.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border-3 border-black bg-brand-black p-8 text-white shadow-lg">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] backdrop-blur-sm">
                Built by the best
              </div>
              <p className="text-lg leading-relaxed">
                <span className="font-bold">Ex-Nando&apos;s head chef</span> who spent 10 years feeding the masses across SA & UK. Now bringing proper bunny chow to your door, one small batch at a time.
              </p>
            </div>

            <div className="rounded-2xl border-3 border-black bg-brand-curry p-8 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-brand-black">Box Sold Out?</h3>
              <p className="mb-6 text-sm leading-relaxed text-brand-black/70">
                Add your WhatsApp to get notified the moment next week&apos;s drop goes live. Don&apos;t miss out again, boet.
              </p>
                <Link
                  href="/builder"
                className="inline-flex w-full items-center justify-center rounded-lg border-2 border-black bg-brand-black px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-md transition hover:scale-[1.02]"
                >
                Join The Waitlist
                </Link>
              </div>
            </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border-3 border-black bg-brand-coral px-10 py-16 shadow-2xl lg:px-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-curry/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-black/20 blur-3xl" />
        
        <div className="relative space-y-10">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border-3 border-black bg-brand-black px-5 py-3 shadow-lg">
              <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-brand-curry" />
              <span className="text-sm font-bold uppercase tracking-[0.25em] text-white">Orders Lock Soon</span>
            </div>
            
            <h2 className="text-4xl font-black leading-tight text-brand-black lg:text-5xl xl:text-6xl">
              Orders Lock Tuesday 23:59: Don&apos;t Wait Till Next Week
            </h2>
            
            <p className="mx-auto max-w-2xl text-xl font-semibold leading-relaxed text-brand-black/80">
              Miss it and you&apos;re waiting 7 days, boet. Sharp sharp, lock your box now before slots are gone.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="mb-4 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-black">
                Time left to order
              </p>
            </div>
            <CountdownTimer variant="large" />
          </div>

          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-5 py-3 shadow-md">
              <span className="text-2xl">📦</span>
              <span className="text-sm font-bold text-brand-black">
                <DynamicStat baseValue={47} variance={15} /> boxes left
              </span>
            </div>
            
            <div className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-5 py-3 shadow-md">
              <span className="text-2xl">👥</span>
              <span className="text-sm font-bold text-brand-black">
                <DynamicStat baseValue={347} variance={25} /> families ordering this week
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-3 border-black bg-brand-black px-10 py-5 text-lg font-black uppercase tracking-wide text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              🔥 Lock Your Box Now
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-3 border-black bg-white px-10 py-5 text-lg font-black uppercase tracking-wide text-brand-black shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              See The Experience
            </Link>
          </div>

          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-6 text-sm font-bold text-brand-black/70">
            <div className="flex items-center gap-2">
              <span className="text-brand-black">✓</span>
              <span>Trustpilot 4.5/5</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-brand-black/50" />
            <div className="flex items-center gap-2">
              <span className="text-brand-black">✓</span>
              <span>Chef-tested recipes</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-brand-black/50" />
            <div className="flex items-center gap-2">
              <span className="text-brand-black">✓</span>
              <span>Grey Street approved</span>
            </div>
          </div>

          <div className="mx-auto rounded-2xl border-2 border-black bg-brand-black/10 px-6 py-4 text-center backdrop-blur-sm">
            <p className="text-sm font-semibold text-brand-black">
              💡 Join 500+ SA expats and UK food nerds who turned Friday into bunny night
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


