"use client";

import { useState } from "react";
import { CarteCadeauVisuel } from "./CarteCadeauVisuel";
import { Bouton } from "@/components/ui/Bouton";
import { Champ, ZoneTexte } from "@/components/ui/Champs";
import { PRIX } from "@/content/produits";
import { prix } from "@/content/site";
import { usePanier } from "@/stores/panier";

const MONTANTS = [50, 100, 150];

/** Configuration de la carte cadeau avec aperçu en direct, puis ajout au panier. */
export function ConfigurateurCarte() {
  const ajouter = usePanier((s) => s.ajouter);
  const [formule, setFormule] = useState<"atelier" | "montant">("atelier");
  const [montant, setMontant] = useState<number>(100);
  const [libre, setLibre] = useState("");
  const [pour, setPour] = useState("");
  const [de, setDe] = useState("");
  const [message, setMessage] = useState("");
  const [erreurs, setErreurs] = useState<{ pour?: string; de?: string; montant?: string }>({});
  const [ajoute, setAjoute] = useState(false);

  const valeur = formule === "atelier" ? PRIX.carteCadeauAtelier : libre ? Number(libre.replace(",", ".")) : montant;

  const valider = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof erreurs = {};
    if (!pour.trim()) err.pour = "Indiquez le prénom de la personne qui reçoit la carte.";
    if (!de.trim()) err.de = "Indiquez votre prénom.";
    if (formule === "montant" && (!Number.isFinite(valeur) || valeur < 20 || valeur > 1000)) err.montant = "Choisissez un montant entre 20 et 1 000 €.";
    setErreurs(err);
    if (Object.keys(err).length) return;
    ajouter({
      slug: "carte-cadeau",
      nom: formule === "atelier" ? "Carte cadeau Atelier Signature" : `Carte cadeau ${prix(valeur)}`,
      type: "carte-cadeau",
      prixUnitaire: valeur,
      options: { carte: { pour: pour.trim(), de: de.trim(), message: message.trim() || undefined, formule } },
    });
    setAjoute(true);
  };

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <form onSubmit={valider} noValidate className="order-2 space-y-10 lg:order-1">
        <fieldset>
          <legend className="font-serif text-2xl">Votre cadeau</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["atelier", "Atelier Signature", `Un atelier individuel et un parfum de 50 ml · ${prix(PRIX.carteCadeauAtelier)}`],
                ["montant", "Montant libre", "À valoir en boutique et en atelier"],
              ] as const
            ).map(([f, t, d]) => (
              <label key={f} className={`flex min-h-24 cursor-pointer flex-col justify-center border px-5 py-4 transition-colors ${formule === f ? "border-vert bg-ivoire-clair shadow-[inset_0_0_0_1px_var(--vert-profond)]" : "border-encre/20 hover:border-dore"}`}>
                <input type="radio" name="formule" value={f} checked={formule === f} onChange={() => setFormule(f)} className="sr-only" />
                <span className="font-serif text-xl">{t}</span>
                <span className="mt-1 text-sm text-encre-douce">{d}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {formule === "montant" && (
          <fieldset>
            <legend className="text-[0.8125rem] uppercase tracking-[0.18em] text-encre-douce">Montant</legend>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              {MONTANTS.map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={!libre && montant === m}
                  onClick={() => {
                    setMontant(m);
                    setLibre("");
                  }}
                  className={`min-h-12 min-w-20 cursor-pointer border px-4 font-serif text-xl ${!libre && montant === m ? "border-vert bg-vert text-ivoire-clair" : "border-encre/25 hover:border-dore"}`}
                >
                  {m}&nbsp;€
                </button>
              ))}
              <Champ libelle="Autre montant (€)" name="montant" inputMode="decimal" value={libre} onChange={(e) => setLibre(e.target.value)} erreur={erreurs.montant} className="w-44" />
            </div>
          </fieldset>
        )}
        <div className="grid gap-8 sm:grid-cols-2">
          <Champ libelle="Pour" name="pour" required maxLength={30} value={pour} onChange={(e) => setPour(e.target.value)} erreur={erreurs.pour} />
          <Champ libelle="De la part de" name="de" required maxLength={30} value={de} onChange={(e) => setDe(e.target.value)} erreur={erreurs.de} />
        </div>
        <ZoneTexte libelle="Votre message" name="message" optionnel maxLength={160} value={message} onChange={(e) => setMessage(e.target.value)} aide={`${message.length} / 160 caractères`} rows={3} />
        <div className="flex flex-wrap items-center gap-5">
          <Bouton type="submit">Ajouter au panier · {Number.isFinite(valeur) ? prix(valeur) : "—"}</Bouton>
          {ajoute && (
            <p role="status" className="text-dore-texte">
              Carte ajoutée à votre panier.
            </p>
          )}
        </div>
      </form>
      <div className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
        <p className="mb-4 text-[0.8125rem] uppercase tracking-[0.18em] text-encre-douce" aria-hidden="true">
          Aperçu
        </p>
        <div className="[perspective:1100px]" aria-live="polite">
          <CarteCadeauVisuel formule={formule} montant={Number.isFinite(valeur) ? valeur : undefined} pour={pour} de={de} message={message} inclinable />
        </div>
      </div>
    </div>
  );
}
