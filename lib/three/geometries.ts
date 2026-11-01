import * as THREE from "three";

/**
 * Géométries du flacon Maison Sensa, en unités W (largeur du corps = 1).
 * Toutes les cotes viennent de SPEC_FLACON_3D.md, calibrées sur la photo de
 * référence (voir docs/calibration/).
 */
export const COTES = {
  corps: { largeur: 1, hauteur: 0.97, profondeur: 0.62, rayonAretes: 0.04, rayonEpaule: 0.035 },
  paroi: 0.06,
  fond: 0.12,
  jus: { margeHaut: 0.07, remplissage: 0.93, rayon: 0.06 },
  tube: { rayon: 0.006, avance: 0.06 },
  bague: { rayon: 0.385 / 2, hauteur: 0.1 },
  bouchon: { rayon: 0.25, hauteur: 0.43, arrondi: 0.03 },
  etiquette: { largeur: 0.48, hauteur: 0.43, centreDepuisEpaule: 0.47 },
} as const;

export const HAUTEUR_TOTALE = COTES.corps.hauteur + COTES.bague.hauteur + COTES.bouchon.hauteur;

function rectangleArrondi(l: number, p: number, r: number) {
  const s = new THREE.Shape();
  const x = -l / 2;
  const y = -p / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + l - r, y);
  s.absarc(x + l - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + l, y + p - r);
  s.absarc(x + l - r, y + p - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + p);
  s.absarc(x + r, y + p - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/**
 * Parallélépipède à arêtes verticales arrondies et bords haut/bas adoucis.
 * Extrusion d'un rectangle arrondi avec biseau : l'arrondi final des arêtes
 * verticales vaut (rayon du profil + biseau).
 */
export function blocArrondi(
  largeur: number,
  hauteur: number,
  profondeur: number,
  rayonAretes: number,
  rayonBords: number,
  segments = 10,
) {
  const b = Math.min(rayonBords, rayonAretes - 0.002);
  const r = Math.max(rayonAretes - b, 0.002);
  const forme = rectangleArrondi(largeur - 2 * b, profondeur - 2 * b, r);
  const geo = new THREE.ExtrudeGeometry(forme, {
    depth: hauteur - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: segments,
    curveSegments: segments * 2,
    steps: 1,
  });
  // L'extrusion se fait selon +Z : on la couche sur l'axe Y, base à y = 0.
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, b, 0);
  geo.computeVertexNormals();
  return geo;
}

/** Bague en laiton : cylindre avec deux fines rainures horizontales. */
export function geometrieBague() {
  const { rayon: R, hauteur: H } = COTES.bague;
  const p = 0.0015; // profondeur des rainures (très fines)
  const g = 0.002; // demi-hauteur des rainures
  const pts: THREE.Vector2[] = [];
  const v = (x: number, y: number) => pts.push(new THREE.Vector2(x, y));
  v(0, 0);
  v(R - 0.004, 0);
  v(R, 0.004);
  for (const yc of [H * 0.3, H * 0.7]) {
    v(R, yc - g - 0.002);
    v(R - p, yc - g + 0.001);
    v(R - p, yc + g - 0.001);
    v(R, yc + g + 0.002);
  }
  v(R, H - 0.004);
  v(R - 0.004, H);
  v(0, H);
  return new THREE.LatheGeometry(pts, 96);
}

/** Bouchon : cylindre à arête supérieure arrondie. */
export function geometrieBouchon() {
  const { rayon: R, hauteur: H, arrondi: a } = COTES.bouchon;
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, 0), new THREE.Vector2(R - 0.004, 0), new THREE.Vector2(R, 0.004)];
  pts.push(new THREE.Vector2(R, H - a));
  for (let i = 1; i <= 12; i++) {
    const t = (i / 12) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - a + a * Math.cos(t), H - a + a * Math.sin(t)));
  }
  pts.push(new THREE.Vector2(0, H));
  return new THREE.LatheGeometry(pts, 128);
}
