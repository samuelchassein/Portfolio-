// Captures pleine page (1 440 × 900 et 375 × 812, densité 2) d'une liste de routes.
// Usage : node scripts/captures.mjs <dossier> /route1 /route2 …   (BASE, défaut http://localhost:3100)
// REDUIT=1 émule prefers-reduced-motion.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.env.BASE ?? "http://localhost:3100";
const [, , dossier, ...routes] = process.argv;
fs.mkdirSync(dossier, { recursive: true });
const navigateur = await chromium.launch();
for (const [nom, vp] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 375, height: 812 }],
]) {
  const ctx = await navigateur.newContext({
    viewport: vp,
    deviceScaleFactor: 2,
    reducedMotion: process.env.REDUIT ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error("[page]", e.message));
  page.on("console", (m) => m.type() === "error" && console.error("[console]", m.text().slice(0, 200)));
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: "networkidle", timeout: 180_000 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((ok) => setTimeout(ok, 60));
      }
      window.scrollTo(0, 0);
    });
    // Attendre que toutes les images soient décodées (l'AVIF est lent en développement).
    await page
      .waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 120_000 })
      .catch(() => console.error("  images encore en chargement :", r));
    await page.waitForTimeout(600);
    const f = path.join(dossier, `${r.replace(/\//g, "_") || "_accueil"}-${nom}.png`);
    await page.screenshot({ path: f, fullPage: true, timeout: 300_000 });
    console.log(f);
  }
  await ctx.close();
}
await navigateur.close();
