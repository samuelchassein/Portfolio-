// Production des fichiers du flacon depuis /dev/flacon (Chromium sans écran).
//
//   PRODUIT=flacon node scripts/flacon-studio.mjs glb              -> public/models/<produit>-maison-sensa.glb
//   PRODUIT=flacon node scripts/flacon-studio.mjs hd   <dossier>   -> vues HD sur fond blanc et fond noir (détourage ensuite)
//   PRODUIT=flacon node scripts/flacon-studio.mjs spin <dossier>   -> 36 vues sur ivoire, une tous les 10°
//
// PRODUIT : flacon | bougie | voyage | coffret (défaut flacon).
// Le serveur Next doit tourner (BASE, défaut http://localhost:3100). Pour les
// rendus longs, utiliser une version compilée (NEXT_DIST_DIR=.next-studio) :
// le rechargement à chaud du serveur de développement interromprait le rendu.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.env.BASE ?? "http://localhost:3100";
const [, , mode, dossier = "tmp-rendus"] = process.argv;
const PRODUIT = process.env.PRODUIT ?? "flacon";
// Cadrage (hauteur du cadre et centre vertical, en unités W) pour un format 3:4.
const CADRAGE = {
  flacon: { cadreH: 1.8, centreY: 0.74 },
  bougie: { cadreH: 1.75, centreY: 0.6 },
  voyage: { cadreH: 1.75, centreY: 0.76 },
  coffret: { cadreH: 3.3, centreY: 0.82 },
}[PRODUIT];
const Q = `produit=${PRODUIT}&cadreH=${CADRAGE.cadreH}&centreY=${CADRAGE.centreY}`;

async function ouvrir(query, l, h) {
  const navigateur = await chromium.launch({
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });
  const page = await navigateur.newPage({ viewport: { width: l, height: h }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error("[page]", e.message));
  await page.goto(`${BASE}/dev/flacon?${query}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__flaconPret === true, null, { timeout: 600_000 });
  return { navigateur, page };
}

async function attendreImages(page, n) {
  const depart = await page.evaluate(() => window.__frames ?? 0);
  await page.waitForFunction((cible) => (window.__frames ?? 0) >= cible, depart + n, { timeout: 600_000 });
}

async function capturer(page, fichier) {
  const url = await page.evaluate(() => document.querySelector("canvas").toDataURL("image/png"));
  fs.writeFileSync(fichier, Buffer.from(url.split(",")[1], "base64"));
  console.log("  ", path.basename(fichier));
}

export const VUES_HD = [
  { nom: "face", rotY: 0, elev: 4 },
  { nom: "trois-quarts-gauche", rotY: 35, elev: 8 },
  { nom: "trois-quarts-droite", rotY: -35, elev: 8 },
  { nom: "dos", rotY: 180, elev: 4 },
  { nom: "plongee", rotY: -20, elev: 28 },
];

if (mode === "glb") {
  const { navigateur, page } = await ouvrir(`${Q}&qualite=export&fond=transparent&ombre=0&flamme=0`, 400, 560);
  const b64 = await page.evaluate(() => window.__exporterGLB());
  const sortie = `public/models/${PRODUIT === "voyage" ? "format-voyage" : PRODUIT}-maison-sensa.glb`;
  fs.mkdirSync(path.dirname(sortie), { recursive: true });
  fs.writeFileSync(sortie, Buffer.from(b64, "base64"));
  console.log("GLB", sortie, fs.statSync(sortie).size, "octets");
  await navigateur.close();
} else if (mode === "hd") {
  fs.mkdirSync(dossier, { recursive: true });
  const { navigateur, page } = await ouvrir(`${Q}&fond=%23ffffff&res=2048`, 1800, 2400);
  for (const fond of ["#ffffff", "#000000"]) {
    await page.evaluate((f) => window.__setFond(f), fond);
    for (const v of VUES_HD) {
      await page.evaluate((vue) => (window.__vue = { rotY: vue.rotY, elev: vue.elev }), v);
      await attendreImages(page, 4);
      await capturer(page, path.join(dossier, `${v.nom}-${fond === "#ffffff" ? "blanc" : "noir"}.png`));
    }
  }
  await navigateur.close();
} else if (mode === "spin") {
  fs.mkdirSync(dossier, { recursive: true });
  const { navigateur, page } = await ouvrir(`${Q}&fond=%23F6EDDD`, 900, 1200);
  for (let i = 0; i < 36; i++) {
    await page.evaluate((r) => (window.__vue = { rotY: r, elev: 6 }), -i * 10);
    await attendreImages(page, 3);
    await capturer(page, path.join(dossier, `${String(i).padStart(2, "0")}.png`));
  }
  await navigateur.close();
} else {
  console.error("mode inconnu : glb | hd | spin");
  process.exit(1);
}
