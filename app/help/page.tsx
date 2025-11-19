import Link from "next/link";
import { TrackOrderForm } from "@/components/help/track-order-form";

const supportChannels = [
  {
    label: "Help centre",
    description: "Delivery FAQs, ingredient swaps, and prep videos refreshed weekly.",
    href: "#support",
    accentClass: "bg-brand-coral/40",
    external: false,
  },
  {
    label: "WhatsApp concierge",
    description: "Message Sipho’s crew for live box edits (9am–10pm) on +44 7700 900000.",
    href: "https://wa.me/447700900000",
    accentClass: "bg-brand-green/30",
    external: true,
  },
  {
    label: "Track your order",
    description: "Drop your order ID below to see courier ETAs and proof-of-delivery.",
    href: "#track",
    accentClass: "bg-brand-blue/30",
    external: false,
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-12">
      <section
        id="help"
        className="grid gap-10 rounded-2xl border-3 border-black bg-gradient-to-br from-brand-green/30 via-white to-brand-blue/20 p-10 shadow-xl section-border-green lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="tag-pill w-fit bg-brand-green text-brand-black">Help & Track</span>
            <h1 className="text-3xl font-bold text-ink md:text-4xl">
              Answers, humans, and tracking links when you need them.
            </h1>
            <p className="max-w-2xl text-base text-ink-muted">
              Our crew keeps tabs on every courier leg, sends prep refreshers, and picks up WhatsApp calls so
              you’re never guessing where dinner is.
            </p>
          </div>
          <div
            id="track"
            className="space-y-4 rounded-2xl border-3 border-black bg-white/80 p-6 shadow-xl backdrop-blur"
          >
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-ink">Track an order</h2>
              <p className="text-sm text-ink-muted">
                Pop in the order ID from your confirmation email to jump to the live courier timeline.
              </p>
            </div>
            <TrackOrderForm />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-muted">
              Example format: BUNNY-4821-LDN
            </p>
          </div>
        </div>
        <div id="support" className="space-y-4">
          {supportChannels.map((channel) => (
            <Link
              key={channel.label}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noreferrer" : undefined}
              className="block rounded-2xl border-3 border-black bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="space-y-2">
                <span
                  className={`inline-flex items-center rounded-full border-2 border-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-black ${channel.accentClass}`}
                >
                  {channel.external ? "External" : "In-app"}
                </span>
                <h2 className="text-xl font-bold text-ink">{channel.label}</h2>
                <p className="text-sm leading-relaxed text-ink-muted">{channel.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}



