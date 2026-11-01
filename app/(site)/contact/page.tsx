import type { Metadata } from "next";
import { Surtitre } from "@/components/brand/Signes";
import { FormulaireContact } from "@/components/contact/FormulaireContact";
import { SITE, adresseComplete } from "@/content/site";

export const metadata: Metadata = { title: "Contact", description: "Écrire à Maison Sensa, parfumerie et atelier de création olfactive à Boulogne-Billancourt." };

export default function PageContact() {
  return (
    <div className="mx-auto grid max-w-6xl gap-16 px-4 pb-24 pt-28 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:pt-32">
      <div>
        <Surtitre>Contact</Surtitre>
        <h1 className="mt-5 font-serif text-hero font-medium">Nous écrire</h1>
        <span aria-hidden="true" className="mt-8 block h-px w-12 bg-dore" />
        <address className="mt-10 space-y-2 not-italic">
          <p>{adresseComplete()}</p>
          <p>
            <a href={`mailto:${SITE.email}`} className="underline decoration-dore underline-offset-4">
              {SITE.email}
            </a>
          </p>
          <p>{SITE.telephone}</p>
        </address>
      </div>
      <FormulaireContact />
    </div>
  );
}
