import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Surtitre } from "@/components/brand/Signes";
import { PRODUITS } from "@/content/produits";
import { familleParCle } from "@/content/familles";
import { prix } from "@/content/site";

export const metadata: Metadata = {
  title: "La boutique",
  description: "Bougies parfumées, format voyage, recharge, coffret et carte cadeau Maison Sensa. Boutique ouverte sans rendez-vous à Boulogne-Billancourt.",
};

const bougies = PRODUITS.filter((p) => p.type === "bougie");
const autres = PRODUITS.filter((p) => p.type !== "bougie" && p.type !== "atelier");
const atelier = PRODUITS.find((p) => p.type === "atelier")!;

function Prix({ v }: { v: number | null }) {
  return <span className="tabular-nums">{v === null ? "Sur demande en boutique" : prix(v)}</span>;
}

export default function PageBoutique() {
  return (
    <>
      <section className="relative h-[62svh] min-h-[26rem] overflow-hidden">
        <Image src="/images/deux-espaces-interieur.jpg" alt="L’espace boutique : tables de bougies, coffrets verts et comptoirs en noyer cannelé." fill priority sizes="100vw" quality={85} className="object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ivoire via-ivoire/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[90rem] px-4 pb-10 sm:px-8">
          <Surtitre>Sans rendez-vous</Surtitre>
          <h1 className="mt-4 font-serif text-hero font-medium">La boutique</h1>
        </div>
      </section>

      <section aria-labelledby="titre-bougies" className="mx-auto max-w-[90rem] px-4 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="titre-bougies" className="font-serif text-titre font-medium">Les bougies parfumées</h2>
            <p className="mt-3 max-w-xl text-encre-douce">Une bougie par famille olfactive, pour prolonger l’univers de votre parfum chez vous. 59&nbsp;€, ou 45&nbsp;€ avec un atelier.</p>
          </div>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {bougies.map((b) => {
            const f = familleParCle(b.famille!);
            return (
              <li key={b.slug}>
                <Link href={`/boutique/${b.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden" style={{ background: `linear-gradient(170deg, ${f.ambiance[0]}, ${f.ambiance[1]})` }}>
                    <Image src={`/renders/${b.visuel}.webp`} alt="" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-contain p-[10%] transition-transform duration-700 ease-doux group-hover:scale-[1.04]" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl">{b.nom}</h3>
                  <p className="text-encre-douce">
                    {f.notes.join(" · ")} — <Prix v={b.prix} />
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="titre-gamme" className="bg-ivoire-clair/70 py-20">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
          <h2 id="titre-gamme" className="font-serif text-titre font-medium">Pour emporter et offrir</h2>
          <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {autres.map((p, i) => (
              <li key={p.slug} className={i % 2 ? "lg:mt-16" : ""}>
                <Link href={p.type === "carte-cadeau" ? "/carte-cadeau" : `/boutique/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-ivoire">
                    <Image src={`/renders/${p.visuel}.webp`} alt="" fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" className="object-contain p-[12%] transition-transform duration-700 ease-doux group-hover:scale-[1.04]" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl">{p.nom}</h3>
                  <p className="text-encre-douce">{p.accroche}</p>
                  <p className="mt-1"><Prix v={p.prix} /></p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="titre-atelier-boutique" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-24 sm:px-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src="/images/atelier-table.jpg" alt="La table de l’atelier, sous la suspension en laiton." fill sizes="(min-width: 768px) 45vw, 100vw" quality={85} className="object-cover" />
        </div>
        <div>
          <Surtitre>Sur rendez-vous</Surtitre>
          <h2 id="titre-atelier-boutique" className="mt-4 font-serif text-titre font-medium">{atelier.nom}</h2>
          <p className="mt-4 text-encre-douce">{atelier.description}</p>
          <p className="mt-4 font-serif text-3xl"><Prix v={atelier.prix} /></p>
          <Link href="/atelier#reserver" className="mt-8 inline-flex min-h-12 items-center bg-vert px-8 text-[0.8125rem] uppercase tracking-[0.24em] text-ivoire-clair hover:bg-vert-nuit">
            Réserver mon atelier
          </Link>
        </div>
      </section>
    </>
  );
}
