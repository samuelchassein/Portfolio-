import Image from "next/image";
import Link from "next/link";
import { Revelation } from "./Revelation";
import { Surtitre } from "@/components/brand/Signes";
import { Picto } from "@/components/brand/Pictos";
import { LienBouton } from "@/components/ui/Bouton";
import { CarteCadeauVisuel } from "@/components/carte-cadeau/CarteCadeauVisuel";
import { LettreInformation } from "@/components/layout/LettreInformation";
import { SITE, adresseComplete } from "@/content/site";

/** Scène 6 : visite 360°. Mur des familles (rangée du haut, étiquettes floutées). */
export function VisiteTeaser() {
  return (
    <section aria-labelledby="titre-visite" className="relative">
      <div className="relative h-[70svh] min-h-[26rem] overflow-hidden md:h-[min(80svh,56rem)]">
        <Image
          src="/images/mur-familles-haut.jpg"
          alt="Le mur des familles : quatre niches en arche éclairées, avec flacons, bougies et coffrets, sous l’enseigne Maison Sensa."
          fill
          sizes="100vw"
          quality={85}
          className="object-cover object-[50%_55%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-encre/45 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-12 text-center text-ivoire-clair">
          <Link
            href="/visite"
            className="pulsation group relative flex size-36 items-center justify-center rounded-full border border-dore-clair bg-vert/85 text-center backdrop-blur-sm transition-colors duration-500 hover:bg-vert md:size-44"
          >
            <span className="flex flex-col items-center gap-2 px-4">
              <Picto nom="rotation" taille={30} className="text-dore-clair" />
              <span className="text-[0.75rem] uppercase leading-snug tracking-[0.2em]">
                Visiter la boutique
                <br />
                en 360°
              </span>
            </span>
          </Link>
          <h2 id="titre-visite" className="mt-8 font-serif text-sous-titre font-medium [text-shadow:0_1px_18px_rgb(20_14_8/0.4)]">
            Entrez sans pousser la porte
          </h2>
        </div>
      </div>
    </section>
  );
}

/** Scène 7 : carte cadeau, section vert profond. */
export function CarteCadeauTeaser() {
  return (
    <Revelation as="section" aria-labelledby="titre-carte" className="bg-vert py-28 text-ivoire-clair md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 sm:px-8 md:grid-cols-2">
        <div data-reveler className="order-2 md:order-1">
          <Surtitre ton="ivoire">Carte cadeau</Surtitre>
          <h2 id="titre-carte" className="mt-6 font-serif text-titre font-medium text-dore-clair">
            Offrez une signature olfactive
          </h2>
          <span aria-hidden="true" className="mt-6 block h-px w-12 bg-dore" />
          <p className="mt-6 max-w-md text-ivoire/80">
            Un atelier individuel et un parfum de 50 ml, ou le montant de votre choix, avec votre message.
          </p>
          <LienBouton href="/carte-cadeau" variante="ivoire" fleche className="mt-10">
            Composer la carte
          </LienBouton>
        </div>
        <div data-reveler className="order-1 [perspective:1100px] md:order-2">
          <CarteCadeauVisuel pour="Camille" de="Julien" formule="atelier" inclinable />
        </div>
      </div>
    </Revelation>
  );
}

/** Scène 8 : infos pratiques, plan et lettre d'information. */
export function InfosPratiques() {
  return (
    <Revelation as="section" aria-labelledby="titre-infos" className="py-28 md:py-36">
      <div className="mx-auto grid max-w-[90rem] gap-16 px-4 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div>
          <Surtitre>Nous rendre visite</Surtitre>
          <h2 id="titre-infos" className="mt-6 font-serif text-titre font-medium">
            La boutique de Boulogne-Billancourt
          </h2>
          <dl className="mt-12 grid gap-10 sm:grid-cols-2">
            <div data-reveler>
              <dt className="flex items-center gap-3 text-[0.8125rem] uppercase tracking-[0.2em] text-encre-douce">
                <Picto nom="lieu" taille={22} className="text-dore" /> Adresse
              </dt>
              <dd className="mt-3 font-serif text-xl leading-snug">{adresseComplete()}</dd>
            </div>
            <div data-reveler>
              <dt className="flex items-center gap-3 text-[0.8125rem] uppercase tracking-[0.2em] text-encre-douce">
                <Picto nom="horloge" taille={22} className="text-dore" /> Horaires
              </dt>
              {SITE.horaires.map((h) => (
                <dd key={h.jours} className="mt-3 leading-snug">
                  <span className="font-serif text-xl">{h.jours}</span>
                  <br />
                  <span className="text-encre-douce">{h.heures}</span>
                </dd>
              ))}
            </div>
            <div data-reveler>
              <dt className="flex items-center gap-3 text-[0.8125rem] uppercase tracking-[0.2em] text-encre-douce">
                <Picto nom="courriel" taille={22} className="text-dore" /> Écrire
              </dt>
              <dd className="mt-3">
                <a href={`mailto:${SITE.email}`} className="font-serif text-xl underline decoration-dore underline-offset-4">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div data-reveler>
              <dt className="flex items-center gap-3 text-[0.8125rem] uppercase tracking-[0.2em] text-encre-douce">
                <Picto nom="telephone" taille={22} className="text-dore" /> Appeler
              </dt>
              <dd className="mt-3 font-serif text-xl">{SITE.telephone}</dd>
            </div>
          </dl>
          <div data-reveler className="mt-14 border-t border-encre/10 pt-10">
            <LettreInformation />
          </div>
        </div>
        <div data-reveler>
          <PlanStylise />
        </div>
      </div>
    </Revelation>
  );
}

/**
 * Plan stylisé (aucune carte tierce chargée sans action : pas de cookie ni de
 * requête vers un service de cartographie). Lien vers OpenStreetMap.
 */
function PlanStylise() {
  return (
    <figure className="relative">
      <div className="relative aspect-[4/3.4] overflow-hidden bg-travertin/70">
        <svg viewBox="0 0 400 340" className="absolute inset-0 size-full" aria-hidden="true">
          <defs>
            <pattern id="ilots" width="56" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
              <rect width="48" height="36" rx="3" fill="#E9DCC6" />
            </pattern>
          </defs>
          <rect width="400" height="340" fill="#EFE5D4" />
          <rect width="400" height="340" fill="url(#ilots)" />
          <path d="M-20 250C80 220 150 260 230 230S360 170 430 190" stroke="#C9D3C2" strokeWidth="34" fill="none" opacity=".8" />
          <path d="M-10 90L410 40M60 -10L120 350M250 -10L310 350M-10 300L410 220" stroke="#FBF6EE" strokeWidth="9" fill="none" />
          <path d="M-10 160L410 120M170 -10L210 350" stroke="#FBF6EE" strokeWidth="14" fill="none" />
          <circle cx="196" cy="140" r="26" fill="#C9A26A" opacity=".18" />
          <circle cx="196" cy="140" r="9" fill="#1F3A2E" />
          <circle cx="196" cy="140" r="3.5" fill="#D4AC70" />
        </svg>
        <span className="absolute left-[52%] top-[37%] bg-ivoire-clair px-3 py-1.5 text-[0.75rem] uppercase tracking-[0.2em] shadow-sm">Maison Sensa</span>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-encre-douce">
        <span>Plan indicatif : l’adresse exacte est à confirmer.</span>
        <a href={SITE.adresse.lienPlan} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center underline decoration-dore underline-offset-4 hover:text-encre">
          Ouvrir dans OpenStreetMap<span className="sr-only"> (nouvelle fenêtre)</span>
        </a>
      </figcaption>
    </figure>
  );
}
