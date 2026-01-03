import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar"; // Import Navbara

const inter = Inter({ subsets: ["latin"] });

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
      {/* Dodaj suppressHydrationWarning również do body, jeśli błąd dotyczy body */}
      <body 
        className={`${inter.className} bg-black text-white antialiased`}
        suppressHydrationWarning={true} 
      >
        <Navbar />
        {children}
      </body>
    </html>
  );}