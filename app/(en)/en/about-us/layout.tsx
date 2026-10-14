import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema, breadcrumbSchema } from "@/lib/schemas";
import { i18nAlternates } from "@/lib/i18n/locale";
import { oNasDict } from "@/lib/i18n/o-nas";

// "We" voice (the only exception to the benefit voice - PRODUCT.md). The openGraph sentence is the lead under the
// page heading (lib/i18n/o-nas.ts).
export const metadata: Metadata = {
  title: "About us - an interactive agency from Poland",
  description:
    "Avenly is an interactive agency from Poland. We design and build websites, online stores, CRM systems and AI chatbots. See who we work for and how.",
  alternates: i18nAlternates("/o-nas", "en"),
  keywords: [
    "interactive agency",
    "web design agency",
    "Next.js agency",
    "AI agency",
    "Avenly about us",
    "Avenly team",
  ],
  // The page-level openGraph block REPLACES the root layout one (Next does not merge them), so it is given in full.
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Avenly",
    url: "/en/about-us/",
    title: "About Avenly - an interactive agency from Poland",
    description:
      "We are an interactive agency from Poland. We design and build websites, online stores, CRM systems and AI chatbots.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Avenly - interactive agency", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Avenly - an interactive agency from Poland",
    description: "We are an interactive agency from Poland. We design and build websites, online stores, CRM systems and AI chatbots.",
    images: ["/og-default.png"],
  },
};

export default function AboutLayoutEn({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd id="ld-faq" data={faqPageSchema(oNasDict.en.faq)} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Avenly', url: '/en/' },
          { name: 'About us', url: '/en/about-us' },
        ])}
      />
      {children}
    </>
  );
}
