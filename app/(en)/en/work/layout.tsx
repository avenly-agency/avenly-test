import type { Metadata } from "next";
import { i18nAlternates } from "@/lib/i18n/locale";

export const metadata: Metadata = {
  title: "Work - websites, online stores and an AI assistant",
  description:
    "Websites, an online store with a management panel, a club app and an AI assistant. Real websites of real businesses that you can open and check.",
  alternates: i18nAlternates("/realizacje", "en"),
  keywords: [
    "Avenly portfolio",
    "web agency work",
    "website case study",
    "online store portfolio",
    "AI assistant on a website",
    "website examples",
  ],
  openGraph: {
    title: "Work - Avenly portfolio",
    description:
      "Proof, not promises. Websites, a store and an AI assistant that work every day for real businesses.",
    url: "/en/work/",
    type: "website",
    locale: "en_US",
    siteName: "Avenly",
    // The page-level openGraph block REPLACES the root layout one (Next does not merge them), so the image goes here.
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Avenly - interactive agency", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avenly work",
    description: "Proof, not promises. Websites, a store and an AI assistant that work every day for real businesses.",
    images: ["/og-default.png"],
  },
};

export default function RealizationsLayoutEn({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
