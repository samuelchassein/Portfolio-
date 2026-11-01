// Captures d'une page à plusieurs positions de défilement (scènes épinglées).
// Usage : node scripts/captures-defilement.mjs <dossier> <route> <pos1,pos2,…> [desktop|mobile]
//   pos en pixels, ou en « vh » (ex. 0,80vh,160vh)
// REDUIT=1 émule prefers-reduced-motion. BASE (défaut http://localhost:3100).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.env.BASE ?? "http://localhost:3100";
const [, , dossier, route, positions, format = "desktop"] = process.argv;
const vp = format === "mobile" ? { width: 375, height: 812 } : { width: 1440, height: 900 };
fs.mkdirSync(dossier, { recursive: true });

const navigateur = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const ctx = await navigateur.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: process.env.REDUIT ? "reduce" : "no-preference" });
// Pas d'animation de chargement pendant les captures.
await ctx.addInitScript(() => {
  try {
    sessionStorage.setItem("ms-chargement", "1");
  } catch {}
});
const page = await ctx.newPage();
page.on("pageerror", (e) => console.error("[page]", e.message));
page.on("console", (m) => m.type() === "error" && console.error("[console]", m.text().slice(0, 240)));
await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 180_000 });
await page.waitForTimeout(800);

for (const p of positions.split(",")) {
  const y = p.endsWith("vh") ? (parseFloat(p) / 100) * vp.height : Number(p);
  await page.evaluate((y) => {
    const l = window.__lenis;
    if (l) l.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }, y);
  await page.waitForTimeout(1600);
  await page
    .waitForFunction(() => [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight && i.loading !== "lazy").every((i) => i.complete), null, { timeout: 60_000 })
    .catch(() => {});
  const f = path.join(dossier, `${route.replace(/\//g, "_") || "_accueil"}-${format}-${p}.png`);
  await page.screenshot({ path: f, timeout: 180_000 });
  console.log(f);
}
await navigateur.close();
