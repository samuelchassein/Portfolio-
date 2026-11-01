"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Bandeau cookies minimal : refuser est aussi simple qu'accepter (deux boutons
 * identiques). Le site n'utilise aujourd'hui que du stockage nécessaire ; le
 * choix est conservé pour un éventuel outil de mesure d'audience.
 */
export function BandeauCookies() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      setVisible(!localStorage.getItem("ms-cookies"));
    } catch {
      setVisible(false);
    }
  }, []);
  const choisir = (c: "accepte" | "refuse") => {
    try {
      localStorage.setItem("ms-cookies", JSON.stringify({ choix: c, date: new Date().toISOString() }));
    } catch {
      /* rien */
    }
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <div role="region" aria-label="Cookies" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl border border-encre/10 bg-ivoire-clair/95 p-5 shadow-[0_20px_60px_-30px_rgb(28_26_23/0.5)] backdrop-blur-md sm:inset-x-6 sm:bottom-6">
      <p className="text-[0.9375rem] leading-relaxed">
        Nous utilisons uniquement le stockage nécessaire au fonctionnement du site (panier, préférences). Une mesure d’audience pourrait être ajoutée avec votre accord.{" "}
        <Link href="/cookies" className="underline underline-offset-4">
          En savoir plus
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => choisir("refuse")} className="min-h-11 flex-1 cursor-pointer border border-encre/70 px-5 text-[0.75rem] uppercase tracking-[0.22em] hover:bg-encre hover:text-ivoire-clair">
          Refuser
        </button>
        <button type="button" onClick={() => choisir("accepte")} className="min-h-11 flex-1 cursor-pointer border border-encre/70 px-5 text-[0.75rem] uppercase tracking-[0.22em] hover:bg-encre hover:text-ivoire-clair">
          Accepter
        </button>
      </div>
    </div>
  );
}
