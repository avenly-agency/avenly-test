import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrolling } from "@/components/providers/SmoothScrolling";
import { LifecycleManager } from "@/components/utils/LifecycleManager";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://avenly.pl'),
  // 1. ZMIANA: Konfiguracja dynamicznych tytułów
  title: {
    default: "Avenly - Agencja Interaktywna", // Tytuł strony głównej
    template: "%s | Avenly" // Szablon dla podstron (np. "Kontakt | Avenly")
  },
  description: "Zyskaj stronę, która pracuje na Twój sukces 24/7. W Avenly bierzemy na siebie strategię, teksty i design, byś Ty mógł zająć się rozwojem firmy. Sprawdź nasze efekty!",
  icons: {
    icon: '/icon.png', 
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="dark" suppressHydrationWarning>
      <body 
        className={`${inter.className} bg-[#050505] text-white antialiased`}
        suppressHydrationWarning={true} 
      >
        <SmoothScrolling>
            
            <LifecycleManager /> 
            
            <Navbar />
            
            {/* 2. ZMIANA: To jest Twój główny tag <main>. 
                Skoro podstrony go nie mają, musi być tutaj.
                Zapewnia to poprawną strukturę semantyczną HTML. 
            */}
            <main className="relative flex flex-col min-h-screen">
                {children}
            </main>
            
            <Footer />
            
        </SmoothScrolling>
      </body>
    </html>
  );
}