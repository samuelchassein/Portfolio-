import localFont from "next/font/local";

/** Serif des titres et du wordmark (proche du « SENSA » du logo). */
export const serif = localFont({
  variable: "--font-serif",
  display: "swap",
  src: [
    { path: "../public/fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../public/fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  fallback: ["Garamond", "Times New Roman", "serif"],
});

/** Sans-serif géométrique : petites capitales espacées et texte courant. */
export const sans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "../public/fonts/jost-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/jost-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/jost-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

/** URLs publiques des mêmes polices, pour les textures canvas (étiquette 3D). */
export const FONT_URLS = {
  serif600: "/fonts/cormorant-garamond-latin-600-normal.woff2",
  sans400: "/fonts/jost-latin-400-normal.woff2",
} as const;
