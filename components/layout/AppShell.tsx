import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScrolling } from "@/components/providers/SmoothScrolling";
import { DeferredClientWidgets } from "@/components/utils/DeferredClientWidgets";
import { ScrollbarTheme } from "@/components/utils/ScrollbarTheme";
import { PageTransition } from "@/components/utils/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/schemas";
import type { Locale } from "@/lib/i18n/locale";

/**
 * Wspólny szkielet <html>/<body> dla OBU root layoutów (app/(pl) i app/(en)).
 * Route groups z dwoma root layoutami to jedyny sposób na poprawny <html lang>
 * per język w statycznym exporcie (root layout nie zna pathname przy SSG).
 * Metadata/viewport zostają w layoutach grup - tu tylko struktura.
 */

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

export function AppShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className="dark bg-[#050505]" suppressHydrationWarning>
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
