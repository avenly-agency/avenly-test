import type { Metadata, Viewport } from "next";
import "../globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { SITE } from "@/lib/seo-data";
import { i18nAlternates } from "@/lib/i18n/locale";

// Tytuł i opis strony głównej (root layout = metadane `/`), wybór właściciela 2026-10-13: tytuł mówi, kim jesteśmy
// (do 60 znaków), opis daje każdej usłudze własną korzyść. Sentence case, bez „Marketingu” (nie ma go w ofercie) - PRODUCT.md.
const HOME_TITLE = "Avenly - agencja interaktywna. Strony WWW, sklepy i AI";
const HOME_SHARE_TITLE = "Avenly - strony WWW, sklepy internetowe i chatboty AI";
const HOME_DESCRIPTION =
  "Od strony WWW po system, który porządkuje pracę firmy. Sklep, który sprzedaje, gdy odpoczywasz. Chatbot AI, który odpowiada całą dobę. Bezpłatna konsultacja.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: HOME_TITLE,
    template: "%s | Avenly",
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  generator: 'Next.js',
  keywords: [
    'agencja interaktywna',
    'tworzenie stron internetowych',
    'strony WWW',
    'strona firmowa',
    'strona one-page',
    'sklep internetowy',
    'system CRM',
    'chatbot AI',
    'automatyzacja AI',
    'Next.js',
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
    title: HOME_SHARE_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Avenly - agencja interaktywna',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SHARE_TITLE,
    description: HOME_DESCRIPTION,
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
