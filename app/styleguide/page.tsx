import type { Metadata } from "next";
import Image from "next/image";
import { Wordmark } from "@/components/brand/Wordmark";
import { CadreDore, EntreFilets, Filet, Surtitre } from "@/components/brand/Signes";
import { Arche } from "@/components/brand/Arche";
import { Picto, type NomPicto } from "@/components/brand/Pictos";
import { Bouton, LienBouton } from "@/components/ui/Bouton";
import { DemoFormulaire } from "./DemoFormulaire";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const COULEURS = [
  { nom: "Ivoire", jeton: "--ivoire", hex: "#F6EDDD", usage: "Fond principal", texte: "encre" },
  { nom: "Ivoire clair", jeton: "--ivoire-clair", hex: "#FBF6EE", usage: "Surfaces, cartes", texte: "encre" },
  { nom: "Travertin", jeton: "--travertin", hex: "#E8DCC8", usage: "Séparations, fonds secondaires", texte: "encre" },
  { nom: "Vert profond", jeton: "--vert-profond", hex: "#1F3A2E", usage: "Actions, bandeaux, pied de page", texte: "ivoire" },
  { nom: "Vert nuit", jeton: "--vert-nuit", hex: "#142820", usage: "Survols, sections nuit", texte: "ivoire" },
  { nom: "Doré", jeton: "--dore", hex: "#C9A26A", usage: "Filets, pictos, très grands titres", texte: "encre" },
  { nom: "Doré texte", jeton: "--dore-texte", hex: "#7A5D2C", usage: "Petit texte doré sur ivoire (5,3:1)", texte: "ivoire" },
  { nom: "Noyer", jeton: "--noyer", hex: "#64371B", usage: "Accents chauds, textures", texte: "ivoire" },
  { nom: "Encre", jeton: "--encre", hex: "#1C1A17", usage: "Texte courant (15:1 sur ivoire)", texte: "ivoire" },
  { nom: "Encre douce", jeton: "--encre-douce", hex: "#5B544A", usage: "Texte secondaire (6,4:1)", texte: "ivoire" },
];

const PICTOS: NomPicto[] = [
  "personnes",
  "horloge",
  "flacon",
  "etiquette",
  "bougie",
  "voyage",
  "coffret",
  "cadeau",
  "recharge",
  "boutique",
  "calendrier",
  "lieu",
  "telephone",
  "courriel",
  "panier",
  "rotation",
];

function Section({ numero, titre, children }: { numero: string; titre: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-encre/10 py-16 md:py-24" aria-labelledby={`s-${numero}`}>
      <div className="mb-10 flex items-baseline gap-6">
        <span className="font-serif text-2xl text-dore-texte">{numero}</span>
        <h2 id={`s-${numero}`} className="font-serif text-sous-titre font-medium">
          {titre}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function Styleguide() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-8">
      <header className="py-20 text-center md:py-28">
        <Surtitre>Design system</Surtitre>
        <h1 className="mt-6 font-serif text-hero font-medium">Maison Sensa</h1>
        <Filet className="mt-8" />
        <p className="mx-auto mt-8 max-w-xl text-encre-douce">
          Les éléments communs du site : couleurs, typographie, wordmark, signes graphiques, boutons et formulaires.
        </p>
      </header>

      <Section numero="01" titre="Wordmark">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex aspect-[4/3] items-center justify-center bg-ivoire-clair px-10">
            <Wordmark teinte="encre" className="w-56" />
          </div>
          <div className="flex aspect-[4/3] items-center justify-center bg-vert px-10">
            <Wordmark teinte="ivoire" className="w-56" />
          </div>
          <div className="flex aspect-[4/3] items-center justify-center bg-vert-nuit px-10">
            <Wordmark teinte="dore" className="w-56" />
          </div>
        </div>
        <p className="mt-6 text-sm text-encre-douce">
          Tracés vectoriels générés depuis les polices du site (scripts/generer-wordmark.mjs). Versions encre, ivoire et dorée.
        </p>
      </Section>

      <Section numero="02" titre="Couleurs">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COULEURS.map((c) => (
            <li key={c.jeton}>
              <div
                className="flex aspect-square items-end p-3 text-xs"
                style={{ background: `var(${c.jeton})`, color: c.texte === "encre" ? "var(--encre)" : "var(--ivoire-clair)", boxShadow: "inset 0 0 0 1px rgb(28 26 23 / 0.08)" }}
              >
                {c.hex}
              </div>
              <p className="mt-2 font-medium">{c.nom}</p>
              <p className="text-sm leading-snug text-encre-douce">{c.usage}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section numero="03" titre="Typographie">
        <div className="space-y-10">
          <div>
            <Surtitre ton="encre">Héros · Cormorant Garamond 500</Surtitre>
            <p className="mt-3 font-serif text-hero font-medium">Votre parfum, votre signature.</p>
          </div>
          <div>
            <Surtitre ton="encre">Titre de section</Surtitre>
            <p className="mt-3 font-serif text-titre font-medium">Deux espaces, une expérience</p>
          </div>
          <div>
            <Surtitre ton="encre">Sous-titre · italique</Surtitre>
            <p className="mt-3 font-serif text-sous-titre italic">Une odeur peut faire revenir un souvenir.</p>
          </div>
          <div className="max-w-2xl">
            <Surtitre ton="encre">Texte courant · Jost 400</Surtitre>
            <p className="mt-3">
              Pendant l’Atelier Signature, un conseiller vous accompagne pendant 45 à 60 minutes. Vous explorez les familles
              olfactives, puis vous composez votre parfum selon vos goûts, parmi nos accords.
            </p>
            <p className="mt-3 text-encre-douce">Texte secondaire : précisions, mentions, aides.</p>
          </div>
          <div>
            <Surtitre>Surtitre · petites capitales espacées</Surtitre>
          </div>
        </div>
      </Section>

      <Section numero="04" titre="Signes graphiques">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="text-center">
            <h3 className="font-serif text-3xl font-medium">La bougie parfumée</h3>
            <Filet className="mt-5" />
            <p className="mt-5 font-serif text-xl italic">Prolongez l’émotion chez vous</p>
          </div>
          <EntreFilets>
            <h3 className="text-center font-serif text-3xl font-medium">Deux espaces, une expérience</h3>
          </EntreFilets>
          <CadreDore double className="bg-ivoire-clair px-8 py-10 text-center">
            <Surtitre>Atelier Signature</Surtitre>
            <p className="mt-4 font-serif text-6xl font-medium text-vert">149 €</p>
            <p className="mt-3 text-encre-douce">Accompagnement individuel · 45 à 60 minutes · Parfum 50 ml</p>
          </CadreDore>
          <div className="bg-vert px-8 py-10 text-center text-ivoire-clair">
            <p className="font-serif text-3xl text-dore-clair">Offrez une signature olfactive</p>
            <span aria-hidden="true" className="mx-auto mt-5 block h-px w-12 bg-dore" />
            <p className="mt-5 text-ivoire/80">Bandeau vert profond, texte doré.</p>
          </div>
        </div>
      </Section>

      <Section numero="05" titre="Pictogrammes">
        <ul className="grid grid-cols-4 gap-6 text-dore sm:grid-cols-8">
          {PICTOS.map((p) => (
            <li key={p} className="flex flex-col items-center gap-2">
              <Picto nom={p} taille={36} />
              <span className="text-xs text-encre-douce">{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-14 grid grid-cols-2 divide-encre/15 border-y border-encre/15 sm:grid-cols-4 sm:divide-x">
          {(
            [
              ["personnes", "Accompagnement individuel"],
              ["horloge", "45 à 60 minutes"],
              ["flacon", "Parfum 50 ml"],
              ["etiquette", "149 €"],
            ] as const
          ).map(([p, t]) => (
            <div key={p} className="flex flex-col items-center gap-3 px-4 py-8 text-center">
              <Picto nom={p} taille={44} className="text-dore" />
              <span className="font-serif text-lg">{t}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section numero="06" titre="Boutons">
        <div className="flex flex-wrap items-center gap-5">
          <Bouton>Réserver mon atelier</Bouton>
          <Bouton variante="contour">Faire mon diagnostic</Bouton>
          <LienBouton href="/styleguide" variante="lien" fleche>
            Voir la boutique
          </LienBouton>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-5 bg-vert p-8">
          <Bouton variante="dore">Sur rendez-vous</Bouton>
          <Bouton variante="ivoire" fleche>
            Offrir une carte
          </Bouton>
        </div>
      </Section>

      <Section numero="07" titre="Formulaires">
        <DemoFormulaire />
      </Section>

      <Section numero="08" titre="Images en arche">
        <div className="grid gap-10 sm:grid-cols-3">
          <Arche filet ratio="3 / 4">
            <Image src="/images/atelier-conseil-client.jpg" alt="Une conseillère et un client sentent une mouillette à la table de l’atelier." fill sizes="(min-width: 640px) 30vw, 90vw" className="object-cover object-[35%_center]" />
          </Arche>
          <Arche ratio="3 / 4">
            <Image src="/images/parcours-2-j-emporte.jpg" alt="Une cliente découvre son flacon Maison Sensa au comptoir." fill sizes="(min-width: 640px) 30vw, 90vw" className="object-cover" />
          </Arche>
          <Arche ratio="3 / 4">
            <Image src="/images/deux-espaces-atelier.jpg" alt="Un flacon, des mouillettes et des flacons d’essai sur un socle en travertin." fill sizes="(min-width: 640px) 30vw, 90vw" className="object-cover" />
          </Arche>
        </div>
      </Section>
    </main>
  );
}
