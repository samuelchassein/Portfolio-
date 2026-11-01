"use client";

import { useState } from "react";
import { Bouton } from "@/components/ui/Bouton";
import { Case, Champ, ZoneTexte } from "@/components/ui/Champs";
import { envoyerEmails } from "@/lib/email";
import { useAntiAbus } from "@/lib/anti-abus";

type Valeurs = { nom: string; email: string; sujet: string; message: string; accord: boolean };

/** Formulaire de contact : accusé de réception au client, message complet à la boutique (« Répondre à » vers le client). */
export function FormulaireContact() {
  const [v, setV] = useState<Valeurs>({ nom: "", email: "", sujet: "", message: "", accord: false });
  const [erreurs, setErreurs] = useState<Partial<Record<keyof Valeurs, string>>>({});
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [accuse, setAccuse] = useState(false);
  const { champPiege, estHumain } = useAntiAbus();
  const maj = <K extends keyof Valeurs>(k: K, val: Valeurs[K]) => setV((x) => ({ ...x, [k]: val }));

  const valider = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof erreurs = {};
    if (!v.nom.trim()) err.nom = "Indiquez votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) err.email = "Indiquez une adresse e-mail valide, par exemple prenom@exemple.fr.";
    if (v.message.trim().length < 10) err.message = "Écrivez votre message (10 caractères au moins).";
    if (!v.accord) err.accord = "Acceptez que nous utilisions vos coordonnées pour vous répondre.";
    setErreurs(err);
    if (Object.keys(err).length) {
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    setEnvoi(true);
    if (estHumain()) {
      const nom = v.nom.trim();
      const res = await envoyerEmails({
        type: "contact",
        reference: `MSG-${Date.now().toString(36).toUpperCase()}`,
        client: { nom, email: v.email.trim() },
        sujetClient: "Nous avons bien reçu votre message",
        sujetBoutique: `Message de ${nom}${v.sujet.trim() ? ` : ${v.sujet.trim()}` : ""}`,
        titreClient: "Merci pour votre message",
        titreBoutique: "Nouveau message",
        introClient: `Bonjour ${nom}, nous avons bien reçu votre message et vous répondrons rapidement.`,
        introBoutique: `${nom} (${v.email.trim()}) vous a écrit depuis le site.`,
        lignes: [["Nom", nom], ["E-mail", v.email.trim()], ...(v.sujet.trim() ? ([["Sujet", v.sujet.trim()]] as [string, string][]) : [])],
        message: v.message.trim(),
      });
      setAccuse(res.client === true);
    }
    setEnvoi(false);
    setEnvoye(true);
  };

  if (envoye)
    return (
      <div role="status" className="border-l-2 border-dore pl-6">
        <p className="font-serif text-3xl">Merci, votre message est bien parti.</p>
        <p className="mt-2 text-encre-douce">{accuse ? "Un accusé de réception vous a été envoyé par e-mail." : "Nous vous répondrons rapidement."}</p>
      </div>
    );

  return (
    <form onSubmit={valider} noValidate className="relative space-y-8">
      {champPiege}
      <div className="grid gap-8 sm:grid-cols-2">
        <Champ libelle="Nom" name="nom" autoComplete="name" required value={v.nom} onChange={(e) => maj("nom", e.target.value)} erreur={erreurs.nom} />
        <Champ libelle="E-mail" name="email" type="email" autoComplete="email" required value={v.email} onChange={(e) => maj("email", e.target.value)} erreur={erreurs.email} />
      </div>
      <Champ libelle="Sujet" name="sujet" optionnel value={v.sujet} onChange={(e) => maj("sujet", e.target.value)} />
      <ZoneTexte libelle="Votre message" name="message" required rows={6} value={v.message} onChange={(e) => maj("message", e.target.value)} erreur={erreurs.message} />
      <Case checked={v.accord} onChange={(e) => maj("accord", e.target.checked)} erreur={erreurs.accord} required>
        J’accepte que Maison Sensa utilise mes coordonnées pour répondre à ce message.
      </Case>
      <Bouton type="submit" enCours={envoi}>
        {envoi ? "Envoi…" : "Envoyer"}
      </Bouton>
    </form>
  );
}
