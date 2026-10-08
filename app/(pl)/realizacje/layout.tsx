import type { Metadata } from "next";
import { i18nAlternates } from "@/lib/i18n/locale";

export const metadata: Metadata = {
  title: "Realizacje - strony WWW, sklepy internetowe i asystent AI",
  description:
    "Strony WWW, sklep internetowy z panelem, aplikacja klubowa i asystent AI. Prawdziwe strony prawdziwych firm, które możesz otworzyć i sprawdzić.",
  alternates: i18nAlternates("/realizacje", "pl"),
  keywords: [
    "portfolio Avenly",
    "realizacje agencji",
    "case study strona WWW",
    "realizacje sklep internetowy",
    "asystent AI na stronie",
    "przykłady stron WWW",
  ],
  openGraph: {
    title: "Realizacje - portfolio Avenly",
    description:
      "Dowód, nie obietnice. Strony, sklep i asystent AI, które działają na co dzień dla prawdziwych firm.",
    url: "/realizacje/",
    type: "website",
    locale: "pl_PL",
    siteName: "Avenly",
    // Blok openGraph strony ZASTĘPUJE blok z root layoutu (Next go nie łączy) - obrazek trzeba podać tutaj.
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Avenly - agencja interaktywna", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Realizacje Avenly",
    description: "Dowód, nie obietnice. Strony, sklep i asystent AI, które działają na co dzień dla prawdziwych firm.",
    images: ["/og-default.png"],
  },
};

export default function RealizationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
