import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScrolling } from "@/components/providers/SmoothScrolling"; // IMPORT


const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // To jest kluczowe dla Lighthouse!
  variable: '--font-inter',
});


export const metadata: Metadata = {
  title: "Avenly Agency",
  description: "High-Performance Web & AI Automation",
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
        {/* WRAPPER LENIS - CAŁA STRONA PŁYWA */}
        <SmoothScrolling>
            <Navbar />
            {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}