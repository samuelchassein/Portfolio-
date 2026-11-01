// Rend le flacon via /dev/flacon dans Chromium sans écran (Playwright).
// Usage : node scripts/flacon-rendu.mjs <sortie.png> <largeur> <hauteur> "<query>"
// Exemple : node scripts/flacon-rendu.mjs out.png 1160 1668 "rotY=0&elev=4&fond=noyer"
import fs from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const [, , sortie, l = "1160", h = "1668", query = "", base = "http://localhost:3100"] = process.argv;

const navigateur = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await navigateur.newPage({ viewport: { width: Number(l), height: Number(h) }, deviceScaleFactor: 1 });
page.on("console", (m) => {
  if (m.type() === "error") console.error("[page]", m.text());
});
await page.goto(`${base}/dev/flacon?${query}`, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__flaconPret === true, null, { timeout: 240_000 });
// Lecture directe du canvas (preserveDrawingBuffer) : plus fiable qu'une capture d'écran.
const dataUrl = await page.evaluate(() => document.querySelector("canvas").toDataURL("image/png"));
fs.writeFileSync(sortie, Buffer.from(dataUrl.split(",")[1], "base64"));
await navigateur.close();
console.log("rendu", sortie);
