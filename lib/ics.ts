import { SITE, adresseComplete } from "@/content/site";

/** Fichier agenda (.ics) d'un rendez-vous d'atelier, en heure de Paris. */
export function fichierICS({ debut, reference, dureeMinutes = 60 }: { debut: string; reference: string; dureeMinutes?: number }) {
  const [j, h] = debut.split("T");
  const deb = `${j.replace(/-/g, "")}T${h.replace(":", "")}00`;
  const d = new Date(`${j}T${h}:00`);
  d.setMinutes(d.getMinutes() + dureeMinutes);
  const p = (n: number) => String(n).padStart(2, "0");
  const fin = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
  const maintenant = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const echap = (s: string) => s.replace(/[,;\\]/g, (c) => `\\${c}`);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Maison Sensa//Atelier Signature//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${reference}@maison-sensa`,
    `DTSTAMP:${maintenant}`,
    `DTSTART;TZID=Europe/Paris:${deb}`,
    `DTEND;TZID=Europe/Paris:${fin}`,
    `SUMMARY:${echap("Atelier Signature, Maison Sensa")}`,
    `DESCRIPTION:${echap(`Référence ${reference}. Rendez-vous individuel de ${SITE.atelier.dureeMin} à ${SITE.atelier.dureeMax} minutes, parfum ${SITE.atelier.contenance} inclus.`)}`,
    `LOCATION:${echap(adresseComplete())}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function telechargerICS(contenu: string, nom: string) {
  const url = URL.createObjectURL(new Blob([contenu], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nom;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
