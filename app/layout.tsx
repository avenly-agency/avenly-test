import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScrolling } from "@/components/providers/SmoothScrolling";
import { DeferredClientWidgets } from "@/components/utils/DeferredClientWidgets";
import { ScrollbarTheme } from "@/components/utils/ScrollbarTheme";
import { PageTransition } from "@/components/utils/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/schemas";
import { SITE } from "@/lib/seo-data";

// Footer: dynamic z SSR (widoczny w pre-rendered HTML dla SEO, ale kod jest osobnym chunkiem
// - nie blokuje initial JS parsing, hydratuje się leniwie gdy user scrolla do dolnej części strony)
const Footer = dynamic(() => import("@/components/layout/Footer").then((m) => m.Footer));

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  style: ['normal'], // pomijamy italic (-66KiB woff2, italic używany tylko 1× w blogu)
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Avenly - Agencja Interaktywna · Strony WWW, AI i Marketing",
    template: "%s | Avenly",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  generator: 'Next.js',
  keywords: [
    'agencja interaktywna',
    'strony WWW',
    'tworzenie stron internetowych',
    'chatbot AI',
    'automatyzacja AI',
    'strona firmowa',
    'Next.js',
    'sklepy internetowe',
    'WooCommerce',
    'UI/UX design',
    'SEO',
    'Avenly',
  ],
  category: 'technology',
  alternates: {
    canonical: '/',
    languages: { 'pl-PL': '/' },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: SITE.url,
    siteName: SITE.name,
    title: 'Avenly - Agencja Interaktywna · Strony WWW, AI i Marketing',
    description: SITE.description,
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Avenly - Agencja Interaktywna',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avenly - Agencja Interaktywna',
    description: SITE.shortDescription,
    images: ['/og-default.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon-32.png',
  },
  manifest: '/manifest.webmanifest',
  verification: {
    // TODO: po założeniu Google Search Console wklej tu kod weryfikacyjny
    // google: 'TWÓJ-KOD-WERYFIKACJI-GSC',
    // TODO: po założeniu Bing Webmaster Tools
    // other: { 'msvalidate.01': 'KOD-BING' },
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="dark bg-[#050505]" suppressHydrationWarning>
      <head>
        {/* Preconnect tylko dla Supabase - udokumentowane 300ms LCP savings (chatbot config fetch przy mount).
            n8n i Unsplash dostają tylko dns-prefetch (są używane po interakcji usera - preconnect timeoutuje). */}
        <link rel="preconnect" href="https://kyfsjvgixmcmafvaiyak.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://n8n.avenly.pl" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Globalne JSON-LD: Organization + ProfessionalService + WebSite - widoczne na każdej stronie */}
        <JsonLd id="ld-organization" data={organizationSchema()} />
        <JsonLd id="ld-localbusiness" data={localBusinessSchema()} />
        <JsonLd id="ld-website" data={websiteSchema()} />
      </head>
      <body
        className={`${inter.className} bg-[#050505] text-white antialiased`}
        suppressHydrationWarning={true}
      >
        <SmoothScrolling>

            <ScrollbarTheme />
            <Navbar />

            {/* Główny tag <main> - podstrony są dziećmi tego elementu, zapewnia poprawną strukturę semantyczną HTML */}
            <main className="relative flex flex-col min-h-dvh">
                <PageTransition>{children}</PageTransition>
            </main>

            <Footer />

            {/* Chatbot + LifecycleManager: lazy-loaded po hydration, NIE blokują LCP */}
            <DeferredClientWidgets />

        </SmoothScrolling>
      </body>
    </html>
  );
}
