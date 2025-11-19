import Link from "next/link";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote:
      "Exact Grey Street flavours. My Manchester mates finally understand what real bunny chow tastes like.",
    author: "Nomfundo, Durban expat",
  },
  {
    quote: "It's my midweek ritual: swap curries, heat, serve. Under 20 minutes, zero compromise.",
    author: "James, London foodie",
  },
];

export default function CommunityPage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border-3 border-black bg-gradient-to-br from-brand-coral/25 via-white to-brand-pink/25 p-10 shadow-xl section-border-coral">
          <div className="space-y-5">
            <span className="tag-pill w-fit bg-brand-coral text-brand-black">Community</span>
            <h1 className="text-4xl font-bold text-ink lg:text-[40px]">
              Loyalty that tastes like home: chef drops, supper clubs, story swaps.
            </h1>
            <p className="text-lg leading-relaxed text-ink-muted">
              Every delivery boosts your points balance. Unlock seasonal masalas, limited bunny drops, and
              private cook-alongs while celebrating Durban legends together.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, idx) => (
              <div
                key={testimonial.author}
                className={`group relative overflow-hidden rounded-xl border-3 border-black p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  idx === 0 ? "bg-brand-coral/20" : "bg-brand-pink/20"
                }`}
              >
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${
                  idx === 0 ? "bg-brand-coral/30" : "bg-brand-pink/30"
                } blur-2xl transition-all duration-500 group-hover:scale-150`} />
                
                <div className="relative space-y-5">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black ${
                    idx === 0 ? "bg-brand-coral" : "bg-brand-pink"
                  } text-2xl shadow-md`}>
                    💬
                  </div>
                  <p className="text-base font-medium leading-relaxed text-brand-black">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={`h-1 w-12 rounded-full ${
                      idx === 0 ? "bg-brand-coral" : "bg-brand-pink"
                    }`} />
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black/70">
                      {testimonial.author}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-6 rounded-2xl border-3 border-black bg-gradient-to-br from-[#FDBB30]/30 via-white to-brand-green/25 p-10 shadow-xl section-border-pink">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-brand-green px-4 py-3 shadow-md">
              <span className="text-2xl">🎁</span>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-black">Referrals</span>
            </div>
            <h2 className="text-2xl font-bold text-brand-black leading-tight">
              Refer the crew, fund your spice locker.
            </h2>
            <p className="text-sm leading-relaxed text-brand-black/70">
              Share your personalised code to gift £10 off first orders. Every successful referral loads 500
              points into your balance to spend on sides, desserts, or shipping upgrades.
            </p>
          </div>
          
          <div className="relative overflow-hidden rounded-xl border-3 border-black bg-white p-6 shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-[#FDBB30]/30 blur-2xl" />
            
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black/50">Points balance</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-[#FDBB30]">1,250</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDBB30] text-sm">
                    ⭐
                  </div>
                </div>
              </div>
              
              <div className="h-px w-full bg-black/10" />
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-black/50">
                  Rewards unlocked
                </span>
                <div className="rounded-full border-2 border-black bg-brand-green px-4 py-1.5 text-xs font-bold text-brand-black shadow-sm">
                  Free samosa trio
                </div>
              </div>
            </div>
          </div>
          
          <Button size="lg" className="w-full bg-[#FDBB30] text-brand-black hover:bg-[#FDBB30]/90 border-2 border-black shadow-md">
            Join the referral circle
          </Button>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border-3 border-black bg-[#FDBB30] px-12 py-14 shadow-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-coral/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-green/30 blur-3xl" />
        
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-3 shadow-md">
              <span className="text-2xl">🎉</span>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-black">Join the crew</span>
            </div>
            <h2 className="text-4xl font-bold text-brand-black lg:text-[42px]">
              Earn rewards with every order, unlock exclusive drops.
            </h2>
            <p className="text-lg leading-relaxed text-brand-black/80">
              Build points, share the love, and get access to limited chef specials and supper club invites.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button size="lg" className="border-2 border-black bg-brand-coral px-8 py-6 text-base font-bold text-brand-black shadow-md transition-all hover:scale-[1.02] hover:bg-brand-coral/90" asChild>
              <Link href="/builder">Start earning points</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-black bg-white px-8 py-6 text-base font-bold text-brand-black shadow-md transition-all hover:scale-[1.02]" asChild>
              <Link href="/auth/login">View my rewards</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


