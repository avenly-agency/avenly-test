import type { Metadata } from "next";
import { ServicePageSchema } from "@/components/seo/ServicePageSchema";

const SERVICE = {
  name: "Projektowanie UI/UX",
  description:
    "Projektujemy interfejsy UI/UX oparte na psychologii i badaniach, które maksymalizują konwersję. Sprawdzona architektura ścieżki użytkownika i nowoczesny design w jednym pakiecie.",
  path: "/uslugi/design/ui-ux",
};

export const metadata: Metadata = {
  title: "Projektowanie UI/UX | Interfejsy, Które Sprzedają",
  description:
    "Użytkownicy uciekają z Twojej strony? Projektujemy interfejsy UI/UX oparte na psychologii i badaniach, które maksymalizują konwersję. Figma, prototypy, design system - zobacz jak to robimy!",
  alternates: { canonical: SERVICE.path },
  keywords: ["projektowanie UI", "projektowanie UX", "agencja UI/UX", "design strony WWW", "Figma Polska", "design system", "wycena projektu UI"],
  openGraph: {
    title: "Projektowanie UI/UX - Avenly",
    description: SERVICE.description,
    url: SERVICE.path,
    type: "website",
  },
};

export default function UiUxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Design & UI/UX"
        categoryPath="/uslugi/design"
        serviceType="UI/UX Design"
      />
      {children}
    </>
  );
}
