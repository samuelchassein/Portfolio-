import type { Metadata } from "next";
import { SITE, adresseComplete } from "@/content/site";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegales() {
  const l = SITE.legal;
  return (
    <>
      <h1>Mentions légales</h1>
      <h2>Éditeur du site</h2>
      <p>
        {l.raisonSociale}, {l.formeJuridique}
        <br />
        Siège : {adresseComplete()}
        <br />
        SIREN : {l.siren} · {l.rcs} · TVA : {l.tva}
        <br />
        Contact : {SITE.email} · {SITE.telephone}
      </p>
      <p>Directeur ou directrice de la publication : {l.directeurPublication}</p>
      <h2>Hébergement</h2>
      <p>{l.hebergeur}</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, visuels, rendus 3D, le nom et le logo Maison Sensa sont protégés. Toute reproduction sans autorisation écrite est interdite.
      </p>
      <h2>Données personnelles</h2>
      <p>
        Voir la <a href="/confidentialite" className="underline underline-offset-4">politique de confidentialité</a> et la{" "}
        <a href="/cookies" className="underline underline-offset-4">politique relative aux cookies</a>.
      </p>
    </>
  );
}
