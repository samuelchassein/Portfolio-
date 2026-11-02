import * as THREE from "three";
import { FONT_URLS } from "@/lib/fonts";

/**
 * Texture de l'étiquette du flacon : papier ivoire mat, « MAISON » en Jost
 * espacé, « SENSA » en Cormorant Garamond. Générée en canvas haute résolution
 * (2 048 px de large) avec les polices du site, donc sans faute ni flou.
 *
 * Proportions relevées sur la photo de référence (étiquette 0,48 W × 0,43 W) :
 * MAISON centré à 34 % de la hauteur, largeur ≈ 45 % ; SENSA centré à 51 %,
 * largeur ≈ 64 %.
 */
export const ETIQUETTE_RATIO = 0.43 / 0.48;

let policesPretes: Promise<void> | null = null;

function chargerPolices(): Promise<void> {
  if (policesPretes) return policesPretes;
  policesPretes = (async () => {
    if (typeof document === "undefined") return;
    const faces = [
      new FontFace("SensaSerif", `url(${FONT_URLS.serif600})`, { weight: "600" }),
      new FontFace("SensaSans", `url(${FONT_URLS.sans400})`, { weight: "400" }),
    ];
    await Promise.all(
      faces.map(async (f) => {
        try {
          document.fonts.add(await f.load());
        } catch {
          /* police de secours du navigateur */
        }
      }),
    );
  })();
  return policesPretes;
}

/** Dessine du texte avec un interlettrage (en fraction de la taille de police). */
function texteEspace(
  ctx: CanvasRenderingContext2D,
  texte: string,
  cx: number,
  y: number,
  espacement: number,
) {
  const lettres = [...texte];
  const largeurs = lettres.map((l) => ctx.measureText(l).width);
  const gap = espacement;
  const total = largeurs.reduce((a, b) => a + b, 0) + gap * (lettres.length - 1);
  let x = cx - total / 2;
  ctx.textAlign = "left";
  lettres.forEach((l, i) => {
    ctx.fillText(l, x, y);
    x += largeurs[i] + gap;
  });
  return total;
}

/** Ajuste la taille de police pour qu'un texte espacé occupe la largeur visée. */
function ajusterTaille(
  ctx: CanvasRenderingContext2D,
  police: (taille: number) => string,
  texte: string,
  largeurVisee: number,
  espacementRel: number,
) {
  let taille = 100;
  for (let i = 0; i < 6; i++) {
    ctx.font = police(taille);
    const lettres = [...texte];
    const w =
      lettres.reduce((a, l) => a + ctx.measureText(l).width, 0) +
      espacementRel * taille * (lettres.length - 1);
    taille *= largeurVisee / w;
  }
  ctx.font = police(taille);
  return taille;
}

export interface OptionsEtiquette {
  largeur?: number;
  /** Texte de gravure facultatif, ajouté discrètement sous SENSA. */
  gravure?: string;
}

export async function creerTextureEtiquette(opts: OptionsEtiquette = {}) {
  await chargerPolices();
  const W = opts.largeur ?? 2048;
  const H = Math.round(W * ETIQUETTE_RATIO);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Papier ivoire mat, très léger dégradé et grain fin.
  const fond = ctx.createLinearGradient(0, 0, W, H);
  fond.addColorStop(0, "#F1EBDD");
  fond.addColorStop(1, "#EAE2D1");
  ctx.fillStyle = fond;
  ctx.fillRect(0, 0, W, H);
  const grain = ctx.getImageData(0, 0, W, H);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (rnd() - 0.5) * 7;
    grain.data[i] += n;
    grain.data[i + 1] += n;
    grain.data[i + 2] += n;
  }
  ctx.putImageData(grain, 0, 0);

  ctx.fillStyle = "#1E1B17";
  ctx.textBaseline = "middle";

  // MAISON
  const espMaison = 0.42;
  const tMaison = ajusterTaille(ctx, (t) => `400 ${t}px SensaSans, sans-serif`, "MAISON", W * 0.45, espMaison);
  texteEspace(ctx, "MAISON", W / 2, H * 0.345, espMaison * tMaison);

  // SENSA
  const espSensa = 0.035;
  const tSensa = ajusterTaille(ctx, (t) => `600 ${t}px SensaSerif, serif`, "SENSA", W * 0.64, espSensa);
  texteEspace(ctx, "SENSA", W / 2, H * 0.53, espSensa * tSensa);

  if (opts.gravure) {
    ctx.font = `400 ${Math.round(W * 0.032)}px SensaSans, sans-serif`;
    ctx.fillStyle = "#5B544A";
    texteEspace(ctx, opts.gravure.toUpperCase().slice(0, 24), W / 2, H * 0.78, W * 0.008);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export interface OptionsMarquage {
  /** Couleur de l'encre (noir chaud pour la bougie, doré pour le tube et le coffret). */
  couleur: string;
  /** Largeur / hauteur de la zone imprimée. */
  ratio: number;
  /** Largeur occupée par SENSA, en fraction de la zone (MAISON = 70 % de SENSA). */
  largeurSensa?: number;
  /** Texte vertical (tube du format voyage : on lit de bas en haut). */
  vertical?: boolean;
  largeur?: number;
}

/**
 * Wordmark imprimé sur fond transparent (sérigraphie sur verre, marquage à
 * chaud doré) : « MAISON » espacé au-dessus de « SENSA ».
 */
export async function creerTextureMarquage(opts: OptionsMarquage) {
  await chargerPolices();
  const W = opts.largeur ?? 2048;
  const H = Math.round(W / opts.ratio);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = opts.couleur;
  ctx.textBaseline = "middle";

  if (opts.vertical) {
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.translate(-H / 2, -W / 2);
  }
  const L = opts.vertical ? H : W;
  const Hh = opts.vertical ? W : H;
  const ls = (opts.largeurSensa ?? 0.6) * L;
  const espSensa = 0.035;
  const tSensa = ajusterTaille(ctx, (t) => `600 ${t}px SensaSerif, serif`, "SENSA", ls, espSensa);
  const espMaison = 0.42;
  const tMaison = ajusterTaille(ctx, (t) => `400 ${t}px SensaSans, sans-serif`, "MAISON", ls * 0.7, espMaison);
  const bloc = tMaison * 0.75 + tSensa * 0.95;
  const haut = Hh / 2 - bloc / 2;
  ctx.font = `400 ${tMaison}px SensaSans, sans-serif`;
  texteEspace(ctx, "MAISON", L / 2, haut + tMaison * 0.35, espMaison * tMaison);
  ctx.font = `600 ${tSensa}px SensaSerif, serif`;
  texteEspace(ctx, "SENSA", L / 2, haut + tMaison * 0.75 + tSensa * 0.5, espSensa * tSensa);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  tex.needsUpdate = true;
  return tex;
}
