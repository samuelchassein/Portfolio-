import type { Metadata } from "next";
import { serif, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison Sensa",
  description: "Parfumerie et atelier de création olfactive à Boulogne-Billancourt.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
