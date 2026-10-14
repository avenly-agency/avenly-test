import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema, breadcrumbSchema } from "@/lib/schemas";
import { i18nAlternates } from "@/lib/i18n/locale";
import { FAQS } from "./faq-data";

// Głos „my” (jedyny wyjątek od głosu korzyści - PRODUCT.md). Opis z tego, co jest na podstronie w każdym układzie:
// kim jesteśmy, co robimy, częste pytania. Zdanie openGraph = opis pod nagłówkiem podstrony (lib/i18n/o-nas.ts).
export const metadata: Metadata = {
  title: "O nas - polska agencja interaktywna",
  description:
    "Avenly to polska agencja interaktywna. Projektujemy i piszemy strony WWW, sklepy internetowe, systemy CRM i chatboty AI. Zobacz, dla kogo i jak pracujemy.",
  alternates: i18nAlternates("/o-nas", "pl"),
  keywords: [
    "agencja interaktywna",
    "agencja stron internetowych",
    "agencja Next.js",
    "agencja AI",
    "Avenly o nas",
    "zespół Avenly",
  ],
  // Blok openGraph strony ZASTĘPUJE blok z root layoutu (Next go nie łączy) - dlatego podany w całości (adres, typ, obrazek).
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Avenly",
    url: "/o-nas/",
    title: "O Avenly - polska agencja interaktywna",
    description:
      "Jesteśmy agencją interaktywną z Polski. Projektujemy i piszemy strony internetowe, sklepy, systemy CRM i chatboty AI.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Avenly - agencja interaktywna", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "O Avenly - polska agencja interaktywna",
    description: "Jesteśmy agencją interaktywną z Polski. Projektujemy i piszemy strony internetowe, sklepy, systemy CRM i chatboty AI.",
    images: ["/og-default.png"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd id="ld-faq" data={faqPageSchema([...FAQS])} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Avenly', url: '/' },
          { name: 'O nas', url: '/o-nas' },
        ])}
      />
      {children}
    </>
  );
}
