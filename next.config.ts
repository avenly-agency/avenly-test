import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1. Obsługa zewnętrznych domen (np. Unsplash, którego używasz w Portfolio)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // 2. 👇 FIX DLA TWOJEGO BŁĘDU W KONSOLI:
    // Definiujemy dozwolone wartości jakości. 
    // 60 - to ta, którą wymusiliśmy na mobile.
    // 75 - to domyślna wartość Next.js (musimy ją dodać, żeby reszta zdjęć działała).
    qualities: [60, 75],
  },
};

export default nextConfig;