import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Porozmawiajmy o Twoim Projekcie. Niezależnie od etapu, chętnie doradzimy i zamienimy Twoją wizję w działający produkt.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}