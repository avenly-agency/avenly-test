import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Realizacje",
  description: "Zobacz nasze realizacje i dowiedz się, jak pomagamy klientom osiągać sukces online.",
};

export default function RealizationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}