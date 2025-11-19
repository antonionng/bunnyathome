import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast-provider";
import { CartSyncHandler } from "@/components/cart/cart-sync-handler";
import { RecentOrdersFeed } from "@/components/social/recent-orders-feed";
import { RegisterServiceWorker } from "@/components/pwa/register-sw";
import { InstallPrompt } from "@/components/pwa/install-prompt";
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BunnyAtHome",
  },
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

export const viewport = {
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-ink antialiased`}
      >
        <ToastProvider>
          <RegisterServiceWorker />
          <CartSyncHandler />
          <RecentOrdersFeed />
          <InstallPrompt />
          <div className="relative min-h-screen overflow-x-hidden">
            <SiteHeader />
            <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[1400px] flex-1 flex-col gap-16 px-6 pb-28 pt-20 md:pt-24 lg:pt-28 lg:px-10 xl:px-16">
              {children}
            </main>
            <SiteFooter />
          </div>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
