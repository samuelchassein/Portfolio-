/**
 * Envoi des e-mails via EmailJS (réel). Seul fichier qui lit les variables
 * NEXT_PUBLIC_EMAILJS_* : aucune valeur n'est écrite dans le code.
 *
 * Chaque action envoie deux e-mails avec le même jeu de variables :
 *  - au client (template CLIENT) ;
 *  - à Maison Sensa (template BOUTIQUE).
 * Si une variable manque, rien n'est envoyé, le parcours reste confirmé à
 * l'écran et un avertissement s'affiche en console de développement.
 */
import { SITE, adresseComplete } from "@/content/site";

const CONFIG = {
  cle: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  service: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  client: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT,
  boutique: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BOUTIQUE,
};

export type TypeEmail = "reservation" | "commande" | "contact";

/** Variables communes aux deux templates (documentées dans le README). */
export interface VariablesEmail {
  to_email: string;
  to_name: string;
  reply_to: string;
  subject: string;
  type: TypeEmail;
  titre: string;
  intro: string;
  reference: string;
  details_html: string;
  details_texte: string;
  total: string;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  message: string;
  boutique_adresse: string;
  boutique_email: string;
}

export interface ResultatEnvoi {
  client: boolean;
  boutique: boolean;
  configure: boolean;
}

export const emailConfigure = () => Boolean(CONFIG.cle && CONFIG.service && CONFIG.client && CONFIG.boutique);

/** Tableau HTML compatible messageries (styles en ligne) à partir de lignes libellé / valeur. */
export function detailsHTML(lignes: [string, string][]) {
  const echap = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Georgia,'Times New Roman',serif;">${lignes
    .map(
      ([l, v]) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #E8DCC8;color:#5B544A;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:.06em;text-transform:uppercase;vertical-align:top;width:40%;">${echap(l)}</td><td style="padding:10px 0;border-bottom:1px solid #E8DCC8;color:#1C1A17;font-size:16px;vertical-align:top;">${echap(v)}</td></tr>`,
    )
    .join("")}</table>`;
}

export const detailsTexte = (lignes: [string, string][]) => lignes.map(([l, v]) => `${l} : ${v}`).join("\n");

interface Envoi {
  type: TypeEmail;
  reference: string;
  client: { nom: string; email: string; telephone?: string };
  sujetClient: string;
  sujetBoutique: string;
  titreClient: string;
  titreBoutique: string;
  introClient: string;
  introBoutique: string;
  lignes: [string, string][];
  total?: string;
  message?: string;
}

export async function envoyerEmails(e: Envoi): Promise<ResultatEnvoi> {
  if (!emailConfigure()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Maison Sensa] EmailJS non configuré : aucun e-mail envoyé (voir .env.local et README).");
    }
    return { client: false, boutique: false, configure: false };
  }
  const { default: emailjs } = await import("@emailjs/browser");
  const commun = {
    type: e.type,
    reference: e.reference,
    details_html: detailsHTML(e.lignes),
    details_texte: detailsTexte(e.lignes),
    total: e.total ?? "",
    client_nom: e.client.nom,
    client_email: e.client.email,
    client_telephone: e.client.telephone ?? "",
    message: e.message ?? "",
    boutique_adresse: adresseComplete(),
    boutique_email: SITE.email,
  };
  const pourClient: VariablesEmail = {
    ...commun,
    to_email: e.client.email,
    to_name: e.client.nom,
    reply_to: SITE.email,
    subject: e.sujetClient,
    titre: e.titreClient,
    intro: e.introClient,
  };
  const pourBoutique: VariablesEmail = {
    ...commun,
    to_email: SITE.email,
    to_name: "Maison Sensa",
    reply_to: e.client.email,
    subject: e.sujetBoutique,
    titre: e.titreBoutique,
    intro: e.introBoutique,
  };
  const options = { publicKey: CONFIG.cle! };
  const [rc, rb] = await Promise.allSettled([
    emailjs.send(CONFIG.service!, CONFIG.client!, { ...pourClient }, options),
    emailjs.send(CONFIG.service!, CONFIG.boutique!, { ...pourBoutique }, options),
  ]);
  // Un échec partiel ne bloque jamais le parcours : il est journalisé.
  if (rc.status === "rejected") console.error("[Maison Sensa] E-mail client non envoyé", rc.reason);
  if (rb.status === "rejected") console.error("[Maison Sensa] Notification boutique non envoyée", rb.reason);
  return { client: rc.status === "fulfilled", boutique: rb.status === "fulfilled", configure: true };
}
