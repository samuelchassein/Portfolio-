// Vectorise le wordmark « MAISON / SENSA » avec les polices du site
// (Jost 400 pour MAISON, Cormorant Garamond 600 pour SENSA) et écrit
// components/brand/wordmark-paths.ts. Le texte devient des tracés : le logo
// s'affiche identique partout, sans dépendre du chargement des polices.
//
// Usage : node scripts/generer-wordmark.mjs
import fs from "node:fs";
import opentype from "opentype.js";

const charger = (f) => {
  const b = fs.readFileSync(f);
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const jost = charger("node_modules/@fontsource/jost/files/jost-latin-400-normal.woff");
const corm = charger("node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff");

/** Sérialise un tracé opentype (sa propre sortie produit parfois « NaN »). */
function versD(chemin) {
  const n = (v) => (Number.isFinite(v) ? Number(v.toFixed(2)) : 0);
  return chemin.commands
    .map((c) => {
      if (c.type === "M" || c.type === "L") return `${c.type}${n(c.x)} ${n(c.y)}`;
      if (c.type === "Q") return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
      if (c.type === "C") return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
      return "Z";
    })
    .join("");
}

/** Tracé d'un mot avec interlettrage (en fraction de la taille). */
function mot(font, texte, taille, espacement, x0, yBase) {
  let x = x0;
  const chemins = [];
  const lettres = [];
  for (const c of texte) {
    const g = font.charToGlyph(c);
    const d = versD(g.getPath(x, yBase, taille));
    chemins.push(d);
    lettres.push({ d, x: Number((x + font.getAdvanceWidth(c, taille) / 2).toFixed(2)) });
    x += font.getAdvanceWidth(c, taille) + espacement * taille;
  }
  const largeur = x - x0 - espacement * taille;
  return { d: chemins.join(""), largeur, lettres };
}

// Proportions relevées sur logo-maison-sensa.jpg : MAISON ≈ 71 % de la largeur
// de SENSA, capitales de MAISON ≈ 27 % de celles de SENSA, écart ≈ 30 % de la
// hauteur de SENSA.
const T_SENSA = 100;
const ESP_SENSA = 0.035;
const ESP_MAISON = 0.42;
const sensaL = mot(corm, "SENSA", T_SENSA, ESP_SENSA, 0, 0).largeur;
const capS = (corm.tables.os2.sCapHeight / corm.unitsPerEm) * T_SENSA;
const capJ = jost.tables.os2.sCapHeight / jost.unitsPerEm;
// Taille de MAISON pour qu'il occupe 71 % de SENSA.
let tM = 30;
for (let i = 0; i < 5; i++) tM *= (sensaL * 0.71) / mot(jost, "MAISON", tM, ESP_MAISON, 0, 0).largeur;
const capM = capJ * tM;
const ecart = capS * 0.42;

const yMaison = capM; // ligne de base de MAISON
const ySensa = yMaison + ecart + capS;
const maison = mot(jost, "MAISON", tM, ESP_MAISON, (sensaL - mot(jost, "MAISON", tM, ESP_MAISON, 0, 0).largeur) / 2, yMaison);
const sensa = mot(corm, "SENSA", T_SENSA, ESP_SENSA, 0, ySensa);

const out = `// Généré par scripts/generer-wordmark.mjs — ne pas modifier à la main.
// Wordmark Maison Sensa vectorisé (Jost 400 + Cormorant Garamond 600).
export const WORDMARK = {
  largeur: ${sensaL.toFixed(2)},
  hauteur: ${ySensa.toFixed(2)},
  maison: ${JSON.stringify(maison.d)},
  sensa: ${JSON.stringify(sensa.d)},
  /** Lettres séparées (animation de chargement) : tracé et centre horizontal. */
  lettresMaison: ${JSON.stringify(maison.lettres)},
  lettresSensa: ${JSON.stringify(sensa.lettres)},
} as const;

/** Monogramme « S » (favicon, petits formats). */
export const MONOGRAMME_S = ${JSON.stringify(versD(corm.charToGlyph("S").getPath(0, 0, 100)))};
export const MONOGRAMME_S_BOITE = ${JSON.stringify(corm.charToGlyph("S").getPath(0, 0, 100).getBoundingBox())};
`;
fs.mkdirSync("components/brand", { recursive: true });
fs.writeFileSync("components/brand/wordmark-paths.ts", out);
console.log("wordmark", sensaL.toFixed(1), "×", ySensa.toFixed(1), "MAISON", tM.toFixed(1), "px");
