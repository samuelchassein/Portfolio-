import type { Metadata } from "next";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import { LienBouton } from "@/components/ui/Bouton";
import { Surtitre } from "@/components/brand/Signes";
import { VisiteImmersive } from "@/components/visite/VisiteImmersive";

export const metadata: Metadata = {
  title: "Visite 360°",
  description: "Visitez la boutique Maison Sensa en 360° : l’accueil, le mur des familles olfactives, l’atelier.",
};

/** Visite 360° : intègre public/visite-360/maquette-360.html dès que le fichier est présent. */
export default function PageVisite() {
  const disponible = existsSync(path.join(process.cwd(), "public/visite-360/maquette-360.html"));
  if (disponible) return <VisiteImmersive src="/visite-360/maquette-360.html" />;
  return (
    <section className="relative min-h-svh">
      <Image src="/images/interieur-vue-large.jpg" alt="L’intérieur de la boutique Maison Sensa." fill priority sizes="100vw" quality={85} className="object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ivoire via-ivoire/50 to-ivoire/10" />
      <div className="relative mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-end px-4 pb-20 text-center">
        <Surtitre>Visite 360°</Surtitre>
        <h1 className="mt-5 font-serif text-hero font-medium">Entrez dans la boutique</h1>
        <p className="mt-6 max-w-lg text-lg text-encre-douce">La visite virtuelle sera bientôt disponible. En attendant, découvrez nos deux espaces et venez nous voir à Boulogne-Billancourt.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <LienBouton href="/maison">Découvrir la maison</LienBouton>
          <LienBouton href="/atelier#reserver" variante="contour">
            Réserver l’atelier
          </LienBouton>
        </div>
      </div>
    </section>
  );
}
