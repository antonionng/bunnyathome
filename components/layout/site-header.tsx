import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#boxes", label: "Boxes" },
  { href: "#community", label: "Community" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-white shadow-md">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10 xl:px-16">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="BunnyAtHome"
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-ink md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-brand-curry"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-gray-50 md:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/builder"
            className="rounded-full border-2 border-black bg-brand-coral px-4 py-2 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            Build your box
          </Link>
        </div>
      </div>
    </header>
  );
}

