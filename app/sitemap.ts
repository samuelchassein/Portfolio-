import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { PRODUITS } from "@/content/produits";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/maison", "/atelier", "/diagnostic", "/boutique", "/visite", "/carte-cadeau", "/contact", "/mentions-legales", "/cgv", "/confidentialite", "/cookies"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...PRODUITS.filter((p) => p.type !== "carte-cadeau").map((p) => ({ url: `${SITE.url}/boutique/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
