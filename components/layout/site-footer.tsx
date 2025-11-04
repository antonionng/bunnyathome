import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  product: [
    { label: "Custom Builder", href: "/builder" },
    { label: "Featured Boxes", href: "#boxes" },
    { label: "Subscriptions", href: "#subscriptions" },
  ],
  company: [
    { label: "Our Story", href: "#experience" },
    { label: "Sourcing", href: "#sourcing" },
    { label: "Community", href: "#community" },
  ],
  connect: [
    { label: "hello@bunnyathome.co.uk", href: "mailto:hello@bunnyathome.co.uk" },
    { label: "@bunnyathome", href: "https://instagram.com" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-brand-black text-white">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Image 
            src="/logo.png" 
            alt="BunnyAtHome" 
            width={120} 
            height={40}
            className="h-10 w-auto"
          />
          <p className="max-w-xs text-sm text-white/70">
            Durban-born, UK-made. Premium bunny chow kits, ready in 20 minutes.
          </p>
        </div>
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-curry">
              {category}
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} BunnyAtHome. All rights reserved.
      </div>
    </footer>
  );
}

