import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dossier de build séparé possible (ex. rendus 3D longs sur une version
  // compilée pendant que le serveur de développement tourne).
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
