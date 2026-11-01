/**
 * Réservation de l'Atelier Signature.
 *
 * `BookingProvider` isole le site de l'outil de réservation. L'implémentation
 * actuelle (`ReservationLocale`) est simulée : disponibilités calculées de
 * façon déterministe et réservations gardées dans le navigateur. Pour brancher
 * Calendly, Planity ou une API, écrivez une classe qui implémente cette
 * interface et remplacez l'export `fournisseurReservation` (voir README).
 */
import { SITE } from "@/content/site";

export interface Creneau {
  /** Date et heure locales au format ISO sans fuseau : « 2026-11-03T10:00 ». */
  debut: string;
  disponible: boolean;
}

export interface DemandeReservation {
  debut: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  pour: "moi" | "offrir";
  message?: string;
  profil?: string;
  marketing: boolean;
}

export interface Reservation extends DemandeReservation {
  reference: string;
  creeLe: string;
}

export interface BookingProvider {
  /** Créneaux d'un jour donné (AAAA-MM-JJ). */
  creneaux(jour: string): Promise<Creneau[]>;
  /** Jours ouverts à la réservation à partir d'aujourd'hui. */
  joursOuverts(): string[];
  reserver(demande: DemandeReservation): Promise<Reservation>;
  annuler(reference: string): Promise<void>;
}

const pad = (n: number) => String(n).padStart(2, "0");
export const jourISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Hachage simple et stable : mêmes créneaux pris pour tout le monde, tous les jours. */
function hachage(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

const CLE = "maison-sensa-reservations";

function lire(): Reservation[] {
  try {
    return JSON.parse(localStorage.getItem(CLE) ?? "[]");
  } catch {
    return [];
  }
}
function ecrire(r: Reservation[]) {
  try {
    localStorage.setItem(CLE, JSON.stringify(r));
  } catch {
    /* stockage indisponible : la réservation reste confirmée à l'écran */
  }
}

export class ReservationLocale implements BookingProvider {
  joursOuverts() {
    const jours: string[] = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1); // à partir de demain
    for (let i = 0; i < SITE.atelier.semainesOuvertes * 7; i++) {
      if ((SITE.atelier.jours as readonly number[]).includes(d.getDay())) jours.push(jourISO(d));
      d.setDate(d.getDate() + 1);
    }
    return jours;
  }

  async creneaux(jour: string) {
    const pris = new Set(lire().map((r) => r.debut));
    return SITE.atelier.creneaux.map((h) => {
      const debut = `${jour}T${h}`;
      // Environ un créneau sur trois déjà pris (simulation déterministe).
      const occupe = hachage(debut) < 0.32 || pris.has(debut);
      return { debut, disponible: !occupe };
    });
  }

  async reserver(demande: DemandeReservation) {
    const libres = await this.creneaux(demande.debut.slice(0, 10));
    if (!libres.find((c) => c.debut === demande.debut)?.disponible) {
      throw new Error("Ce créneau vient d’être réservé. Choisissez-en un autre.");
    }
    const reference = `MS-${demande.debut.slice(2, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const r: Reservation = { ...demande, reference, creeLe: new Date().toISOString() };
    ecrire([...lire(), r]);
    return r;
  }

  async annuler(reference: string) {
    ecrire(lire().filter((r) => r.reference !== reference));
  }
}

export const fournisseurReservation: BookingProvider = new ReservationLocale();

export function formaterCreneau(debut: string) {
  const [j, h] = debut.split("T");
  const d = new Date(`${j}T12:00:00`);
  const date = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
  return { date, heure: h.replace(":", " h ").replace(" h 00", " h"), dateHeure: `${date} à ${h.replace(":", " h ").replace(" h 00", " h")}` };
}
