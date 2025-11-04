import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const differentiators = [
  {
    title: "Under 20 minutes",
    description: "Pre-portioned spices and prep videos mean you plate legendary bunny chow fast.",
    tag: "Speed",
  },
  {
    title: "Real Durban heat",
    description: "Small-batch masalas sourced from family spice merchants on Grey Street.",
    tag: "Authenticity",
  },
  {
    title: "Flexible delivery",
    description: "Swap curries, pause boxes, or send to friends with a couple of taps.",
    tag: "Control",
  },
  {
    title: "Community rewards",
    description: "Earn loyalty points, unlock chef drops, and celebrate Durban legends together.",
    tag: "Loyalty",
  },
];

const drops = [
  {
    slug: "durban-classic",
    name: "Durban Classic Drop",
    summary: "Lamb Durban curry, soft loaf, chutney, pumpkin fritters",
    items: [
      "Lamb Durban Curry (serves 2–3)",
      "Soft white bread loaf",
      "Mrs Balls chutney",
      "Pumpkin fritters (ready to eat)",
    ],
    approxPrice: "~£37",
    priceDetail: "~£37.10",
    image: "/drops/drop-durban-classic.png",
  },
  {
    slug: "vegetarian-delight",
    name: "Vegetarian Delight Drop",
    summary: "Bean curry bunny, vetkoek, sweet-corn samoosas",
    items: [
      "Bean Durban Curry (serves 2–3)",
      "Bean & potato bunny chow filling",
      "Pack of 4 vetkoek",
      "12 sweet-corn & cheese samoosas",
    ],
    approxPrice: "~£51",
    priceDetail: "~£51.10",
    image: "/drops/drop-vegetarian-delight.png",
  },
  {
    slug: "meat-lover-feast",
    name: "Meat Lover Feast Drop",
    summary: "Short-rib curry, pork rashers, boerewors, biltong",
    items: [
      "Beef short-rib Durban curry",
      "Honey & mustard pork rashers (400g)",
      "Boerewors (prime beef, 500g)",
      "Original beef biltong (100g)",
      "Curried beef-mince vetkoek filling",
    ],
    approxPrice: "~£58",
    priceDetail: "~£58.35",
    image: "/drops/drop-meat-lover-feast.png",
  },
  {
    slug: "street-food-sampler",
    name: "Durban Street-Food Sampler",
    summary: "Pumpkin fritters, corn ribs, samoosas, pork rashers",
    items: [
      "Pumpkin fritters (ready to eat)",
      "Durban-curried corn ribs",
      "12 samoosas (lamb or veg)",
      "Honey & mustard pork rashers",
      "Original beef biltong (100g)",
    ],
    approxPrice: "~£40",
    priceDetail: "~£40.05",
    image: "/drops/drop-street-food-sampler.png",
  },
  {
    slug: "traditional-bunny",
    name: "Traditional Bunny Chow Drop",
    summary: "Chicken bunny filling, soft loaf, samoosas, chutney",
    items: [
      "Chicken & potato bunny chow filling",
      "Soft white bread loaf",
      "Carrot salad vinaigrette",
      "12 samoosas",
      "Mrs Balls chutney",
    ],
    approxPrice: "~£43",
    priceDetail: "~£43.05",
    image: "/drops/drop-traditional-bunny.png",
  },
];

const highlightTreats = [
  {
    title: "Pumpkin fritters two ways",
    description: "Choose ready-to-eat dessert or the fry-at-home kit for brunch theatre.",
    pill: "Sweet finish",
  },
  {
    title: "Loaf & vetkoek essentials",
    description: "Unsliced bunny loaf, gluten-free bake, or vetkoek sliders — pick your favourite carb base.",
    pill: "Bread bar",
  },
  {
    title: "Braai-ready extras",
    description: "Samoosas, boerewors coils, honey-mustard rashers, and Durban-curried corn ribs for sharing.",
    pill: "Feast mode",
  },
];

const testimonials = [
  {
    quote:
      "Exact Grey Street flavours. My Manchester mates finally understand what real bunny chow tastes like.",
    author: "Nomfundo, Durban expat",
  },
  {
    quote: "It’s my midweek ritual: swap curries, heat, serve. Under 20 minutes, zero compromise.",
    author: "James, London foodie",
  },
];

const subscriptionTiers = [
  {
    name: "Weekly Ritual",
    price: "£49/box",
    perks: ["Feeds 2-3", "Swap curries anytime", "Pause or skip instantly"],
    accent: "brand-coral",
  },
  {
    name: "Flexi Feast",
    price: "£55/box",
    perks: ["Two boxes monthly", "Seasonal chef specials", "Complimentary dessert add-on"],
    accent: "brand-curry",
  },
  {
    name: "Family Table",
    price: "£79/box",
    perks: ["Feeds 4-5", "Kid-friendly spice options", "Free delivery every 3rd box"],
    accent: "brand-green",
  },
];

export default function Home() {
  const featuredDrop =
    drops.find((drop) => drop.slug === "meat-lover-feast") ?? drops[0];
  const featuredItemsPreview = featuredDrop.items.slice(0, 3);
  const remainingItems = Math.max(featuredDrop.items.length - featuredItemsPreview.length, 0);

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-2xl border-3 border-black bg-white p-8 shadow-lg section-border-curry md:p-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_0.9fr)] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-curry px-5 py-2 text-xs font-bold uppercase tracking-[0.35em] text-brand-black shadow-sm">
              Durban-born · UK-made
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.03] tracking-tight text-ink sm:text-5xl lg:text-[58px] xl:text-[66px]">
              Durban-born bunny chow nights, delivered to your table in 48 hours.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl">
              Slow-stewed curry fillings, soft loafs, carrot sambals, and street-food favourites. Load your box,
              crank the heat boosters, and turn dinner into a Durban ritual in under 20 minutes.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button size="lg" className="px-9 py-6 text-base" asChild>
                <Link href="/builder">Build your custom box</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-brand-curry/50 px-9 py-6 text-base text-ink"
                asChild
              >
                <Link href="#drops">Browse signature drops</Link>
              </Button>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-coral">
              Ships nationwide · Skip or pause anytime
            </p>
            <div className="grid gap-4 text-sm text-ink md:grid-cols-3">
              {["Restaurant fillings", "Bread & garnish options", "Rewards with every drop"].map(
                (feature) => (
                  <div
                    key={feature}
                    className="rounded-lg border-2 border-black bg-white px-5 py-4 font-semibold shadow-md transition hover:-translate-y-0.5"
                  >
                    {feature}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-6">
            <div className="group relative w-full overflow-hidden rounded-2xl border-2 border-black bg-white shadow-lg transition duration-500 hover:-translate-y-1">
              <div className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-curry px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-brand-black">
                Featured drop
              </div>
              <div className="absolute right-6 top-6 z-10 flex items-center gap-3 rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold text-ink">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-coral" />
                {featuredDrop.approxPrice}
              </div>
              <div className="relative h-[360px] w-full overflow-hidden">
                <Image
                  src={featuredDrop.image}
                  alt={featuredDrop.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.05]"
                  priority
                  sizes="(min-width: 1024px) 520px, 100vw"
                  unoptimized
                />
              </div>
              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-2 rounded-lg border-2 border-black bg-white p-4 text-sm text-ink shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-base font-semibold text-ink">{featuredDrop.name}</p>
                  <span className="rounded-full border-2 border-black bg-brand-curry px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-brand-black">
                    New
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-ink-muted">
                  {featuredItemsPreview.join(" · ")}
                  {remainingItems > 0 ? ` · +${remainingItems} more` : ""}
                </p>
                <Link
                  href="#drops"
                  className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-coral hover:text-brand-coral/80"
                >
                  Explore drops
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
            <div className="grid w-full gap-4 md:grid-cols-2">
              <div className="flex items-center justify-center rounded-lg border-2 border-black bg-brand-curry px-4 py-4">
                <Image
                  src="/trustpilot-star-4-5.webp"
                  alt="Trustpilot rating"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <div className="rounded-lg border-2 border-black bg-brand-blue px-4 py-4 text-sm font-semibold text-ink">
                500+ loyal members from Brighton to kitchens nationwide
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-between gap-4 rounded-lg border-2 border-black bg-white px-6 py-5 text-sm text-ink shadow-md lg:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=60"].map(
                    (avatar) => (
                      <span
                        key={avatar}
                        className="h-10 w-10 rounded-full border-2 border-white bg-cover bg-center"
                        style={{ backgroundImage: `url(${avatar})` }}
                      />
                    )
                  )}
                </div>
                <p className="text-sm font-semibold text-ink">
                  “That first curry hit transported us straight to Grey Street.”
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-muted">
                Trusted by Durban expats & UK food nerds
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border-2 border-black bg-white p-10 shadow-lg section-border-blue">
        <div className="flex flex-col gap-3">
          <span className="tag-pill w-fit bg-brand-blue text-brand-black">Build your spread</span>
          <h2 className="text-3xl font-bold text-ink">Layer in breads, garnishes, and Durban favourites.</h2>
          <p className="max-w-3xl text-base text-ink-muted">
            Start with your filling, then tap through loafs, vetkoek, pumpkin fritters, samoosas, and braai
            classics so the whole table feels like Florida Road at sunset.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {highlightTreats.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-lg border-2 border-black bg-white p-6 text-sm text-ink shadow-md"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-ink">
                {item.pill}
              </span>
              <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{item.description}</p>
              <Link
                href="/builder"
                className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-coral hover:text-brand-coral/80"
              >
                Add to your box
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="experience" className="space-y-14 rounded-2xl border-2 border-black bg-white p-10 shadow-lg section-border-pink">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="tag-pill bg-brand-pink text-brand-black">The ritual</span>
            <h2 className="text-4xl font-bold text-ink lg:text-5xl">
              Dinner theatre for spice obsessives and Durban dreamers.
            </h2>
            <p className="text-lg text-ink-muted">
              Kits arrive mise en place with QR-linked prep films and masala boosters so you can set the
              table, cue the playlist, and pour chai while the curry simmers.
            </p>
          </div>
          <Link
            href="/builder"
            className="text-sm font-bold text-brand-coral underline-offset-6 hover:underline"
          >
            Preview the 4-step builder
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-lg border-2 border-black bg-white p-8 shadow-md transition hover:-translate-y-1"
            >
              <span className="relative inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-ink">
                {item.tag}
              </span>
              <h3 className="relative mt-5 text-xl font-semibold text-ink">{item.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-ink-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="drops" className="space-y-10 rounded-2xl border-2 border-black bg-white p-10 shadow-lg section-border-green">
        <div className="flex flex-col gap-3">
          <span className="tag-pill w-fit bg-brand-green text-brand-black">Signature drops</span>
          <h2 className="text-3xl font-bold text-ink">Limited bundles inspired by Durban's street food legends.</h2>
          <p className="max-w-2xl text-base text-ink-muted">
            Each drop is a chef-curated kit of BunnyAtHome favourites. Mix-and-match boxes rotate often, so
            grab the flavours that speak to your table.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {drops.map((drop) => {
            const previewItems = drop.items.slice(0, 3);
            const remaining = drop.items.length - previewItems.length;
            return (
              <div
                key={drop.slug}
                className="group flex flex-col overflow-hidden rounded-lg border-2 border-black bg-white shadow-lg transition hover:-translate-y-2"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={drop.image}
                    alt={drop.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 320px, 100vw"
                    unoptimized
                  />
                  <span className="absolute left-5 top-5 rounded-full border-2 border-black bg-brand-curry px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-brand-black">
                    {drop.approxPrice}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-8">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-ink">{drop.name}</h3>
                    <p className="text-sm text-ink-muted">{drop.summary}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-ink">
                    {previewItems.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-brand-curry" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {remaining > 0 && (
                      <li className="text-xs font-bold uppercase tracking-[0.3em] text-brand-coral">
                        +{remaining} more pantry favourites
                      </li>
                    )}
                  </ul>
                  <div className="mt-auto flex items-center justify-between text-xs font-bold uppercase tracking-[0.3em] text-ink-muted">
                    <span>{drop.priceDetail}</span>
                    <Link
                      href="/builder"
                      className="inline-flex items-center gap-2 text-brand-coral hover:text-brand-coral/80"
                    >
                      Build this drop
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="community" className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border-2 border-black bg-white p-10 shadow-lg section-border-coral">
          <div className="space-y-5">
            <span className="tag-pill w-fit bg-brand-coral text-brand-black">Community</span>
            <h2 className="text-4xl font-bold text-ink lg:text-[40px]">
              Loyalty that tastes like home — chef drops, supper clubs, story swaps.
            </h2>
            <p className="text-lg leading-relaxed text-ink-muted">
              Every delivery boosts your points balance. Unlock seasonal masalas, limited bunny drops, and
              private cook-alongs while celebrating Durban legends together.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="relative overflow-hidden rounded-lg border-2 border-black bg-white p-7 text-sm text-ink shadow-md"
              >
                <p className="relative text-base italic leading-relaxed text-ink">"{testimonial.quote}"</p>
                <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.3em] text-ink-muted">
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6 rounded-2xl border-2 border-black bg-white p-10 shadow-lg section-border-pink">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-ink">
              Refer the crew, fund your spice locker.
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              Share your personalised code to gift £10 off first orders. Every successful referral loads 500
              points into your balance to spend on sides, desserts, or shipping upgrades.
            </p>
          </div>
          <div className="space-y-4 rounded-lg border-2 border-black bg-white p-6 text-sm text-ink">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-ink/70">Points balance</span>
              <span className="text-xl font-bold text-brand-curry">1,250</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-ink/70">
                Rewards unlocked
              </span>
              <span className="text-sm font-bold text-ink">Free samosa trio</span>
            </div>
          </div>
          <Button size="md" className="w-full">
            Join the referral circle
          </Button>
        </div>
      </section>

      <section id="subscriptions" className="space-y-10 rounded-2xl border-2 border-black bg-white p-10 shadow-lg section-border-curry">
        <div className="flex flex-col gap-3 text-center">
          <span className="tag-pill mx-auto w-fit bg-brand-curry text-brand-black">Subscriptions</span>
          <h2 className="text-3xl font-bold text-ink">Choose the cadence that fits your fam.</h2>
          <p className="mx-auto max-w-2xl text-base text-ink-muted">
            Each plan keeps the spice locker stocked and lets you reschedule, pause, or swap curries in two
            taps.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {subscriptionTiers.map((tier) => (
            <div
              key={tier.name}
              className="group flex flex-col gap-6 rounded-lg border-2 border-black bg-white p-8 shadow-md transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-ink">{tier.name}</h3>
                <span
                  className="rounded-full border-2 border-black bg-brand-curry px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-brand-black"
                >
                  {tier.price}
                </span>
              </div>
              <ul className="space-y-3 text-sm text-ink">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-curry" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="md" className="mt-auto border-brand-curry/60 text-ink">
                Preview upcoming boxes
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border-2 border-black bg-brand-curry px-12 py-14 shadow-lg section-border-coral">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="tag-pill bg-white text-brand-black">Ready to cook?</span>
            <h2 className="text-4xl font-bold text-ink lg:text-[42px]">
              Assemble your Durban feast, lock your delivery cadence, and feed the crew.
            </h2>
            <p className="text-lg text-ink-muted">
              Custom curry bases, sides, sauces, and drinks — soon saved to your dashboard for quick
              reorders and subscriptions.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="px-8 py-5 text-base" asChild>
              <Link href="/builder">Start the builder</Link>
            </Button>
            <Button variant="ghost" size="lg" className="px-8 py-5 text-base" asChild>
              <Link href="/login">Sign in to view your boxes</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
