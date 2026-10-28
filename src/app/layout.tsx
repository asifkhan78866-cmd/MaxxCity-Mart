import type { Metadata, Viewport } from "next";
import { Figtree, Outfit } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { ConsentBanner } from "@/components/layout/consent-banner";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/content/site";
import { defaultOgImage, organizationJsonLd, siteUrl, websiteJsonLd } from "@/lib/seo";
import { publicEnv } from "@/lib/config/public-env";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ₹99 Fixed-Price Variety Store in Adilabad`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    images: [defaultOgImage],
  },
  twitter: { card: "summary_large_image" },
  verification: publicEnv.googleSiteVerification ? { google: publicEnv.googleSiteVerification } : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${figtree.variable} ${outfit.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileActionBar />
        <ConsentBanner />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
