import type { Metadata, Viewport } from "next";
import "../globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { SITE } from "@/lib/seo-data";
import { i18nAlternates } from "@/lib/i18n/locale";

// Home page title and description (the root layout is the metadata of `/en/`): hero headline + services on offer +
// the defensible facts from the proof line. Sentence case, no "Marketing" (not on offer) - PRODUCT.md.
const HOME_TITLE_EN = "Avenly - interactive agency. Websites, online stores and AI";
const HOME_SHARE_TITLE_EN = "Avenly - websites, online stores and AI chatbots";
const SITE_DESCRIPTION_EN =
  'From a website to a system that keeps your business in order. A store that sells while you rest. An AI chatbot that answers around the clock. Free consultation.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: HOME_TITLE_EN,
    template: "%s | Avenly",
  },
  description: SITE_DESCRIPTION_EN,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  generator: 'Next.js',
  keywords: [
    'interactive agency',
    'web design agency Poland',
    'website development',
    'company website',
    'one page website',
    'online store',
    'CRM system',
    'AI chatbot',
    'AI automation',
    'Next.js',
    'Avenly',
  ],
  category: 'technology',
  alternates: i18nAlternates('/', 'en'),
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
    locale: 'en_US',
    url: `${SITE.url}/en/`,
    siteName: SITE.name,
    title: HOME_SHARE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Avenly - interactive agency',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SHARE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
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
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayoutEn({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell locale="en">{children}</AppShell>;
}
