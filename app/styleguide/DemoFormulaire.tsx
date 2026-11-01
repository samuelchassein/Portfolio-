"use client";

import { useState } from "react";
import { Case, Champ, Puce, ZoneTexte } from "@/components/ui/Champs";
import { Bouton } from "@/components/ui/Bouton";

const SENTEURS = ["Agrumes", "Rose", "Jasmin", "Vanille", "Cèdre", "Musc", "Cuir"];

export function DemoFormulaire() {
  const [choix, setChoix] = useState<string[]>(["Rose"]);
  const [envoi, setEnvoi] = useState(false);
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="space-y-8">
        <Champ libelle="Prénom" name="prenom" autoComplete="given-name" required defaultValue="Camille" />
        <Champ
          libelle="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue="camille@exemple"
          erreur="Vérifiez l’adresse e-mail : il manque le domaine (par exemple « exemple.fr »)."
        />
        <Champ libelle="Téléphone" name="tel" type="tel" autoComplete="tel" optionnel aide="Uniquement pour vous prévenir d’un changement." />
        <ZoneTexte libelle="Message" name="message" optionnel />
      </div>
      <div className="space-y-8">
        <fieldset>
          <legend className="mb-4 text-[0.8125rem] uppercase tracking-[0.18em] text-encre-douce">Vos senteurs favorites</legend>
          <div className="flex flex-wrap gap-2.5">
            {SENTEURS.map((s) => (
              <Puce
                key={s}
                selectionnee={choix.includes(s)}
                onBasculer={() => setChoix((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s]))}
              >
                {s}
              </Puce>
            ))}
          </div>
        </fieldset>
        <div className="space-y-1">
          <Case required>J’accepte les conditions de réservation.</Case>
          <Case>Je souhaite recevoir la lettre d’information de Maison Sensa.</Case>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Bouton
            enCours={envoi}
            onClick={() => {
              setEnvoi(true);
              setTimeout(() => setEnvoi(false), 1600);
            }}
          >
            {envoi ? "Envoi…" : "Confirmer"}
          </Bouton>
          <Bouton variante="contour" disabled>
            Indisponible
          </Bouton>
        </div>
      </div>
    </div>
  );
}
