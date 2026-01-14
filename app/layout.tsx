import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer"; // <--- NOWY IMPORT
import { SmoothScrolling } from "@/components/providers/SmoothScrolling";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://avenly.pl'),
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
            
            {/* Main wrapper dla semantyki i struktury */}
            <main className="relative flex flex-col min-h-screen">
                {children}
            </main>
            
            <Footer /> {/* <--- STOPKA DODANA TUTAJ */}
        </SmoothScrolling>
      </body>
    </html>
  );
}