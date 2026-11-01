"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { prixLigne, totalPanier, usePanier, type LignePanier } from "@/stores/panier";
import { produitParSlug } from "@/content/produits";
import { SITE, adresseComplete, prix } from "@/content/site";
import { fournisseurPaiement } from "@/lib/payment";
import { envoyerEmails } from "@/lib/email";
import { useAntiAbus } from "@/lib/anti-abus";
import { Bouton, LienBouton } from "@/components/ui/Bouton";
import { Case, Champ } from "@/components/ui/Champs";
import { CadreDore, Surtitre } from "@/components/brand/Signes";
import { Picto } from "@/components/brand/Pictos";

type Coordonnees = { prenom: string; nom: string; email: string; telephone: string; mode: "retrait" | "livraison"; adresse: string; cp: string; ville: string; cgv: boolean };

const detailLigne = (l: LignePanier) =>
  [
    l.options?.gravure && `gravure « ${l.options.gravure} »`,
    l.options?.reference && `référence ${l.options.reference}`,
    l.options?.carte && `pour ${l.options.carte.pour}, de la part de ${l.options.carte.de}${l.options.carte.message ? `, message : « ${l.options.carte.message} »` : ""}`,
  ]
    .filter(Boolean)
    .join(", ");

/** Panier et commande simulée : coordonnées, retrait ou livraison, récapitulatif, confirmation. */
export function Commande() {
  const { lignes, changerQuantite, retirer, vider } = usePanier();
  const [monte, setMonte] = useState(false);
  const [v, setV] = useState<Coordonnees>({ prenom: "", nom: "", email: "", telephone: "", mode: "retrait", adresse: "", cp: "", ville: "", cgv: false });
  const [erreurs, setErreurs] = useState<Partial<Record<keyof Coordonnees | "global", string>>>({});
  const [envoi, setEnvoi] = useState(false);
  const [fin, setFin] = useState<{ numero: string; total: number; email: boolean | null; lignes: LignePanier[] } | null>(null);
  const { champPiege, estHumain } = useAntiAbus();
  const titreFin = useRef<HTMLHeadingElement>(null);
  useEffect(() => setMonte(true), []);
  useEffect(() => {
    if (fin) titreFin.current?.focus();
  }, [fin]);
  const maj = <K extends keyof Coordonnees>(k: K, val: Coordonnees[K]) => setV((x) => ({ ...x, [k]: val }));

  if (!monte) return <div className="min-h-[60svh]" />;

  if (fin)
    return (
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-32 sm:px-8" role="status">
        <CadreDore double className="bg-ivoire-clair px-8 py-12 text-center sm:px-12">
          <Surtitre>Commande confirmée</Surtitre>
          <h1 ref={titreFin} tabIndex={-1} className="mt-5 font-serif text-titre font-medium outline-none">
            Merci {v.prenom}
          </h1>
          <p className="mt-4 text-encre-douce">Numéro de commande</p>
          <p className="font-serif text-3xl tracking-wide">{fin.numero}</p>
          <p className="mt-6">
            Total : <span className="font-serif text-2xl">{prix(fin.total)}</span> ·{" "}
            {v.mode === "retrait" ? `retrait en boutique, ${adresseComplete()}` : `livraison à ${v.adresse}, ${v.cp} ${v.ville}`}
          </p>
          <p className="mt-6">
            {fin.email === true
              ? "Vous recevrez une confirmation par e-mail."
              : "Votre commande est bien enregistrée : notez votre numéro de commande. Maison Sensa revient vers vous par e-mail pour la suite."}
          </p>
          <LienBouton href="/" variante="lien" fleche className="mt-8">
            Retour à l’accueil
          </LienBouton>
        </CadreDore>
      </div>
    );

  const total = totalPanier(lignes);
  const livraison = v.mode === "livraison" ? SITE.fraisLivraison : 0;

  const valider = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof erreurs = {};
    if (!v.prenom.trim()) err.prenom = "Indiquez votre prénom.";
    if (!v.nom.trim()) err.nom = "Indiquez votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) err.email = "Indiquez une adresse e-mail valide, par exemple prenom@exemple.fr.";
    if (v.telephone.replace(/\D/g, "").length < 10) err.telephone = "Indiquez un numéro de téléphone à 10 chiffres.";
    if (v.mode === "livraison") {
      if (!v.adresse.trim()) err.adresse = "Indiquez l’adresse de livraison.";
      if (!/^\d{5}$/.test(v.cp.trim())) err.cp = "Indiquez un code postal à 5 chiffres.";
      if (!v.ville.trim()) err.ville = "Indiquez la ville.";
    }
    if (!v.cgv) err.cgv = "Acceptez les conditions générales de vente pour valider la commande.";
    setErreurs(err);
    if (Object.keys(err).length) {
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    setEnvoi(true);
    try {
      const totalFinal = total + (livraison ?? 0);
      const r = await fournisseurPaiement.payer({
        lignes: lignes.map((l) => ({ nom: l.nom, quantite: l.quantite, prixUnitaire: prixLigne(l, lignes).unitaire, details: detailLigne(l) })),
        total: totalFinal,
        client: { prenom: v.prenom, nom: v.nom, email: v.email, telephone: v.telephone },
        livraison: { mode: v.mode, adresse: v.mode === "livraison" ? `${v.adresse}, ${v.cp} ${v.ville}` : undefined },
      });
      if (r.statut !== "valide") throw new Error("Le paiement n’a pas abouti.");
      let emailOk: boolean | null = null;
      if (estHumain()) {
        const lignesEmail: [string, string][] = [
          ["Numéro de commande", r.numero],
          ...lignes.map((l) => {
            const { total: t, prixAtelier } = prixLigne(l, lignes);
            const d = detailLigne(l);
            return [`${l.quantite} × ${l.nom}`, `${prix(t)}${prixAtelier ? " (prix atelier)" : ""}${d ? ` — ${d}` : ""}`] as [string, string];
          }),
          ["Remise", v.mode === "retrait" ? `Retrait en boutique, ${adresseComplete()}` : `Livraison : ${v.adresse}, ${v.cp} ${v.ville}`],
          ...(v.mode === "livraison" ? ([["Frais de livraison", livraison === null ? "Communiqués avant l’expédition" : prix(livraison)]] as [string, string][]) : []),
          ["Total TTC", prix(totalFinal)],
        ];
        const res = await envoyerEmails({
          type: "commande",
          reference: r.numero,
          client: { nom: `${v.prenom} ${v.nom}`, email: v.email, telephone: v.telephone },
          sujetClient: `Votre commande Maison Sensa ${r.numero}`,
          sujetBoutique: `Nouvelle commande ${r.numero}`,
          titreClient: "Merci pour votre commande",
          titreBoutique: "Nouvelle commande",
          introClient: `Bonjour ${v.prenom}, voici le récapitulatif de votre commande.`,
          introBoutique: `${v.prenom} ${v.nom} a passé une commande.`,
          lignes: lignesEmail,
          total: prix(totalFinal),
          message: lignes.map((l) => l.options?.carte?.message).filter(Boolean).join(" / "),
        });
        emailOk = res.configure ? res.client : null;
      }
      setFin({ numero: r.numero, total: totalFinal, email: emailOk, lignes });
      vider();
    } catch (er) {
      setErreurs({ global: er instanceof Error ? er.message : "La commande n’a pas abouti. Votre panier est conservé : réessayez dans un instant." });
    } finally {
      setEnvoi(false);
    }
  };

  if (!lignes.length)
    return (
      <div className="mx-auto max-w-xl px-4 pb-24 pt-36 text-center">
        <h1 className="font-serif text-titre font-medium">Votre panier est vide</h1>
        <p className="mt-4 text-encre-douce">Découvrez nos bougies, le format voyage, ou offrez un atelier.</p>
        <LienBouton href="/boutique" className="mt-10">
          Voir la boutique
        </LienBouton>
      </div>
    );

  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-28 sm:px-8 lg:pt-32">
      <h1 className="font-serif text-titre font-medium">Votre panier</h1>
      <div className="mt-12 grid gap-16 lg:grid-cols-[1fr_26rem]">
        <form onSubmit={valider} noValidate className="relative order-2 lg:order-1">
          {champPiege}
          <section aria-labelledby="titre-coord">
            <h2 id="titre-coord" className="font-serif text-3xl font-medium">Vos coordonnées</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <Champ libelle="Prénom" name="prenom" autoComplete="given-name" required value={v.prenom} onChange={(e) => maj("prenom", e.target.value)} erreur={erreurs.prenom} />
              <Champ libelle="Nom" name="nom" autoComplete="family-name" required value={v.nom} onChange={(e) => maj("nom", e.target.value)} erreur={erreurs.nom} />
              <Champ libelle="E-mail" name="email" type="email" autoComplete="email" required value={v.email} onChange={(e) => maj("email", e.target.value)} erreur={erreurs.email} />
              <Champ libelle="Téléphone" name="telephone" type="tel" autoComplete="tel" required value={v.telephone} onChange={(e) => maj("telephone", e.target.value)} erreur={erreurs.telephone} />
            </div>
          </section>
          <section aria-labelledby="titre-remise" className="mt-14">
            <h2 id="titre-remise" className="font-serif text-3xl font-medium">Retrait ou livraison</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="titre-remise">
              {(
                [
                  ["retrait", "Retrait en boutique", "Gratuit, à Boulogne-Billancourt", "boutique"],
                  ["livraison", "Livraison", SITE.fraisLivraison === null ? "Frais communiqués avant l’expédition" : SITE.fraisLivraison === 0 ? "Offerte" : prix(SITE.fraisLivraison), "coffret"],
                ] as const
              ).map(([m, t, d, p]) => (
                <label key={m} className={`flex min-h-20 cursor-pointer items-center gap-4 border px-5 transition-colors ${v.mode === m ? "border-vert bg-ivoire-clair shadow-[inset_0_0_0_1px_var(--vert-profond)]" : "border-encre/20 hover:border-dore"}`}>
                  <input type="radio" name="mode" value={m} checked={v.mode === m} onChange={() => maj("mode", m)} className="size-4 accent-[var(--vert-profond)]" />
                  <Picto nom={p} taille={30} className="text-dore" />
                  <span>
                    <span className="block font-serif text-xl">{t}</span>
                    <span className="text-sm text-encre-douce">{d}</span>
                  </span>
                </label>
              ))}
            </div>
            {v.mode === "livraison" && (
              <div className="mt-8 grid gap-8 sm:grid-cols-[2fr_1fr_1.4fr]">
                <Champ libelle="Adresse" name="adresse" autoComplete="street-address" required value={v.adresse} onChange={(e) => maj("adresse", e.target.value)} erreur={erreurs.adresse} />
                <Champ libelle="Code postal" name="cp" autoComplete="postal-code" inputMode="numeric" required value={v.cp} onChange={(e) => maj("cp", e.target.value)} erreur={erreurs.cp} />
                <Champ libelle="Ville" name="ville" autoComplete="address-level2" required value={v.ville} onChange={(e) => maj("ville", e.target.value)} erreur={erreurs.ville} />
              </div>
            )}
          </section>
          <section aria-labelledby="titre-paiement" className="mt-14">
            <h2 id="titre-paiement" className="font-serif text-3xl font-medium">Paiement sécurisé</h2>
            <div className="mt-6 flex gap-4 border border-encre/15 bg-ivoire-clair p-6">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 shrink-0 text-dore" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
                <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
              </svg>
              <p className="text-encre-douce">
                Le paiement s’effectue sur une page sécurisée de notre prestataire. Aucune donnée bancaire n’est saisie ni conservée sur ce site.
              </p>
            </div>
            <Case className="mt-6" checked={v.cgv} onChange={(e) => maj("cgv", e.target.checked)} erreur={erreurs.cgv} required>
              J’accepte les{" "}
              <Link href="/cgv" target="_blank" className="underline underline-offset-4">
                conditions générales de vente
              </Link>
              .
            </Case>
            {erreurs.global && (
              <p role="alert" className="mt-6 border-l-2 border-erreur pl-4 text-erreur">
                {erreurs.global}
              </p>
            )}
            <Bouton type="submit" enCours={envoi} className="mt-8 w-full sm:w-auto">
              {envoi ? "Validation…" : `Valider la commande · ${prix(total + (livraison ?? 0))}`}
            </Bouton>
          </section>
        </form>

        <aside aria-labelledby="titre-recap" className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
          <div className="bg-ivoire-clair p-6">
            <h2 id="titre-recap" className="font-serif text-2xl font-medium">Récapitulatif</h2>
            <ul className="mt-4 divide-y divide-encre/10">
              {lignes.map((l) => {
                const p = produitParSlug(l.slug);
                const { total: t, prixAtelier } = prixLigne(l, lignes);
                const d = detailLigne(l);
                return (
                  <li key={l.id} className="flex gap-4 py-4">
                    <div className="relative size-16 shrink-0 bg-ivoire">{p && <Image src={`/renders/${p.visuel}.webp`} alt="" fill sizes="64px" className="object-contain p-1" />}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <p className="font-serif text-lg leading-tight">
                          {l.quantite} × {l.nom}
                        </p>
                        <p className="tabular-nums">{prix(t)}</p>
                      </div>
                      {prixAtelier && <p className="text-sm text-dore-texte">Prix atelier</p>}
                      {d && <p className="text-sm text-encre-douce">{d}</p>}
                      <div className="mt-1 flex gap-4 text-sm">
                        <button type="button" className="min-h-9 cursor-pointer underline underline-offset-4" onClick={() => changerQuantite(l.id, l.quantite + 1)} aria-label={`Ajouter un ${l.nom}`}>
                          + 1
                        </button>
                        <button type="button" className="min-h-9 cursor-pointer underline underline-offset-4" onClick={() => retirer(l.id)}>
                          Retirer
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-encre/10 pt-4">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd className="tabular-nums">{prix(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{v.mode === "retrait" ? "Retrait en boutique" : "Livraison"}</dt>
                <dd>{v.mode === "retrait" ? "Gratuit" : livraison === null ? "À confirmer" : prix(livraison)}</dd>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <dt className="uppercase tracking-[0.18em] text-[0.8125rem]">Total TTC</dt>
                <dd className="font-serif text-3xl tabular-nums">{prix(total + (livraison ?? 0))}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
