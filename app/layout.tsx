import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BunnyAtHome | Durban bunny chow, delivered in the UK",
  description:
    "Premium Durban curry meal kits with customizable spice levels, sides, and drinks. Ready in 20 minutes.",
  metadataBase: new URL("https://bunnyathome.co.uk"),
  openGraph: {
    title: "BunnyAtHome | Durban bunny chow, delivered in the UK",
    description:
      "Premium Durban curry meal kits with customizable spice levels, sides, and drinks.",
    url: "https://bunnyathome.co.uk",
    siteName: "BunnyAtHome",
  },
  twitter: {
    card: "summary_large_image",
    title: "BunnyAtHome",
    description:
      "Durban-born, UK-made curry meal kits ready in under 20 minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[var(--background)] text-ink antialiased`}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(250,184,38,0.22),_transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_20%_80%,_rgba(215,173,204,0.15),_transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 -z-40 bg-[linear-gradient(180deg,_rgba(255,255,255,0.7)_0%,_rgba(255,248,234,0.9)_30%,_rgba(255,244,224,1)_100%)]" />
          <SiteHeader />
          <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[1400px] flex-1 flex-col gap-16 px-6 pb-28 pt-20 md:pt-24 lg:pt-28 lg:px-10 xl:px-16">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
