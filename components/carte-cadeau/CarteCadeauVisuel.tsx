"use client";

import Image from "next/image";
import { Wordmark } from "@/components/brand/Wordmark";
import { prix } from "@/content/site";

/**
 * Carte cadeau dessinée en HTML/CSS d'après supports/carte-cadeau.jpg :
 * volet ivoire (wordmark, « CARTE CADEAU », Pour / De la part de) et volet
 * vert profond avec le flacon. Aperçu en direct sur /carte-cadeau.
 */
export function CarteCadeauVisuel({
  pour,
  de,
  message,
  formule,
  montant,
  inclinable = false,
}: {
  pour?: string;
  de?: string;
  message?: string;
  formule: "atelier" | "montant";
  montant?: number;
  inclinable?: boolean;
}) {
  const incliner = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!inclinable || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--ry", `${(((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--rx", `${(-((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(2)}deg`);
  };
  const remettre = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "0deg");
  };

  return (
    <div
      onPointerMove={incliner}
      onPointerLeave={remettre}
      role="img"
      aria-label={`Carte cadeau Maison Sensa${pour ? `, pour ${pour}` : ""}${de ? `, de la part de ${de}` : ""} : ${
        formule === "atelier" ? "un atelier individuel et un parfum de 50 ml" : `un montant de ${montant ? prix(montant) : "votre choix"}`
      }.`}
      className="relative mx-auto grid aspect-[3/2] w-full max-w-xl grid-cols-[1.25fr_1fr] overflow-hidden bg-ivoire-clair shadow-[0_40px_80px_-40px_rgb(10_20_15/0.6)] transition-transform duration-500 ease-doux [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
    >
      <div className="relative flex flex-col items-center justify-center px-[6%] text-center text-encre">
        <span aria-hidden="true" className="absolute inset-[4%] border border-dore/60" />
        <Wordmark decoratif className="w-[44%]" />
        <span aria-hidden="true" className="mt-[5%] block h-px w-[14%] bg-dore" />
        <p className="mt-[5%] font-serif text-[clamp(1rem,3.2vw,1.9rem)] font-medium uppercase tracking-[0.08em]">Carte cadeau</p>
        <p className="mt-[2%] font-serif text-[clamp(0.75rem,1.9vw,1.05rem)] italic">Offrez une signature olfactive</p>
        <p className="mt-[2%] text-[clamp(0.55rem,1.35vw,0.78rem)] leading-snug text-encre-douce">
          {formule === "atelier" ? "Un atelier individuel et un parfum de 50 ml" : `D’une valeur de ${montant ? prix(montant) : "…"}`}
        </p>
        <dl className="mt-[6%] w-full space-y-[3%] text-left text-[clamp(0.55rem,1.35vw,0.8rem)]">
          <div className="flex items-end gap-2">
            <dt className="shrink-0 font-serif italic">Pour :</dt>
            <dd className="min-w-0 flex-1 truncate border-b border-encre/40 pb-[1px] font-serif text-[1.15em]">{pour || " "}</dd>
          </div>
          <div className="flex items-end gap-2">
            <dt className="shrink-0 font-serif italic">De la part de :</dt>
            <dd className="min-w-0 flex-1 truncate border-b border-encre/40 pb-[1px] font-serif text-[1.15em]">{de || " "}</dd>
          </div>
        </dl>
        {message && <p className="mt-[3%] line-clamp-2 w-full text-left font-serif text-[clamp(0.55rem,1.3vw,0.78rem)] italic text-encre-douce">« {message} »</p>}
      </div>
      <div className="relative bg-vert">
        <span aria-hidden="true" className="absolute inset-[5%] border border-dore/50" />
        <div className="absolute inset-[10%]">
          <Image src="/renders/flacon-trois-quarts-droite.webp" alt="" fill sizes="(min-width: 640px) 220px, 40vw" className="object-contain" />
        </div>
      </div>
    </div>
  );
}
