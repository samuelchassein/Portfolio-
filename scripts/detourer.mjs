// Détourage par la méthode des deux fonds : chaque vue est rendue sur fond
// blanc puis sur fond noir. Pour chaque pixel :
//   alpha   = 1 − (blanc − noir)        (moyenne des trois canaux)
//   couleur = noir / alpha
// Le verre et le jus gardent ainsi leur vraie transparence, sans halo.
//
// Usage : node scripts/detourer.mjs <dossier-rendus> <dossier-sortie> <prefixe>
// Produit <prefixe>-<vue>.png et .webp (pleine taille) dans le dossier de sortie.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [, , entree, sortie, prefixe = "flacon"] = process.argv;
fs.mkdirSync(sortie, { recursive: true });

const vues = fs
  .readdirSync(entree)
  .filter((f) => f.endsWith("-blanc.png"))
  .map((f) => f.replace("-blanc.png", ""));

for (const vue of vues) {
  const lire = (f) => sharp(path.join(entree, f)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const [{ data: B, info }, { data: N }] = await Promise.all([lire(`${vue}-blanc.png`), lire(`${vue}-noir.png`)]);
  const { width: w, height: h } = info;
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0, j = 0; i < B.length; i += 3, j += 4) {
    const diff = (B[i] - N[i] + (B[i + 1] - N[i + 1]) + (B[i + 2] - N[i + 2])) / 3;
    let a = 1 - diff / 255;
    a = a < 0.004 ? 0 : a > 1 ? 1 : a;
    out[j + 3] = Math.round(a * 255);
    if (a > 0) {
      out[j] = Math.min(255, Math.round(N[i] / a));
      out[j + 1] = Math.min(255, Math.round(N[i + 1] / a));
      out[j + 2] = Math.min(255, Math.round(N[i + 2] / a));
    }
  }
  const img = sharp(out, { raw: { width: w, height: h, channels: 4 } });
  const base = path.join(sortie, `${prefixe}-${vue}`);
  await img.clone().png({ compressionLevel: 9 }).toFile(`${base}.png`);
  await img.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(`${base}.webp`);
  console.log("détouré", `${base}.png`, `${w}×${h}`);
}
