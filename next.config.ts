import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',

  // Zmienia strukturę plików z "strona.html" na "strona/index.html"
  // (kluczowe dla pretty URLs na statycznym hostingu)
  trailingSlash: true,

  images: {
    unoptimized: true, // wymagane przy output: 'export'
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Wyłączenie nagłówka "x-powered-by: Next.js" (minor security + drobny perf signal)
  poweredByHeader: false,

  // Compress responses (Hostinger i tak ma własną kompresję, ale flaga jest defensywna)
  compress: true,

  // React strict mode — wykrywa potencjalne problemy w dev (bez wpływu na produkcję)
  reactStrictMode: true,
};

export default nextConfig;
