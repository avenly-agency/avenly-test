import type { Metadata } from "next";
import { i18nAlternates } from "@/lib/i18n/locale";
import { CONTACT } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Kontakt - bezpłatna konsultacja i wycena strony WWW",
  description: `Skontaktuj się z Avenly. Bezpłatna konsultacja i wycena projektu w 24 godziny. E-mail: ${CONTACT.email}, telefon: ${CONTACT.phoneDisplay}. Strony WWW, sklepy internetowe i chatboty AI.`,
  alternates: i18nAlternates("/kontakt", "pl"),
  keywords: [
    "kontakt Avenly",
    "bezpłatna konsultacja strona internetowa",
    "wycena strony WWW",
    "wycena chatbota AI",
    "kontakt agencja stron WWW",
  ],
  openGraph: {
    title: "Kontakt - Avenly · bezpłatna konsultacja, odpowiedź w 24 h",
    description:
      "Opowiedz o swoim projekcie. Wycena bez zobowiązań i odpowiedź w 24 godziny. E-mail, telefon albo formularz.",
    url: "/kontakt/",
    type: "website",
    locale: "pl_PL",
    siteName: "Avenly",
    // Blok openGraph strony ZASTĘPUJE blok z root layoutu (Next go nie łączy) - obrazek trzeba podać tutaj.
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Avenly - agencja interaktywna", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt - Avenly",
    description: "Bezpłatna konsultacja i wycena projektu w 24 godziny.",
    images: ["/og-default.png"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
