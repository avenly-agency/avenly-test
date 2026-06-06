import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt - Darmowa Wycena Strony WWW i Chatbota AI",
  description:
    "Skontaktuj się z Avenly. Bezpłatna konsultacja i wycena projektu w 24h. Email: kontakt@avenly.pl · Tel: +48 668 124 367 · Pon-Pt 9:00-17:00. Strony WWW, chatboty AI, sklepy internetowe.",
  alternates: { canonical: "/kontakt" },
  keywords: [
    "kontakt Avenly",
    "darmowa wycena strony",
    "wycena chatbota AI",
    "konsultacja agencja interaktywna",
    "kontakt agencja stron WWW",
  ],
  openGraph: {
    title: "Kontakt - Avenly · Darmowa Konsultacja w 24h",
    description:
      "Porozmawiajmy o Twoim projekcie. Wycena bez zobowiązań, odpowiedź w 24h. Email · Telefon · Formularz.",
    url: "/kontakt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt - Avenly",
    description: "Darmowa konsultacja i wycena projektu w 24h.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
