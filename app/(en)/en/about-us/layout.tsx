import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema, breadcrumbSchema } from "@/lib/schemas";
import { i18nAlternates } from "@/lib/i18n/locale";
import { oNasDict } from "@/lib/i18n/o-nas";

export const metadata: Metadata = {
  title: "About Avenly - Polish interactive agency · Web, AI, Marketing",
  description:
    "Get to know Avenly, a Polish interactive agency. We combine business strategy with technology (Next.js, AI, automation) to build websites and systems that genuinely support sales. See our capabilities, process and answers to common questions.",
  alternates: i18nAlternates("/o-nas", "en"),
  keywords: [
    "interactive agency",
    "web design agency",
    "marketing agency Poland",
    "Next.js agency",
    "AI agency",
    "Avenly about us",
    "Avenly team",
  ],
  openGraph: {
    title: "About Avenly - Polish interactive agency",
    description:
      "Strategy, design, code and AI in one place. Meet the team that turns your potential into real online results.",
    url: "/en/about-us",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Avenly - interactive agency",
    description: "Strategy · Design · Web · AI",
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
