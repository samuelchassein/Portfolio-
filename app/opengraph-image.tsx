import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { WORDMARK } from "@/components/brand/wordmark-paths";

export const alt = "Maison Sensa : votre identité, votre signature olfactive.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image de partage aux couleurs de la marque : ivoire, wordmark, filet doré, rendu du flacon. */
export default async function Image() {
  const racine = process.cwd();
  const [serif, flacon] = await Promise.all([
    readFile(path.join(racine, "node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff")),
    readFile(path.join(racine, "public/renders/flacon-trois-quarts-gauche.png")),
  ]);
  const m = 4;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-m} ${-m} ${WORDMARK.largeur + 2 * m} ${WORDMARK.hauteur + 2 * m}"><path fill="#1C1A17" d="${WORDMARK.maison}"/><path fill="#1C1A17" d="${WORDMARK.sensa}"/></svg>`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F6EDDD", fontFamily: "Cormorant" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 60 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} width={420} height={(420 * (WORDMARK.hauteur + 2 * m)) / (WORDMARK.largeur + 2 * m)} alt="" />
          <div style={{ width: 64, height: 2, background: "#C9A26A", marginTop: 36 }} />
          <div style={{ marginTop: 32, fontSize: 40, fontStyle: "italic", color: "#1F3A2E", textAlign: "center" }}>Votre identité, votre signature olfactive.</div>
          <div style={{ marginTop: 18, fontSize: 24, color: "#5B544A" }}>Parfumerie et atelier · Boulogne-Billancourt</div>
        </div>
        <div style={{ width: 420, display: "flex", alignItems: "center", justifyContent: "center", background: "#EFE4D2", borderLeft: "1px solid #C9A26A" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${flacon.toString("base64")}`} width={330} height={440} alt="" style={{ objectFit: "contain" }} />
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: serif, style: "italic", weight: 500 }] },
  );
}
