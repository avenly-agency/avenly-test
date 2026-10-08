import type { Metadata } from "next";
import { i18nAlternates } from "@/lib/i18n/locale";
import { CONTACT } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Contact - free consultation and website quote",
  description: `Get in touch with Avenly. A free consultation and a project quote within 24 hours. Email: ${CONTACT.email}, phone: ${CONTACT.phoneDisplay}. Websites, online stores and AI chatbots.`,
  alternates: i18nAlternates("/kontakt", "en"),
  keywords: [
    "contact Avenly",
    "free website consultation",
    "website quote",
    "AI chatbot quote",
  ],
  openGraph: {
    title: "Contact - Avenly - free consultation, reply within 24 h",
    description:
      "Tell us about your project. A no-obligation quote and a reply within 24 hours. Email, phone or the contact form.",
    url: "/en/contact/",
    type: "website",
    locale: "en_US",
    siteName: "Avenly",
    // The page-level openGraph block REPLACES the root layout one (Next does not merge them), so the image goes here.
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Avenly - interactive agency", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Avenly",
    description: "Free consultation and a project quote within 24 hours.",
    images: ["/og-default.png"],
  },
};

export default function ContactLayoutEn({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
