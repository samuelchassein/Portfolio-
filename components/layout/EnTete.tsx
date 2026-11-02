"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { NAVIGATION } from "@/content/site";
import { nombreArticles, usePanier } from "@/stores/panier";

/**
 * En-tête fixe : wordmark, navigation, bouton Réserver toujours visible,
 * panier. Transparent en haut de page, fond ivoire translucide ensuite.
 * Mobile : menu plein écran (dialogue modal natif, Échap pour fermer).
 */
export function EnTete() {
  const chemin = usePathname();
  const [defile, setDefile] = useState(false);
  const [monte, setMonte] = useState(false);
  const lignes = usePanier((s) => s.lignes);
  const ouvrirPanier = usePanier((s) => s.ouvrir);
  const n = monte ? nombreArticles(lignes) : 0;
  const menu = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setMonte(true);
    const f = () => setDefile(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    menu.current?.close();
  }, [chemin]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-sortie ${
        defile ? "bg-ivoire/88 shadow-[0_1px_0_rgb(28_26_23/0.08)] backdrop-blur-md" : "bg-ivoire/88 backdrop-blur-md md:bg-transparent md:backdrop-blur-none"
      }`}
    >
      <a
        href="#contenu"
        className="sr-only z-[60] bg-vert px-4 py-3 text-ivoire-clair focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        Aller au contenu
      </a>
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-8 lg:h-20">
        <Link href="/" className="flex min-h-11 items-center" aria-label="Maison Sensa, accueil">
          <Wordmark decoratif className="w-[7.5rem] lg:w-[8.5rem]" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-center gap-8">
            {NAVIGATION.map((l) => {
              const actif = chemin === l.href || chemin.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={actif ? "page" : undefined}
                    className="group relative inline-flex min-h-11 items-center text-[0.75rem] uppercase tracking-[0.22em] text-encre"
                  >
                    {l.libelle}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-2 left-0 h-px bg-dore transition-[width] duration-500 ease-doux ${actif ? "w-full" : "w-0 group-hover:w-full"}`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/atelier#reserver"
            className="appui inline-flex min-h-11 items-center bg-vert px-4 text-[0.72rem] uppercase tracking-[0.22em] text-ivoire-clair hover:bg-vert-nuit sm:px-6"
          >
            Réserver
          </Link>
          <button
            type="button"
            onClick={ouvrirPanier}
            className="relative inline-flex size-11 cursor-pointer items-center justify-center text-encre"
            aria-label={n ? `Panier, ${n} article${n > 1 ? "s" : ""}` : "Panier, vide"}
          >
            <svg aria-hidden="true" viewBox="0 0 32 32" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M7.5 11.5h17l-1.4 14.3a1.5 1.5 0 0 1-1.5 1.4H10.4a1.5 1.5 0 0 1-1.5-1.4Z" />
              <path d="M12 11.5V9.5a4 4 0 0 1 8 0v2" />
            </svg>
            {n > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-0.5 top-1 flex min-w-4 items-center justify-center rounded-full bg-dore px-1 text-[0.625rem] leading-4 tabular-nums text-encre"
              >
                {n}
              </span>
            )}
          </button>
          <button
            type="button"
            className="inline-flex size-11 cursor-pointer items-center justify-center text-encre xl:hidden"
            aria-label="Ouvrir le menu"
            aria-haspopup="dialog"
            onClick={() => menu.current?.showModal()}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M3 8h18M3 16h18" />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        ref={menu}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-ivoire p-0 text-encre backdrop:bg-encre/30 open:flex open:flex-col"
      >
        <div className="flex h-16 items-center justify-between px-4 pt-[env(safe-area-inset-top)] sm:px-8 box-content">
          <Wordmark decoratif className="w-[7.5rem]" />
          <button
            type="button"
            className="inline-flex size-11 cursor-pointer items-center justify-center"
            aria-label="Fermer le menu"
            onClick={() => menu.current?.close()}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="m5 5 14 14M19 5 5 19" />
            </svg>
          </button>
        </div>
        <nav aria-label="Navigation principale" className="flex flex-1 flex-col justify-center px-8">
          <ul className="space-y-2">
            {NAVIGATION.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => menu.current?.close()}
                  aria-current={chemin === l.href ? "page" : undefined}
                  className="block py-2 font-serif text-4xl font-medium aria-[current=page]:text-dore-texte"
                >
                  {l.libelle}
                </Link>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="mt-10 block h-px w-12 bg-dore" />
          <Link
            href="/atelier#reserver"
            onClick={() => menu.current?.close()}
            className="mt-10 inline-flex min-h-12 w-fit items-center bg-vert px-8 text-[0.8125rem] uppercase tracking-[0.24em] text-ivoire-clair"
          >
            Réserver mon atelier
          </Link>
        </nav>
      </dialog>
    </header>
  );
}
