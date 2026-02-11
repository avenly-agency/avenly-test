import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nas",
  description: "Dowiedz się więcej o naszej agencji i tym, czym się zajmujemy.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}