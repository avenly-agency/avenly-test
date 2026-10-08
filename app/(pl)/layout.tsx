import type { Metadata, Viewport } from "next";
import "../globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { SITE } from "@/lib/seo-data";
import { i18nAlternates } from "@/lib/i18n/locale";

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
  alternates: i18nAlternates('/', 'pl'),
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
  return <AppShell locale="pl">{children}</AppShell>;
}
