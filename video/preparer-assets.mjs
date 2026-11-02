// Prépare les ressources de la vidéo : base64 embarqué dans assets.js (page autonome).
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
const R = "../public/", F = "../node_modules/@fontsource/";
const A = {};
const uri = (mime, buf) => `data:${mime};base64,${buf.toString("base64")}`;
A.fonts = {
  corm500: uri("font/woff2", readFileSync(F + "cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2")),
  corm600: uri("font/woff2", readFileSync(F + "cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2")),
  corm500i: uri("font/woff2", readFileSync(F + "cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2")),
  jost300: uri("font/woff2", readFileSync(F + "jost/files/jost-latin-300-normal.woff2")),
  jost400: uri("font/woff2", readFileSync(F + "jost/files/jost-latin-400-normal.woff2")),
  jost500: uri("font/woff2", readFileSync(F + "jost/files/jost-latin-500-normal.woff2")),
};
A.rot = [];
/* Détourage des vues 360° (aplaties sur ivoire) : alpha = écart à la couleur du fond, couleur dé-prémultipliée. */
async function detoure(file) {
  const { data, info } = await sharp(file).resize({ height: 900 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const bg = [data[0], data[1], data[2]], out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const d = Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]));
    const a = Math.min(1, Math.max(0, (d - 13) / 30));
    for (let c = 0; c < 3; c++) out[j + c] = a > 0.01 ? Math.max(0, Math.min(255, (data[i + c] - bg[c] * (1 - a)) / a)) : 0;
    out[j + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 84, alphaQuality: 90 }).toBuffer();
}
for (let i = 0; i < 36; i++) A.rot.push(uri("image/webp", await detoure(`${R}renders/360/flacon/${String(i).padStart(2, "0")}.webp`)));
A.prod = {};
for (const n of ["flacon-trois-quarts-gauche", "flacon-face", "bougie-trois-quarts-gauche", "format-voyage-trois-quarts-gauche", "coffret-trois-quarts-gauche"])
  A.prod[n] = uri("image/webp", await sharp(`${R}renders/${n}.png`).resize({ height: 1000 }).webp({ quality: 85, alphaQuality: 90 }).toBuffer());
A.photo = {};
for (const [k, p] of Object.entries({ interieur: "images/visite/interieur.jpg", atelier: "images/visite/atelier.jpg", vitrine: "images/visite/vitrine.jpg", facade: "images/visite/facade.jpg", ilot: "images/visite/ilot.jpg", mouillette: "images/atelier-mouillette.jpg", gamme: "renders/scenes/gamme-boutique.webp", flaconScene: "renders/scenes/flacon-boutique.webp" }))
  A.photo[k] = uri("image/jpeg", await sharp(R + p).resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toBuffer());
const wm = readFileSync("../components/brand/wordmark-paths.ts", "utf8");
const g = (k) => wm.match(new RegExp("\\n  " + k + ': "?([^",\\n]+)'))[1];
A.wordmark = { largeur: +g("largeur"), hauteur: +g("hauteur"), maison: g("maison"), sensa: g("sensa") };
writeFileSync("assets.js", "window.A=" + JSON.stringify(A) + ";");
console.log("assets.js", (readFileSync("assets.js").length / 1e6).toFixed(1), "Mo", Object.keys(A.wordmark));
