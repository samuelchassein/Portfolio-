import type { Metadata, Viewport } from "next";
import { SITE } from "@/content/site";
import { serif, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Maison Sensa · Parfumerie et atelier de création olfactive", template: "%s · Maison Sensa" },
  description:
    "Maison Sensa, parfumerie et atelier de création olfactive à Boulogne-Billancourt. Composez votre parfum avec un conseiller, découvrez nos bougies et coffrets.",
  openGraph: { type: "website", locale: "fr_FR", siteName: "Maison Sensa" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#F6EDDD" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
