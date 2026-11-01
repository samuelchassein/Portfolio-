import type { Metadata } from "next";
import { Commande } from "@/components/boutique/Commande";

export const metadata: Metadata = { title: "Panier", robots: { index: false } };

export default function PagePanier() {
  return <Commande />;
}
