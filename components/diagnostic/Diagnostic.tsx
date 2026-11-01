"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FAMILLES, familleParCle, type CleFamille } from "@/content/familles";
import { QUESTIONS_EVOCATION, SENTEURS, TEXTES_RESULTAT } from "@/content/diagnostic";
import { DessinBotanique, type Forme } from "@/components/scenes/Botaniques";
import { Bouton } from "@/components/ui/Bouton";
import { Puce } from "@/components/ui/Champs";
import { useProfil, type ProfilOlfactif } from "@/stores/profil";
import { prix } from "@/content/site";
import { PRIX } from "@/content/produits";

const FORME: Record<CleFamille, Forme> = { frais: "zeste", floral: "petale", boise: "chene", ambre: "goutte" };
const TOUCHE: Record<CleFamille, string> = { frais: "fraîche", floral: "florale", boise: "boisée", ambre: "ambrée" };

type Reponses = {
  occasion?: "moi" | "offrir";
  evocations: Record<string, CleFamille>;
  intensite?: ProfilOlfactif["intensite"];
  favorites: string[];
  aEviter: string[];
  usage?: ProfilOlfactif["usage"];
};

// Écrans : 0 accueil · 1 occasion · 2-4 évocations · 5 intensité · 6 favorites · 7 à éviter · 8 usage · 9 résultat
const NB_QUESTIONS = 8;

function calculer(r: Reponses): { dominante: CleFamille; secondaire: CleFamille } {
  const score: Record<CleFamille, number> = { frais: 0, floral: 0, boise: 0, ambre: 0 };
  Object.values(r.evocations).forEach((f) => (score[f] += 2));
  r.favorites.forEach((n) => {
    const f = SENTEURS.find((s) => s.nom === n)?.famille;
    if (f) score[f] += 1;
  });
  r.aEviter.forEach((n) => {
    const f = SENTEURS.find((s) => s.nom === n)?.famille;
    if (f) score[f] -= 1.5;
  });
  const tri = (Object.keys(score) as CleFamille[]).sort((a, b) => score[b] - score[a] || FAMILLES.findIndex((f) => f.cle === a) - FAMILLES.findIndex((f) => f.cle === b));
  return { dominante: tri[0], secondaire: tri[1] };
}

export function Diagnostic() {
  const [ecran, setEcran] = useState(0);
  const [r, setR] = useState<Reponses>({ evocations: {}, favorites: [], aEviter: [] });
  const titre = useRef<HTMLHeadingElement>(null);
  const reduit = useReducedMotion();
  const enregistrer = useProfil((s) => s.enregistrer);
  const router = useRouter();

  useEffect(() => {
    if (ecran > 0) titre.current?.focus();
  }, [ecran]);

  const suivant = () => setEcran((e) => e + 1);
  const precedent = () => setEcran((e) => Math.max(0, e - 1));
  const resultat = ecran === 9 ? calculer(r) : null;

  const profil = (): ProfilOlfactif | null =>
    resultat && r.occasion && r.intensite && r.usage
      ? { occasion: r.occasion, ...resultat, intensite: r.intensite, usage: r.usage, favorites: r.favorites, aEviter: r.aEviter, date: new Date().toISOString() }
      : null;

  useEffect(() => {
    const p = profil();
    if (p) enregistrer(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ecran]);

  const Choix = <T extends string>({ valeur, options, onChoisir }: { valeur?: T; options: { v: T; l: string }[]; onChoisir: (v: T) => void }) => (
    <div className="mt-10 grid gap-3 sm:grid-cols-3" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={valeur === o.v}
          onClick={() => {
            onChoisir(o.v);
            setTimeout(suivant, reduit ? 0 : 280);
          }}
          className={`min-h-16 cursor-pointer border px-6 font-serif text-xl transition-colors duration-300 ${valeur === o.v ? "border-vert bg-vert text-ivoire-clair" : "border-encre/25 hover:border-dore hover:bg-ivoire-clair"}`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );

  let contenu: React.ReactNode = null;
  if (ecran === 1)
    contenu = (
      <>
        <Titre r={titre}>Votre occasion</Titre>
        <Choix valeur={r.occasion} options={[{ v: "moi", l: "Pour moi" }, { v: "offrir", l: "Pour offrir" }]} onChoisir={(v) => setR({ ...r, occasion: v })} />
      </>
    );
  if (ecran >= 2 && ecran <= 4) {
    const q = QUESTIONS_EVOCATION[ecran - 2];
    contenu = (
      <>
        <Titre r={titre}>{q.question}</Titre>
        <div className="mt-10 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label={q.question}>
          {q.choix.map((c) => {
            const f = familleParCle(c.famille);
            const actif = r.evocations[q.id] === c.famille;
            return (
              <button
                key={c.libelle}
                type="button"
                role="radio"
                aria-checked={actif}
                onClick={() => {
                  setR({ ...r, evocations: { ...r.evocations, [q.id]: c.famille } });
                  setTimeout(suivant, reduit ? 0 : 280);
                }}
                className={`group flex min-h-28 cursor-pointer items-center gap-5 border p-5 text-left transition-[border-color,box-shadow] duration-300 ${actif ? "border-vert shadow-[inset_0_0_0_1px_var(--vert-profond)]" : "border-encre/15 hover:border-dore"}`}
                style={{ background: `linear-gradient(120deg, ${f.ambiance[0]}, ${f.ambiance[1]}55)` }}
              >
                <span aria-hidden="true" className="size-16 shrink-0 transition-transform duration-500 ease-doux group-hover:rotate-6">
                  <DessinBotanique forme={FORME[c.famille]} />
                </span>
                <span className="font-serif text-xl leading-snug">{c.libelle}</span>
              </button>
            );
          })}
        </div>
      </>
    );
  }
  if (ecran === 5)
    contenu = (
      <>
        <Titre r={titre}>L’intensité souhaitée</Titre>
        <Choix
          valeur={r.intensite}
          options={[
            { v: "discrete", l: "Discrète" },
            { v: "moderee", l: "Modérée" },
            { v: "presente", l: "Présente" },
          ]}
          onChoisir={(v) => setR({ ...r, intensite: v })}
        />
      </>
    );
  if (ecran === 6 || ecran === 7) {
    const cle = ecran === 6 ? "favorites" : "aEviter";
    const autre = ecran === 6 ? "aEviter" : "favorites";
    contenu = (
      <>
        <Titre r={titre}>{ecran === 6 ? "Vos senteurs favorites" : "Les senteurs à éviter"}</Titre>
        <p className="mt-3 text-encre-douce">Plusieurs choix possibles, ou aucun.</p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {SENTEURS.filter((s) => !r[autre].includes(s.nom)).map((s) => (
            <Puce
              key={s.nom}
              selectionnee={r[cle].includes(s.nom)}
              onBasculer={() => setR({ ...r, [cle]: r[cle].includes(s.nom) ? r[cle].filter((x) => x !== s.nom) : [...r[cle], s.nom] })}
            >
              {s.nom}
            </Puce>
          ))}
        </div>
        <Bouton className="mt-10" onClick={suivant} fleche>
          Continuer
        </Bouton>
      </>
    );
  }
  if (ecran === 8)
    contenu = (
      <>
        <Titre r={titre}>Pour quel usage ?</Titre>
        <Choix
          valeur={r.usage}
          options={[
            { v: "quotidien", l: "Au quotidien" },
            { v: "sortie", l: "Pour sortir" },
            { v: "occasion", l: "Pour une occasion" },
          ]}
          onChoisir={(v) => setR({ ...r, usage: v })}
        />
      </>
    );

  if (ecran === 0) return <Accueil onCommencer={suivant} />;

  if (ecran === 9 && resultat) {
    const d = familleParCle(resultat.dominante);
    const s = familleParCle(resultat.secondaire);
    return (
      <section aria-labelledby="titre-resultat" className="relative overflow-hidden pb-24 pt-28" style={{ background: `radial-gradient(ellipse 80% 70% at 70% 40%, ${d.ambiance[0]}, ${d.ambiance[1]})` }}>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-8" style={{ color: d.encre }}>
          <p className="text-surtitre uppercase tracking-[0.36em]">Votre diagnostic</p>
          <h1 id="titre-resultat" ref={titre} tabIndex={-1} className="mt-6 font-serif text-hero font-medium outline-none">
            {d.nom}
            <span className="block font-serif text-sous-titre italic">et une touche {TOUCHE[s.cle]}</span>
          </h1>
          <span aria-hidden="true" className="mt-8 block h-px w-12 bg-dore" />
          <div className="mt-8 grid gap-12 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-lg leading-relaxed">{TEXTES_RESULTAT[d.cle]}</p>
              <p className="mt-6 text-sm uppercase tracking-[0.2em]">Trois notes à explorer</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {d.notes.map((n) => (
                  <li key={n} className="border border-current/30 px-4 py-2 font-serif text-lg">
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-8 italic">C’est une piste à explorer avec votre conseiller, pas un parfum défini à l’avance : votre composition se fera ensemble, en atelier.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Bouton onClick={() => router.push("/atelier#reserver")} fleche>
                  Réserver mon atelier avec ce profil
                </Bouton>
                <Bouton variante="contour" onClick={() => setEcran(1)}>
                  Recommencer
                </Bouton>
              </div>
            </div>
            <aside className="bg-ivoire-clair/80 p-6 text-encre backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-encre-douce">Pour prolonger chez vous</p>
              <div className="relative mx-auto my-4 aspect-square w-40">
                <Image src="/renders/bougie-trois-quarts-gauche.webp" alt="" fill sizes="160px" className="object-contain" />
              </div>
              <p className="font-serif text-2xl">Bougie {d.nom}</p>
              <p className="mt-1 text-encre-douce">De la même famille olfactive que votre future signature. {prix(PRIX.bougie)}, {prix(PRIX.bougieAvecAtelier)} avec un atelier.</p>
              <Link href={`/boutique/bougie-${d.cle}`} className="mt-4 inline-flex min-h-11 items-center underline decoration-dore underline-offset-4">
                Découvrir la bougie {d.nom}
              </Link>
            </aside>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Diagnostic olfactif" className="mx-auto min-h-svh max-w-4xl px-4 pb-24 pt-28 sm:px-8 lg:pt-32">
      <div className="flex items-center justify-between text-sm text-encre-douce">
        <button type="button" onClick={precedent} className="min-h-11 cursor-pointer underline-offset-4 hover:underline">
          ‹ Précédent
        </button>
        <span aria-live="polite">
          Question {ecran} sur {NB_QUESTIONS}
        </span>
      </div>
      <div className="relative mt-3 h-px bg-encre/10" role="progressbar" aria-label="Progression du diagnostic" aria-valuemin={0} aria-valuemax={NB_QUESTIONS} aria-valuenow={ecran}>
        <span className="absolute inset-y-0 left-0 bg-dore transition-[width] duration-700 ease-doux" style={{ width: `${(ecran / NB_QUESTIONS) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={ecran} initial={{ opacity: 0, x: reduit ? 0 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduit ? 0 : -24 }} transition={{ duration: reduit ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }} className="mt-14">
          {contenu}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Titre({ children, r }: { children: React.ReactNode; r: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <h1 ref={r} tabIndex={-1} className="font-serif text-titre font-medium outline-none">
      {children}
    </h1>
  );
}

function Accueil({ onCommencer }: { onCommencer: () => void }) {
  return (
    <section className="pt-24 lg:pt-28">
      <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-4 pb-20 sm:px-8 lg:grid-cols-2">
        <div className="relative aspect-[941/880] w-full max-w-[44rem] overflow-hidden rounded-t-[10rem]">
          <Image
            src="/images/atelier-mouillette.jpg"
            alt="Une main tient une mouillette au-dessus du comptoir, près d’un flacon, d’une bougie et d’un coffret Maison Sensa."
            fill
            priority
            sizes="(min-width: 1024px) 44rem, 100vw"
            quality={85}
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-surtitre uppercase tracking-[0.36em] text-dore-texte">Diagnostic olfactif</p>
          <h1 className="mt-6 font-serif text-hero font-medium">Un parfum qui vous ressemble.</h1>
          <span aria-hidden="true" className="mt-8 block h-px w-12 bg-dore" />
          <p className="mt-8 max-w-md text-lg text-encre-douce">
            Huit questions, deux minutes. Vos réponses dessinent une piste parmi nos quatre familles olfactives, à explorer ensuite avec votre conseiller.
          </p>
          <Bouton className="mt-10" onClick={onCommencer} fleche>
            Commencer
          </Bouton>
        </div>
      </div>
    </section>
  );
}
