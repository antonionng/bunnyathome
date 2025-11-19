import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LiveCounter } from "@/components/ui/live-counter";
import { FlowModalTrigger } from "@/components/ui/flow-modal-trigger";

const differentiators = [
  {
    title: "Under 20 minutes",
    description: "Pre-portioned spices and QR prep films mean you plate legendary bunny chow fast.",
    tag: "Speed",
    accent: "bg-brand-blue",
    icon: "⏱️",
  },
  {
    title: "Real Durban heat",
    description: "Small-batch masalas from Grey Street spice merchants for proper Durban bite.",
    tag: "Authenticity",
    accent: "bg-brand-curry",
    icon: "🌶️",
  },
  {
    title: "Flexible delivery",
    description: "Swap curries, pause boxes over December, or send a box to the cousins with a tap.",
    tag: "Control",
    accent: "bg-brand-green",
    icon: "🚚",
  },
  {
    title: "Community rewards",
    description: "Earn Spice Locker points, unlock chef drops, and join supper clubs with other expats.",
    tag: "Loyalty",
    accent: "bg-brand-pink",
    icon: "✨",
  },
];

const drops = [
  {
    slug: "durban-classic",
    name: "Durban Classic Drop",
    summary: "Lamb Durban curry, soft loaf, chutney, pumpkin fritters",
    serves: "Feeds 2–3",
    items: [
      "Lamb Durban Curry (serves 2–3)",
      "Soft white bread loaf",
      "Mrs Balls chutney",
      "Pumpkin fritters (ready to eat)",
    ],
    approxPrice: "£37",
    priceDetail: "£37.10",
    image: "/drops/drop-durban-classic.png",
  },
  {
    slug: "vegetarian-delight",
    name: "Vegetarian Delight Drop",
    summary: "Bean curry bunny, vetkoek, sweet-corn samoosas",
    serves: "Feeds 2–3",
    items: [
      "Bean Durban Curry (serves 2–3)",
      "Bean & potato bunny chow filling",
      "Pack of 4 vetkoek",
      "12 sweet-corn & cheese samoosas",
    ],
    approxPrice: "£51",
    priceDetail: "£51.10",
    image: "/drops/drop-vegetarian-delight.png",
  },
  {
    slug: "meat-lover-feast",
    name: "Meat Lover Feast Drop",
    summary: "Short-rib curry, pork rashers, boerewors, biltong",
    serves: "Feeds 3–4",
    items: [
      "Beef short-rib Durban curry",
      "Honey & mustard pork rashers (400g)",
      "Boerewors (prime beef, 500g)",
      "Original beef biltong (100g)",
      "Curried beef-mince vetkoek filling",
    ],
    approxPrice: "£58",
    priceDetail: "£58.35",
    image: "/drops/drop-meat-lover-feast.png",
  },
  {
    slug: "street-food-sampler",
    name: "Durban Street-Food Sampler",
    summary: "Pumpkin fritters, corn ribs, samoosas, pork rashers",
    serves: "Feeds 3–4",
    items: [
      "Pumpkin fritters (ready to eat)",
      "Durban-curried corn ribs",
      "12 samoosas (lamb or veg)",
      "Honey & mustard pork rashers",
      "Original beef biltong (100g)",
    ],
    approxPrice: "£40",
    priceDetail: "£40.05",
    image: "/drops/drop-street-food-sampler.png",
  },
  {
    slug: "traditional-bunny",
    name: "Traditional Bunny Chow Drop",
    summary: "Chicken bunny filling, soft loaf, samoosas, chutney",
    serves: "Feeds 2–3",
    items: [
      "Chicken & potato bunny chow filling",
      "Soft white bread loaf",
      "Carrot salad vinaigrette",
      "12 samoosas",
      "Mrs Balls chutney",
    ],
    approxPrice: "£43",
    priceDetail: "£43.05",
    image: "/drops/drop-traditional-bunny.png",
  },
];

const highlightTreats = [
  {
    title: "Pumpkin fritters two ways",
    description: "Choose ready-to-eat dessert or the fry-at-home kit for brunch theatre.",
    pill: "Sweet finish",
    image: "/treats/pumpkin-fritters.png",
    accent: "bg-brand-pink",
  },
  {
    title: "Loaf & vetkoek essentials",
    description: "Unsliced bunny loaf, gluten-free bake, or vetkoek sliders so you can pick your favourite carb base.",
    pill: "Bread bar",
    image: "/treats/bread-options.png",
    accent: "bg-brand-blue",
  },
  {
    title: "Braai-ready extras",
    description: "Samoosas, boerewors coils, honey-mustard rashers, and Durban-curried corn ribs for sharing.",
    pill: "Feast mode",
    image: "/treats/braai-extras.png",
    accent: "bg-brand-green",
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
      <section
        className="relative overflow-hidden rounded-2xl border-3 border-black bg-white p-8 shadow-lg section-border-curry md:p-14"
        id="hero"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_0.9fr)] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-curry px-5 py-2 text-xs font-bold uppercase tracking-[0.35em] text-brand-black shadow-sm">
              Durban-born · Made for weeknight jol
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.03] tracking-tight text-ink sm:text-5xl lg:text-[58px] xl:text-[66px]">
              Load a bunny, crank the curry, feed the laaities in 48 hours.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl">
              Slow-simmered gravies, hot-from-the-oven loaves, carrot sambals, and pantry legends arrive mise en
              place. You plate, pour rooibos, and let the bunny chow flex happen in under 20 minutes.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <FlowModalTrigger className="border-3 border-black bg-brand-black px-9 py-6 text-base font-bold text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  🔥 Build your box
                </FlowModalTrigger>
                <Button
                  className="border-3 border-black bg-brand-curry px-9 py-6 text-base font-bold text-brand-black shadow-xl transition hover:-translate-y-1 hover:bg-brand-curry/90"
                  asChild
                >
                  <Link href="/menu">View menu</Link>
                </Button>
              </div>
              <Link href="#drops" className="text-sm font-bold text-ink-muted hover:text-brand-coral transition-colors underline underline-offset-4">
                Or explore today's signature drops →
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-coral/10 px-4 py-2">
              <span className="text-base">⏰</span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-coral">
                Orders lock Tuesday · Deliveries land by Friday braai-time
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                { text: "Chef-grade potjie gravies", bg: "bg-brand-pink", icon: "🍲" },
                { text: "Loaf, vetkoek & braai sides", bg: "bg-brand-blue", icon: "🥖" },
                { text: "Spice locker rewards with every drop", bg: "bg-brand-green", icon: "⭐" },
              ].map((feature) => (
                <div
                  key={feature.text}
                  className={`group flex items-center gap-3 rounded-2xl border-3 border-black ${feature.bg} px-6 py-5 font-bold text-brand-black shadow-xl transition hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <span className="text-3xl transition-transform group-hover:scale-110">{feature.icon}</span>
                  <span className="text-sm leading-tight">{feature.text}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border-3 border-black bg-brand-curry p-6 shadow-xl">
              <LiveCounter />
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
          <h2 className="text-3xl font-bold text-ink">Layer the loaf, then the gravy, then the braai extras.</h2>
          <p className="max-w-3xl text-base text-ink-muted">
            Pick your base of soft loaf, vetkoek slider, or gluten-free kota, then drag in garnishes, chutneys, and
            braai snacks so the whole table feels like Florida Road at golden hour.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {highlightTreats.map((item) => (
            <div
              key={item.title}
              className={`flex flex-col gap-4 rounded-2xl border-2 border-black ${item.accent} p-6 text-sm text-brand-black shadow-lg`}
            >
              <div className="relative h-40 w-full overflow-hidden rounded-xl border-2 border-black bg-white/40">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 260px, 100vw"
                  unoptimized
                />
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-black bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-brand-black">
                {item.pill}
              </span>
              <h3 className="text-xl font-semibold text-brand-black">{item.title}</h3>
              <p className="text-sm leading-relaxed text-brand-black/80">{item.description}</p>
              <Button
                size="sm"
                className="mt-auto w-full border-black bg-brand-black text-white hover:bg-brand-black/90"
                asChild
              >
                <Link href="/builder">Add to your box</Link>
              </Button>
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
              Every kit drops with QR prep films, amapiano playlists, and masala boosters so you can host like an
              aunty while the curry simmers.
            </p>
          </div>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-coral px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-coral/90"
          >
            Preview the 4-step builder
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-black bg-white p-0 shadow-md transition hover:-translate-y-1"
            >
              <div className={`${item.accent} flex items-center justify-between gap-3 border-b-2 border-black px-4 py-3 text-xs font-bold uppercase tracking-[0.3em] text-brand-black`}>
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="text-base">
                    {item.icon}
                  </span>
                  {item.tag}
                </span>
                <span className="rounded-full border-2 border-black bg-white px-2 py-0.5 text-[10px]">
                  Durban
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 px-5 py-5 text-sm">
                <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="drops" className="space-y-10 rounded-2xl border-3 border-black bg-brand-green p-10 shadow-xl">
        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2">
            <span className="text-lg">🔥</span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black">Signature drops</span>
          </div>
          <h2 className="text-4xl font-bold text-brand-black lg:text-5xl">
            Limited drops inspired by Durban's street food legends.
          </h2>
          <p className="max-w-2xl text-lg text-brand-black/80">
            Each drop is a chef-curated kit of BunnyAtHome favourites, inspired by Grey Street queues. Prices show
            box total and serves so you know exactly how much the crew is eating.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {drops.map((drop, idx) => {
            const previewItems = drop.items.slice(0, 3);
            const remaining = drop.items.length - previewItems.length;
            const cardColors = [
              "bg-brand-pink",
              "bg-brand-blue",
              "bg-brand-curry",
              "bg-brand-coral",
              "bg-brand-green",
            ];
            const cardColor = cardColors[idx % cardColors.length];
            return (
              <div
                key={drop.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border-3 border-black bg-white shadow-xl transition hover:-translate-y-3 hover:shadow-2xl"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={drop.image}
                    alt={drop.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(min-width: 1024px) 320px, 100vw"
                    unoptimized
                  />
                  <div className="absolute left-5 top-5 flex items-center gap-2">
                    <span className="rounded-full border-2 border-black bg-brand-curry px-4 py-2 text-sm font-black uppercase tracking-wider text-brand-black shadow-md">
                      {drop.approxPrice}
                    </span>
                    <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-black shadow-md">
                      NEW
                    </span>
                  </div>
                </div>
                <div className={`flex flex-1 flex-col gap-5 p-8 ${cardColor}`}>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-brand-black">{drop.name}</h3>
                    <p className="text-sm font-semibold text-brand-black/70">{drop.summary}</p>
                  </div>
                  <ul className="space-y-2.5 text-sm font-semibold text-brand-black">
                    {previewItems.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-black" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {remaining > 0 && (
                      <li className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black/60">
                        +{remaining} more pantry favourites
                      </li>
                    )}
                  </ul>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between rounded-xl border-2 border-black bg-white px-4 py-3 shadow-md">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">Price</div>
                        <div className="text-xl font-black text-brand-black">{drop.priceDetail}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">Serves</div>
                        <div className="text-xl font-black text-brand-black">{drop.serves}</div>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="w-full border-2 border-black bg-brand-black text-base font-bold uppercase tracking-wide text-white shadow-md hover:bg-brand-black/90"
                      asChild
                    >
                      <Link href="/builder">Build this drop →</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="community" className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border-2 border-black bg-brand-pink p-10 shadow-lg section-border-coral">
          <div className="space-y-5">
            <span className="tag-pill w-fit bg-white text-brand-black">Community</span>
            <h2 className="text-4xl font-bold text-brand-black lg:text-[40px]">
              Loyalty that tastes like home: chef drops, supper clubs, story swaps.
            </h2>
            <p className="text-lg leading-relaxed text-brand-black/80">
              Every delivery boosts your Spice Locker balance. Unlock seasonal masalas, limited bunny drops, and
              private cook-alongs while celebrating Durban legends together.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="relative overflow-hidden rounded-2xl border-2 border-black bg-white p-7 text-sm text-ink shadow-md"
              >
                <p className="relative text-base italic leading-relaxed text-ink">"{testimonial.quote}"</p>
                <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.3em] text-brand-coral">
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6 rounded-2xl border-2 border-black bg-brand-curry p-10 shadow-lg section-border-pink">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-black">
              Level 2 · Grey Street regular
            </div>
            <h3 className="text-2xl font-bold text-brand-black">
              Refer the crew, level up your Spice Locker.
            </h3>
            <p className="text-sm leading-relaxed text-brand-black/80">
              Share your personalised code to gift £10 off first orders. Every successful referral loads points into
              your Spice Locker so you can climb tiers and unlock bigger rewards.
            </p>
          </div>
          <div className="space-y-4 rounded-2xl border-2 border-black bg-white p-6 text-sm text-ink">
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
            <div className="space-y-1 pt-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-curry/20">
                <div className="h-full w-2/3 bg-brand-coral" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/70">
                250 points to next reward
              </p>
            </div>
          </div>
          <Button
            size="md"
            className="w-full border-black bg-brand-black text-white hover:bg-brand-black/90"
            asChild
          >
            <Link href="https://wa.me/?text=Join%20me%20for%20a%20Durban%20bunny%20chow%20night%20from%20BunnyAtHome%20%E2%80%94%20here%E2%80%99s%20my%20code%20for%20%C2%A310%20off%20your%20first%20box.">
              Drop your code on WhatsApp
            </Link>
          </Button>
        </div>
      </section>

      <section id="subscriptions" className="space-y-10 rounded-2xl border-3 border-black bg-white p-10 shadow-xl">
        <div className="flex flex-col gap-4 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-curry px-4 py-2">
            <span className="text-lg">📦</span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black">Subscriptions</span>
          </div>
          <h2 className="text-4xl font-bold text-ink lg:text-5xl">Choose the cadence that suits your fam.</h2>
          <p className="mx-auto max-w-2xl text-lg text-ink-muted">
            Each plan keeps the spice locker stocked and makes it easy to see feeds, spice level, and delivery perks
            at a glance.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {subscriptionTiers.map((tier, idx) => {
            const tierColors = {
              "Weekly Ritual": { bg: "bg-brand-coral", accent: "bg-brand-coral" },
              "Flexi Feast": { bg: "bg-brand-blue", accent: "bg-brand-blue" },
              "Family Table": { bg: "bg-brand-green", accent: "bg-brand-green" },
            };
            const colors = tierColors[tier.name as keyof typeof tierColors];
            const isPopular = tier.name === "Flexi Feast";
            
            return (
              <div
                key={tier.name}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border-3 border-black bg-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl ${
                  isPopular ? "lg:scale-105" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute -right-8 top-6 z-10 rotate-45 bg-brand-black px-10 py-1 text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    Popular
                  </div>
                )}
                <div className={`${colors.bg} px-8 py-6`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-brand-black">{tier.name}</h3>
                    <div className="rounded-full border-2 border-black bg-white px-4 py-2 text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">From</div>
                      <div className="text-xl font-black text-brand-black">{tier.price}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-6 p-8">
                  <ul className="space-y-4 text-sm font-semibold text-ink">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3">
                        <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${colors.accent}`}>
                          <span className="text-xs text-white">✓</span>
                        </span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    className={`mt-auto w-full border-2 border-black ${colors.accent} text-base font-bold uppercase tracking-wide text-white shadow-md hover:opacity-90`}
                  >
                    Lock this cadence
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border-3 border-black bg-brand-curry p-12 shadow-2xl lg:p-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-coral/20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-black/10 blur-3xl"></div>
        
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 shadow-md">
              <span className="text-xl">🔥</span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black">Ready to cook?</span>
            </div>
            <h2 className="text-5xl font-black leading-tight text-brand-black lg:text-6xl">
              Orders lock Tuesday, deliveries land by Friday braai-time.
            </h2>
            <p className="text-xl leading-relaxed text-brand-black/80">
              Load a bunny, stack the curries, and add braai extras. Your build will soon be saved to your dashboard
              for lightning-fast reorders and subscriptions.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-brand-black/10 px-5 py-3 text-sm font-bold text-brand-black backdrop-blur-sm">
              <span>⚡</span>
              Already building with us?{" "}
              <Link
                href="/login"
                className="underline decoration-2 underline-offset-4 transition hover:text-white"
              >
                Sign in to view your boxes
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-shrink-0">
            <FlowModalTrigger 
              className="border-3 border-black bg-brand-black px-10 py-7 text-lg font-black uppercase tracking-wide text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              🔥 Build your box now →
            </FlowModalTrigger>
            <Button
              className="border-3 border-black bg-brand-curry px-10 py-7 text-lg font-black uppercase tracking-wide text-brand-black shadow-xl transition hover:-translate-y-1 hover:bg-brand-curry/90"
              asChild
            >
              <Link href="/menu">View menu</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
