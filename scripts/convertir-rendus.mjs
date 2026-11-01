// Convertit les rendus Blender pour le site.
//  - public/renders/*.png et public/renders/scenes/*.png -> .webp à côté (alpha conservé)
//  - tmp-360/<produit>/NN.png -> public/renders/360/<produit>/NN.webp, aplatis sur l'ivoire
//    du site (#F6EDDD) : la séquence 360° de secours s'affiche sur fond ivoire.
// Usage : node scripts/convertir-rendus.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IVOIRE = { r: 246, g: 237, b: 221 };

for (const dossier of ["public/renders", "public/renders/scenes"]) {
  if (!fs.existsSync(dossier)) continue;
  for (const f of fs.readdirSync(dossier).filter((x) => x.endsWith(".png"))) {
    const src = path.join(dossier, f);
    const dst = src.replace(/\.png$/, ".webp");
    if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs > fs.statSync(src).mtimeMs) continue;
    await sharp(src).webp({ quality: 88, alphaQuality: 100, effort: 5 }).toFile(dst);
    console.log("webp", dst);
  }
}

if (fs.existsSync("tmp-360")) {
  for (const produit of fs.readdirSync("tmp-360")) {
    const sortie = path.join("public/renders/360", produit);
    fs.mkdirSync(sortie, { recursive: true });
    const images = fs.readdirSync(path.join("tmp-360", produit)).filter((x) => x.endsWith(".png")).sort();
    for (const f of images) {
      await sharp(path.join("tmp-360", produit, f))
        .flatten({ background: IVOIRE })
        .webp({ quality: 84, effort: 5 })
        .toFile(path.join(sortie, f.replace(/\.png$/, ".webp")));
    }
    console.log("360", produit, images.length, "vues");
  }
}
