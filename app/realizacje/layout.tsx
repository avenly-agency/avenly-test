import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Realizacje - Portfolio Stron WWW, Sklepów i Chatbotów AI",
  description:
    "Zobacz realizacje Avenly: strony WWW, sklepy internetowe, chatboty AI i panele klienta. Każdy projekt to rozwiązany problem biznesowy - case studies z konkretnymi efektami.",
  alternates: { canonical: "/realizacje" },
  keywords: [
    "portfolio Avenly",
    "realizacje agencji",
    "case study strona WWW",
    "wdrożenia chatbot AI",
    "realizacje sklep internetowy",
    "przykłady stron WWW",
  ],
  openGraph: {
    title: "Realizacje - Portfolio Avenly",
    description:
      "Dowód, nie obietnice. Realizacje, które zarabiają dla naszych klientów - strony, sklepy i automatyzacje AI.",
    url: "/realizacje",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realizacje Avenly",
    description: "Portfolio stron WWW, sklepów i chatbotów AI.",
  },
};

export default function RealizationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
