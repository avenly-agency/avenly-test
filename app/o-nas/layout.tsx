import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema, breadcrumbSchema } from "@/lib/schemas";
import { FAQS } from "./faq-data";

export const metadata: Metadata = {
  title: "O Avenly - Polska Agencja Interaktywna · Web, AI, Marketing",
  description:
    "Poznaj Avenly - polską agencję interaktywną. Łączymy strategię biznesową z technologią (Next.js, AI, automatyzacje), tworząc strony i systemy które realnie wspierają sprzedaż. Sprawdź nasze kompetencje, proces i odpowiedzi na częste pytania.",
  alternates: { canonical: "/o-nas" },
  keywords: [
    "agencja interaktywna",
    "agencja stron internetowych",
    "agencja marketingowa Polska",
    "agencja Next.js",
    "agencja AI",
    "Avenly o nas",
    "zespół Avenly",
  ],
  openGraph: {
    title: "O Avenly - Polska Agencja Interaktywna",
    description:
      "Strategia, design, kod i AI w jednym miejscu. Poznaj zespół który zamienia Twój potencjał w realne wyniki online.",
    url: "/o-nas",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "O Avenly - Agencja Interaktywna",
    description: "Strategia · Design · Web · AI",
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
