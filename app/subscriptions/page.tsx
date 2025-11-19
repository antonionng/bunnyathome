import Link from "next/link";
import { Button } from "@/components/ui/button";

const subscriptionTiers = [
  {
    name: "Weekly Ritual",
    price: "£49/box",
    perks: ["Feeds 2-3", "Swap curries anytime", "Pause or skip instantly"],
    accent: "brand-coral",
    bgColor: "bg-brand-coral",
    bgTint: "bg-brand-coral/20",
    icon: "⚡",
  },
  {
    name: "Flexi Feast",
    price: "£55/box",
    perks: ["Two boxes monthly", "Seasonal chef specials", "Complimentary dessert add-on"],
    accent: "brand-curry",
    bgColor: "bg-[#FDBB30]",
    bgTint: "bg-[#FDBB30]/20",
    icon: "🎯",
  },
  {
    name: "Family Table",
    price: "£79/box",
    perks: ["Feeds 4-5", "Kid-friendly spice options", "Free delivery every 3rd box"],
    accent: "brand-green",
    bgColor: "bg-brand-green",
    bgTint: "bg-brand-green/20",
    icon: "👨‍👩‍👧‍👦",
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="space-y-16">
      <section className="space-y-10 rounded-2xl border-3 border-black bg-gradient-to-br from-brand-curry/30 via-white to-brand-blue/25 p-10 shadow-xl section-border-curry">
        <div className="flex flex-col gap-3 text-center">
          <span className="tag-pill mx-auto w-fit bg-[#FDBB30] text-brand-black">Subscriptions</span>
          <h1 className="text-3xl font-bold text-ink">Choose the cadence that fits your fam.</h1>
          <p className="mx-auto max-w-2xl text-base text-ink-muted">
            Each plan keeps the spice locker stocked and lets you reschedule, pause, or swap curries in two
            taps.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {subscriptionTiers.map((tier) => (
            <div
              key={tier.name}
              className={`group relative flex flex-col overflow-hidden rounded-xl border-3 border-black shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl ${tier.bgTint}`}
            >
              <div className={`absolute right-0 top-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full ${tier.bgColor} opacity-20 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-40`} />
              
              <div className="relative p-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black ${tier.bgColor} text-2xl shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      {tier.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-brand-black leading-tight">{tier.name}</h2>
                  </div>
                  <div className={`rounded-full border-2 border-black px-5 py-2 ${tier.bgColor} shadow-md transition-transform duration-300 group-hover:scale-105`}>
                    <span className="text-base font-black text-brand-black">{tier.price}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 text-sm text-brand-black/80">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3">
                      <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-black ${tier.bgColor} text-xs font-bold text-brand-black`}>
                        ✓
                      </span>
                      <span className="leading-tight">{perk}</span>
                    </li>
                  ))}
                </ul>
                
                <div className={`h-1 w-16 rounded-full ${tier.bgColor} transition-all duration-300 group-hover:w-full`} />
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={`mt-4 w-full border-2 border-black text-brand-black transition-all hover:scale-[1.02] ${tier.bgColor}`}
                  asChild
                >
                  <Link href="/builder">Preview upcoming boxes</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border-3 border-black bg-[#FDBB30] px-12 py-14 shadow-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-coral/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-green/30 blur-3xl" />
        
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-3 shadow-md">
              <span className="text-2xl">📅</span>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-black">Flexible Plans</span>
            </div>
            <h2 className="text-4xl font-bold text-brand-black lg:text-[42px]">
              Never commit forever — pause, skip, or swap anytime.
            </h2>
            <p className="text-lg leading-relaxed text-brand-black/80">
              All plans come with full flexibility. Change your delivery schedule, swap curries, or pause whenever life gets busy.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button size="lg" className="border-2 border-black bg-brand-coral px-8 py-6 text-base font-bold text-brand-black shadow-md transition-all hover:scale-[1.02] hover:bg-brand-coral/90" asChild>
              <Link href="/builder">Start a subscription</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-black bg-white px-8 py-6 text-base font-bold text-brand-black shadow-md transition-all hover:scale-[1.02]" asChild>
              <Link href="/boxes">Browse boxes first</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


