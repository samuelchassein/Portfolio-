import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dossier de build séparé possible (ex. rendus 3D longs sur une version
  // compilée pendant que le serveur de développement tourne).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    // Tailles générées ; next/image ne produit jamais plus large que la source.
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560, 3200],
    imageSizes: [160, 240, 320, 480],
    qualities: [75, 85, 90],
  },
};

export default nextConfig;
