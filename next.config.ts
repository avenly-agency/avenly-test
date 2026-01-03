import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // To generuje statyczny HTML na Hostingera
  images: {
    unoptimized: true, // Wyłącza serwer obrazków (nie działa na Hostingerze)
  },
};

export default nextConfig;