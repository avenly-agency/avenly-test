import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projektowanie UI/UX | Interfejsy, które sprzedają",
  description: "Użytkownicy uciekają z Twojej strony? Projektujemy interfejsy UI/UX oparte na psychologii i badaniach, które maksymalizują konwersję. Zobacz jak to robimy!",
};

export default function UiUxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}