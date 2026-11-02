import type { Metadata } from "next";
import { Surtitre } from "@/components/brand/Signes";
import { ConfigurateurCarte } from "@/components/carte-cadeau/ConfigurateurCarte";

export const metadata: Metadata = {
  title: "Carte cadeau",
  description: "Offrez une signature olfactive : un atelier individuel et un parfum de 50 ml, ou le montant de votre choix, avec votre message.",
};

export default function PageCarteCadeau() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-28 sm:px-8 lg:pt-32">
      <Surtitre>Carte cadeau</Surtitre>
      <h1 className="mt-5 font-serif text-hero font-medium">Offrez une signature olfactive</h1>
      <span aria-hidden="true" className="mt-8 block h-px w-12 bg-dore" />
      <p className="mt-8 max-w-xl text-lg text-encre-douce">Composez votre carte : la formule, les prénoms, un mot. L’aperçu se met à jour en direct.</p>
      <div className="mt-16">
        <ConfigurateurCarte />
      </div>
    </div>
  );
}
