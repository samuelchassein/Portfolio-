"use client";

import Image from "next/image";
import { useState } from "react";
import { VisualiseurProduit } from "./VisualiseurProduit";
import { Bouton, LienBouton } from "@/components/ui/Bouton";
import { Case, Champ } from "@/components/ui/Champs";
import { Surtitre } from "@/components/brand/Signes";
import { PRIX, type Produit } from "@/content/produits";
import { prix } from "@/content/site";
import { usePanier } from "@/stores/panier";

/** Fiche produit : visualiseur 360°, galerie, description, options, ajout au panier. */
export function FicheProduit({ produit }: { produit: Produit }) {
  const ajouter = usePanier((s) => s.ajouter);
  const lignes = usePanier((s) => s.lignes);
  const [gravureActive, setGravureActive] = useState(false);
  const [gravure, setGravure] = useState("");
  const [reference, setReference] = useState("");
  const [erreurs, setErreurs] = useState<{ gravure?: string; reference?: string }>({});
  const [ajoute, setAjoute] = useState(false);

  const atelierAuPanier = lignes.some((l) => l.type === "atelier");
  const prixAffiche = produit.type === "bougie" && atelierAuPanier ? PRIX.bougieAvecAtelier : produit.prix;

  const ajouterAuPanier = () => {
    const err: typeof erreurs = {};
    if (produit.referenceRequise && !reference.trim()) err.reference = "Indiquez la référence inscrite sur votre flacon : sans elle, nous ne pouvons pas préparer votre recharge.";
    if (gravureActive && !gravure.trim()) err.gravure = "Saisissez le texte à graver, ou décochez l’option.";
    setErreurs(err);
    if (Object.keys(err).length || produit.prix === null) return;
    ajouter({
      slug: produit.slug,
      nom: produit.nom,
      type: produit.type,
      prixUnitaire: produit.prix,
      options: {
        ...(gravureActive && gravure.trim() ? { gravure: gravure.trim() } : {}),
        ...(produit.referenceRequise ? { reference: reference.trim().toUpperCase() } : {}),
      },
    });
    setAjoute(true);
  };

  return (
    <div className="mx-auto grid max-w-[90rem] gap-12 px-4 pb-24 pt-28 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pt-32">
      <div className="space-y-6">
        {produit.modele ? (
          <VisualiseurProduit modele={produit.modele} visuel={produit.visuel} nom={produit.nom} gravure={gravureActive ? gravure : undefined} />
        ) : (
          <div className="relative aspect-[4/5] bg-ivoire-clair">
            <Image src={`/renders/${produit.visuel}.webp`} alt="" fill priority sizes="(min-width: 1024px) 46vw, 100vw" className="object-contain p-[6%]" />
          </div>
        )}
        {produit.galerie?.map((g) => (
          <div key={g.src} className="relative aspect-[6/5] overflow-hidden">
            <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 46vw, 100vw" quality={85} className="object-cover" />
          </div>
        ))}
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <Surtitre>{produit.type === "bougie" ? "Bougie parfumée" : produit.type === "atelier" ? "Sur rendez-vous" : "Maison Sensa"}</Surtitre>
        <h1 className="mt-5 font-serif text-titre font-medium">{produit.nom}</h1>
        <p className="mt-3 font-serif text-2xl italic text-encre-douce">{produit.accroche}</p>
        <span aria-hidden="true" className="mt-6 block h-px w-12 bg-dore" />
        <p className="mt-6 font-serif text-4xl tabular-nums">
          {prixAffiche === null ? "Sur demande en boutique" : prix(prixAffiche)}
          {produit.type === "bougie" && atelierAuPanier && <span className="ml-3 align-middle text-base text-dore-texte">Prix atelier (au lieu de 59&nbsp;€)</span>}
        </p>
        {produit.type === "bougie" && !atelierAuPanier && <p className="mt-2 text-sm text-encre-douce">45&nbsp;€ si vous réservez aussi un Atelier Signature.</p>}
        <p className="mt-8 text-lg leading-relaxed">{produit.description}</p>
        {produit.contenance && <p className="mt-4 text-encre-douce">{produit.contenance}</p>}

        {produit.type === "atelier" ? (
          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-4">
              <LienBouton href="/atelier#reserver">Choisir mon créneau</LienBouton>
              <Bouton variante="contour" onClick={ajouterAuPanier}>
                Régler l’atelier en ligne
              </Bouton>
            </div>
            {ajoute && (
              <p role="status" className="mt-4 text-dore-texte">
                Atelier ajouté au panier : vos bougies passent à 45&nbsp;€.
              </p>
            )}
            <p className="mt-4 text-sm text-encre-douce">Réservez votre créneau, puis réglez en boutique ou dès maintenant en ligne.</p>
          </div>
        ) : produit.type === "carte-cadeau" ? (
          <div className="mt-10">
            <LienBouton href="/carte-cadeau">Composer la carte</LienBouton>
          </div>
        ) : produit.prix === null ? (
          <p className="mt-10 border-l-2 border-dore pl-4">Le coffret cadeau est disponible en boutique. Demandez-le à votre conseiller.</p>
        ) : (
          <div className="mt-10 space-y-6">
            {produit.referenceRequise && (
              <Champ
                libelle="Référence de votre parfum (indiquée sur votre flacon)"
                name="reference"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                erreur={erreurs.reference}
                aide="Par exemple MS-261103-AB12."
                autoComplete="off"
              />
            )}
            {produit.gravure && (
              <div>
                <Case checked={gravureActive} onChange={(e) => setGravureActive(e.target.checked)}>
                  Ajouter une gravure sur le flacon (+ {prix(PRIX.gravure)})
                </Case>
                {gravureActive && (
                  <Champ
                    className="mt-3"
                    libelle="Texte à graver"
                    name="gravure"
                    maxLength={24}
                    value={gravure}
                    onChange={(e) => setGravure(e.target.value)}
                    erreur={erreurs.gravure}
                    aide={`${gravure.length} / 24 caractères. Aperçu sur le flacon en 360°.`}
                  />
                )}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-5">
              <Bouton onClick={ajouterAuPanier}>Ajouter au panier</Bouton>
              {ajoute && (
                <p role="status" className="text-dore-texte">
                  Ajouté à votre panier.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
