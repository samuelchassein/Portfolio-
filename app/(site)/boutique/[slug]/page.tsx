import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FicheProduit } from "@/components/boutique/FicheProduit";
import { PRODUITS, produitParSlug } from "@/content/produits";

export function generateStaticParams() {
  return PRODUITS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = produitParSlug((await params).slug);
  if (!p) return {};
  return { title: p.nom, description: `${p.accroche} ${p.description}`.slice(0, 160), openGraph: { images: [`/renders/${p.visuel}.webp`] } };
}

export default async function PageProduit({ params }: { params: Promise<{ slug: string }> }) {
  const p = produitParSlug((await params).slug);
  if (!p) notFound();
  return <FicheProduit produit={p} />;
}
