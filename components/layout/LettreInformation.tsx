"use client";

import { useState } from "react";
import { Bouton } from "@/components/ui/Bouton";
import { Case, Champ } from "@/components/ui/Champs";

/**
 * Inscription à la lettre d'information, avec consentement explicite et
 * séparé (case non cochée). Simulée : l'inscription est conservée localement
 * en attendant le branchement d'un outil d'envoi (voir README).
 */
export function LettreInformation() {
  const [email, setEmail] = useState("");
  const [accord, setAccord] = useState(false);
  const [erreurs, setErreurs] = useState<{ email?: string; accord?: string }>({});
  const [envoye, setEnvoye] = useState(false);

  const valider = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof erreurs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Indiquez une adresse e-mail valide, par exemple prenom@exemple.fr.";
    if (!accord) err.accord = "Cochez la case pour confirmer votre inscription.";
    setErreurs(err);
    if (Object.keys(err).length) return;
    try {
      const liste = JSON.parse(localStorage.getItem("ms-lettre") ?? "[]");
      localStorage.setItem("ms-lettre", JSON.stringify([...liste, { email, date: new Date().toISOString() }]));
    } catch {
      /* stockage indisponible */
    }
    setEnvoye(true);
  };

  if (envoye)
    return (
      <div role="status">
        <p className="font-serif text-2xl">Merci, c’est noté.</p>
        <p className="mt-2 text-encre-douce">Vous recevrez nos nouvelles et nos invitations. Vous pourrez vous désinscrire à tout moment.</p>
      </div>
    );

  return (
    <form onSubmit={valider} noValidate aria-labelledby="titre-lettre">
      <h3 id="titre-lettre" className="font-serif text-2xl font-medium">
        La lettre de la maison
      </h3>
      <p className="mt-2 text-encre-douce">Nouvelles familles, ateliers et invitations, quelques fois par an.</p>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <Champ
          libelle="Votre e-mail"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erreur={erreurs.email}
          className="flex-1"
        />
        <Bouton type="submit" className="shrink-0">
          S’inscrire
        </Bouton>
      </div>
      <Case className="mt-4" checked={accord} onChange={(e) => setAccord(e.target.checked)} erreur={erreurs.accord}>
        J’accepte de recevoir la lettre d’information de Maison Sensa. Mon adresse n’est utilisée que pour cet envoi (voir la{" "}
        <a href="/confidentialite" className="underline underline-offset-4">
          politique de confidentialité
        </a>
        ).
      </Case>
    </form>
  );
}
