"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { fournisseurReservation, formaterCreneau, type Creneau, type Reservation as Resa } from "@/lib/booking";
import { fichierICS, telechargerICS } from "@/lib/ics";
import { envoyerEmails } from "@/lib/email";
import { useAntiAbus } from "@/lib/anti-abus";
import { resumeProfil, useProfil } from "@/stores/profil";
import { SITE, adresseComplete, prix } from "@/content/site";
import { Bouton } from "@/components/ui/Bouton";
import { Case, Champ, ZoneTexte } from "@/components/ui/Champs";
import { CadreDore } from "@/components/brand/Signes";

const ETAPES = ["Date et créneau", "Vos informations", "Confirmation"];
const JOURS_SEMAINE = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];

type Infos = { prenom: string; nom: string; email: string; telephone: string; pour: "moi" | "offrir"; message: string; cgv: boolean; marketing: boolean };

/** Réservation de l'Atelier Signature en trois étapes (parcours simulé, e-mails réels). */
export function Reservation() {
  // Le calendrier dépend de la date du jour : rendu uniquement dans le navigateur.
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  const [etape, setEtape] = useState(0);
  const [creneau, setCreneau] = useState<string | null>(null);
  const [resa, setResa] = useState<Resa | null>(null);
  const [emailEnvoye, setEmailEnvoye] = useState<boolean | null>(null);
  const titre = useRef<HTMLHeadingElement>(null);
  const reduit = useReducedMotion();

  // Le focus suit le changement d'étape (lecteurs d'écran, clavier).
  useEffect(() => {
    if (etape > 0) titre.current?.focus();
  }, [etape]);

  if (!monte) return <div className="min-h-[34rem]" aria-busy="true" />;

  return (
    <div>
      <ol className="flex flex-wrap gap-x-8 gap-y-2" aria-label="Étapes de la réservation">
        {ETAPES.map((e, i) => (
          <li key={e} aria-current={i === etape ? "step" : undefined} className={`flex items-center gap-3 text-[0.8125rem] uppercase tracking-[0.18em] ${i === etape ? "text-encre" : "text-encre-douce/70"}`}>
            <span className={`flex size-7 items-center justify-center rounded-full border font-serif text-base tracking-normal ${i <= etape ? "border-dore text-dore-texte" : "border-encre/20"}`}>{i + 1}</span>
            {e}
          </li>
        ))}
      </ol>
      <div className="relative mt-3 h-px bg-encre/10" aria-hidden="true">
        <span className="absolute inset-y-0 left-0 bg-dore transition-[width] duration-700 ease-doux" style={{ width: `${((etape + 1) / 3) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={etape}
          initial={{ opacity: 0, y: reduit ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduit ? 0 : -12 }}
          transition={{ duration: reduit ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <h3 ref={titre} tabIndex={-1} className="font-serif text-3xl font-medium outline-none">
            {ETAPES[etape]}
          </h3>
          {etape === 0 && <EtapeCreneau choisi={creneau} onChoisir={setCreneau} onSuivant={() => setEtape(1)} />}
          {etape === 1 && creneau && (
            <EtapeInfos
              creneau={creneau}
              onRetour={() => setEtape(0)}
              onConfirme={(r, ok) => {
                setResa(r);
                setEmailEnvoye(ok);
                setEtape(2);
              }}
            />
          )}
          {etape === 2 && resa && <EtapeConfirmation resa={resa} emailEnvoye={emailEnvoye} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EtapeCreneau({ choisi, onChoisir, onSuivant }: { choisi: string | null; onChoisir: (c: string) => void; onSuivant: () => void }) {
  const jours = useMemo(() => fournisseurReservation.joursOuverts(), []);
  const ouverts = useMemo(() => new Set(jours), [jours]);
  const mois = useMemo(() => [...new Set(jours.map((j) => j.slice(0, 7)))], [jours]);
  const [iMois, setIMois] = useState(0);
  const [jour, setJour] = useState<string | null>(choisi?.slice(0, 10) ?? null);
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);

  useEffect(() => {
    if (jour) fournisseurReservation.creneaux(jour).then(setCreneaux);
  }, [jour]);

  const [a, m] = (mois[iMois] ?? jours[0].slice(0, 7)).split("-").map(Number);
  const premier = new Date(a, m - 1, 1);
  const decalage = (premier.getDay() + 6) % 7;
  const nbJours = new Date(a, m, 0).getDate();
  const nomMois = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(premier);

  return (
    <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,26rem)_1fr]">
      <div>
        <div className="flex items-center justify-between">
          <button type="button" className="inline-flex size-11 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30" disabled={iMois === 0} onClick={() => setIMois(iMois - 1)} aria-label="Mois précédent">
            ‹
          </button>
          <p className="font-serif text-2xl capitalize" aria-live="polite">
            {nomMois}
          </p>
          <button type="button" className="inline-flex size-11 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30" disabled={iMois >= mois.length - 1} onClick={() => setIMois(iMois + 1)} aria-label="Mois suivant">
            ›
          </button>
        </div>
        <div role="grid" aria-label={`Jours de ${nomMois}`} className="mt-4 grid grid-cols-7 gap-1 text-center">
          {JOURS_SEMAINE.map((j) => (
            <div key={j} role="columnheader" className="pb-2 text-xs uppercase tracking-[0.12em] text-encre-douce">
              {j}
            </div>
          ))}
          {Array.from({ length: decalage }).map((_, i) => (
            <div key={`v${i}`} />
          ))}
          {Array.from({ length: nbJours }).map((_, i) => {
            const iso = `${a}-${String(m).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
            const ouvert = ouverts.has(iso);
            const actif = jour === iso;
            return (
              <button
                key={iso}
                type="button"
                role="gridcell"
                disabled={!ouvert}
                aria-selected={actif}
                aria-label={new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${iso}T12:00`)) + (ouvert ? "" : ", fermé")}
                onClick={() => setJour(iso)}
                className={`flex aspect-square min-h-11 cursor-pointer items-center justify-center font-serif text-lg tabular-nums transition-colors duration-300 disabled:cursor-default disabled:text-encre/25 ${
                  actif ? "bg-vert text-ivoire-clair" : ouvert ? "hover:bg-travertin" : ""
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-encre-douce">Ateliers du mardi au samedi. Les jours grisés sont fermés.</p>
      </div>

      <div>
        {!jour ? (
          <p className="text-encre-douce">Choisissez un jour pour voir les créneaux disponibles.</p>
        ) : (
          <fieldset>
            <legend className="font-serif text-2xl first-letter:uppercase">{formaterCreneau(`${jour}T10:00`).date}</legend>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {creneaux.map((c) => (
                <button
                  key={c.debut}
                  type="button"
                  disabled={!c.disponible}
                  aria-pressed={choisi === c.debut}
                  onClick={() => onChoisir(c.debut)}
                  className={`min-h-12 cursor-pointer border text-base tabular-nums transition-colors duration-300 disabled:cursor-not-allowed disabled:border-encre/10 disabled:text-encre/30 disabled:line-through ${
                    choisi === c.debut ? "border-vert bg-vert text-ivoire-clair" : "border-encre/25 hover:border-dore hover:bg-ivoire-clair"
                  }`}
                >
                  {c.debut.slice(11).replace(":", " h ")}
                  <span className="sr-only">{c.disponible ? "" : ", complet"}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-encre-douce">Les créneaux barrés sont déjà réservés.</p>
          </fieldset>
        )}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Bouton disabled={!choisi || choisi.slice(0, 10) !== jour} onClick={onSuivant} fleche>
            Continuer
          </Bouton>
          {choisi && <p className="first-letter:uppercase">{formaterCreneau(choisi).dateHeure}</p>}
        </div>
      </div>
    </div>
  );
}

function EtapeInfos({ creneau, onRetour, onConfirme }: { creneau: string; onRetour: () => void; onConfirme: (r: Resa, emailOk: boolean | null) => void }) {
  const profil = useProfil((s) => s.profil);
  const [joindreProfil, setJoindreProfil] = useState(true);
  const [v, setV] = useState<Infos>({ prenom: "", nom: "", email: "", telephone: "", pour: profil?.occasion ?? "moi", message: "", cgv: false, marketing: false });
  const [erreurs, setErreurs] = useState<Partial<Record<keyof Infos | "global", string>>>({});
  const [envoi, setEnvoi] = useState(false);
  const { champPiege, estHumain } = useAntiAbus();
  const maj = <K extends keyof Infos>(k: K, val: Infos[K]) => setV((x) => ({ ...x, [k]: val }));

  const valider = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof erreurs = {};
    if (!v.prenom.trim()) err.prenom = "Indiquez votre prénom.";
    if (!v.nom.trim()) err.nom = "Indiquez votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) err.email = "Indiquez une adresse e-mail valide, par exemple prenom@exemple.fr.";
    if (v.telephone.replace(/\D/g, "").length < 10) err.telephone = "Indiquez un numéro de téléphone à 10 chiffres.";
    if (!v.cgv) err.cgv = "Acceptez les conditions de réservation pour continuer.";
    setErreurs(err);
    if (Object.keys(err).length) {
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    setEnvoi(true);
    try {
      const profilTexte = profil && joindreProfil ? resumeProfil(profil) : undefined;
      const r = await fournisseurReservation.reserver({
        debut: creneau,
        prenom: v.prenom.trim(),
        nom: v.nom.trim(),
        email: v.email.trim(),
        telephone: v.telephone.trim(),
        pour: v.pour,
        message: v.message.trim() || undefined,
        profil: profilTexte,
        marketing: v.marketing,
      });
      let emailOk: boolean | null = null;
      if (estHumain()) {
        const { dateHeure } = formaterCreneau(r.debut);
        const lignes: [string, string][] = [
          ["Référence", r.reference],
          ["Date et heure", dateHeure],
          ["Durée", `${SITE.atelier.dureeMin} à ${SITE.atelier.dureeMax} minutes`],
          ["Atelier", `Atelier Signature, parfum ${SITE.atelier.contenance} inclus`],
          ["Prix", prix(SITE.atelier.prix)],
          ["Pour", r.pour === "moi" ? "Pour moi" : "Pour offrir"],
          ...(profilTexte ? ([["Profil olfactif", profilTexte]] as [string, string][]) : []),
          ["Adresse", adresseComplete()],
          ["Modification", "Pour modifier ou annuler votre rendez-vous, répondez simplement à cet e-mail."],
        ];
        const res = await envoyerEmails({
          type: "reservation",
          reference: r.reference,
          client: { nom: `${r.prenom} ${r.nom}`, email: r.email, telephone: r.telephone },
          sujetClient: `Votre Atelier Signature du ${dateHeure}`,
          sujetBoutique: `Nouvelle réservation ${r.reference} : ${dateHeure}`,
          titreClient: "Votre atelier est réservé",
          titreBoutique: "Nouvelle réservation",
          introClient: `Bonjour ${r.prenom}, nous avons hâte de vous accueillir pour composer votre parfum.`,
          introBoutique: `${r.prenom} ${r.nom} a réservé un Atelier Signature.`,
          lignes,
          total: prix(SITE.atelier.prix),
          message: r.message,
        });
        emailOk = res.configure ? res.client : null;
      }
      onConfirme(r, emailOk);
    } catch (er) {
      setErreurs({ global: er instanceof Error ? er.message : "La réservation n’a pas abouti. Réessayez dans un instant." });
      setEnvoi(false);
    }
  };

  return (
    <form onSubmit={valider} noValidate className="relative mt-8 max-w-3xl">
      {champPiege}
      <p className="first-letter:uppercase">
        <span className="text-encre-douce">Créneau choisi : </span>
        {formaterCreneau(creneau).dateHeure}{" "}
        <button type="button" onClick={onRetour} className="ml-2 min-h-11 cursor-pointer text-sm underline underline-offset-4">
          Modifier
        </button>
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <Champ libelle="Prénom" name="prenom" autoComplete="given-name" required value={v.prenom} onChange={(e) => maj("prenom", e.target.value)} erreur={erreurs.prenom} />
        <Champ libelle="Nom" name="nom" autoComplete="family-name" required value={v.nom} onChange={(e) => maj("nom", e.target.value)} erreur={erreurs.nom} />
        <Champ libelle="E-mail" name="email" type="email" autoComplete="email" required value={v.email} onChange={(e) => maj("email", e.target.value)} erreur={erreurs.email} aide="Votre confirmation y sera envoyée." />
        <Champ libelle="Téléphone" name="telephone" type="tel" autoComplete="tel" required value={v.telephone} onChange={(e) => maj("telephone", e.target.value)} erreur={erreurs.telephone} aide="Pour vous prévenir en cas de changement." />
      </div>
      <fieldset className="mt-10">
        <legend className="text-[0.8125rem] uppercase tracking-[0.18em] text-encre-douce">Cet atelier est</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {(["moi", "offrir"] as const).map((p) => (
            <label key={p} className={`flex min-h-12 cursor-pointer items-center gap-3 border px-6 transition-colors ${v.pour === p ? "border-vert bg-vert text-ivoire-clair" : "border-encre/25 hover:border-dore"}`}>
              <input type="radio" name="pour" value={p} checked={v.pour === p} onChange={() => maj("pour", p)} className="sr-only" />
              {p === "moi" ? "Pour moi" : "Pour offrir"}
            </label>
          ))}
        </div>
      </fieldset>
      {profil && (
        <div className="mt-10 border-l-2 border-dore bg-ivoire-clair px-6 py-5">
          <p className="font-serif text-xl">Votre profil olfactif</p>
          <p className="mt-2 text-encre-douce">{resumeProfil(profil)}</p>
          <Case className="mt-2" checked={joindreProfil} onChange={(e) => setJoindreProfil(e.target.checked)}>
            Joindre ce profil à ma réservation pour préparer l’atelier
          </Case>
        </div>
      )}
      <ZoneTexte className="mt-10" libelle="Un mot pour votre conseiller" name="message" optionnel value={v.message} onChange={(e) => maj("message", e.target.value)} aide="Une envie, une occasion, une senteur que vous aimez." />
      <div className="mt-8 space-y-1">
        <Case checked={v.cgv} onChange={(e) => maj("cgv", e.target.checked)} erreur={erreurs.cgv} required>
          J’accepte les{" "}
          <Link href="/cgv" className="underline underline-offset-4" target="_blank">
            conditions de réservation
          </Link>
          .
        </Case>
        <Case checked={v.marketing} onChange={(e) => maj("marketing", e.target.checked)}>
          Je souhaite recevoir la lettre d’information de Maison Sensa (facultatif).
        </Case>
      </div>
      {erreurs.global && (
        <p role="alert" className="mt-6 border-l-2 border-erreur pl-4 text-erreur">
          {erreurs.global}
        </p>
      )}
      <div className="mt-10 flex flex-wrap items-center gap-5">
        <Bouton type="submit" enCours={envoi}>
          {envoi ? "Réservation en cours…" : "Confirmer ma réservation"}
        </Bouton>
        <Bouton variante="lien" onClick={onRetour}>
          Revenir aux créneaux
        </Bouton>
      </div>
      <p className="mt-6 text-sm text-encre-douce">Aucun paiement en ligne : l’atelier ({prix(SITE.atelier.prix)}) se règle en boutique.</p>
    </form>
  );
}

function EtapeConfirmation({ resa, emailEnvoye }: { resa: Resa; emailEnvoye: boolean | null }) {
  const { dateHeure } = formaterCreneau(resa.debut);
  return (
    <div className="mt-8 max-w-2xl" role="status">
      <CadreDore double className="bg-ivoire-clair px-8 py-10 sm:px-12">
        <p className="text-surtitre uppercase tracking-[0.36em] text-dore-texte">Atelier Signature réservé</p>
        <p className="mt-5 font-serif text-3xl font-medium first-letter:uppercase">{dateHeure}</p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm uppercase tracking-[0.16em] text-encre-douce">Référence</dt>
            <dd className="mt-1 font-serif text-xl tracking-wide">{resa.reference}</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-[0.16em] text-encre-douce">Durée et prix</dt>
            <dd className="mt-1 font-serif text-xl">
              {SITE.atelier.dureeMin} à {SITE.atelier.dureeMax} min · {prix(SITE.atelier.prix)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm uppercase tracking-[0.16em] text-encre-douce">Adresse</dt>
            <dd className="mt-1">{adresseComplete()}</dd>
          </div>
        </dl>
        <p className="mt-8">
          {emailEnvoye === false
            ? "Votre réservation est bien enregistrée. L’e-mail de confirmation n’a pas pu partir : notez votre référence, nous vous confirmerons le rendez-vous."
            : "Vous recevrez une confirmation par e-mail."}
        </p>
        <p className="mt-2 text-sm text-encre-douce">Délai de remise de votre parfum : {SITE.atelier.delaiRemise}.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Bouton onClick={() => telechargerICS(fichierICS({ debut: resa.debut, reference: resa.reference }), `atelier-maison-sensa-${resa.reference}.ics`)}>
            Ajouter à mon agenda
          </Bouton>
          <Link href="/diagnostic" className="inline-flex min-h-12 items-center border border-encre/70 px-8 text-[0.8125rem] uppercase tracking-[0.24em] hover:bg-encre hover:text-ivoire-clair">
            Préparer mon atelier
          </Link>
        </div>
      </CadreDore>
    </div>
  );
}
