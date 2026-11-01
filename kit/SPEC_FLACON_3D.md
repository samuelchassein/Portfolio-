# Fiche technique : le flacon Maison Sensa en 3D

Ce document est commun au **site** (`PROMPT_CLAUDE_CODE.md`) et à la **vidéo de lancement** (`PROMPT_MOTION_DESIGN.md`). Le flacon 3D est construit **une seule fois** à partir de cette fiche, exporté en GLB, puis réutilisé partout.

## Objectif

Créer un flacon en vraie 3D temps réel, **fidèle à la photo produit** et **photoréaliste** : verre épais qui réfracte, jus doré, bouchon vert laqué, bague en laiton poli, étiquette papier ivoire. On doit pouvoir le faire tourner à 360°, le regarder de près et le rendre en haute définition sans qu'il paraisse « synthétique ».

**Référence absolue :** `assets/produits/flacon-reference-face.png` (vue de face, sans compression). Vues secondaires pour le volume et la profondeur : `produits/trio-socles-travertin.jpg`, `produits/gamme-sur-comptoir.jpg`, `boutique/deux-espaces-atelier.jpg`, `boutique/atelier-mouillette.jpg`.

## Proportions mesurées sur la photo de face

Unité : **W = largeur du corps** (environ 257 px sur la référence). Valeurs de départ, à calibrer (voir plus bas).

| Élément | Largeur | Hauteur | Remarques |
|---|---|---|---|
| Corps en verre (parallélépipède) | 1,00 W | 0,97 W | Arêtes verticales arrondies (rayon ≈ 0,04 W) ; épaule plate aux bords adoucis (≈ 0,04 W) |
| Profondeur du corps | ≈ 0,62 W | — | À vérifier sur les vues de trois quarts |
| Parois latérales du verre | ≈ 0,06 W | — | Verre très épais, effet « bloc » |
| Fond en verre massif | — | ≈ 0,12 W | Fond épais et transparent qui réfracte le support |
| Cavité du jus | Intérieur du corps | Du haut de l'épaule moins 0,07 W jusqu'au fond massif | Coins intérieurs arrondis (≈ 0,06 W) ; remplie à environ 93 % |
| Tube plongeur | ≈ 0,012 W | Toute la hauteur de la cavité | Très fin, à peine visible, légèrement décentré vers l'avant |
| Bague (col) en laiton | 0,385 W (cylindre) | 0,10 W | Posée au centre de l'épaule ; deux fines rainures horizontales ; métal poli |
| Bouchon | 0,50 W (cylindre) | 0,43 W | Arête supérieure arrondie (≈ 0,03 W) ; laque vert profond brillante |
| Étiquette (face avant) | 0,48 W | 0,43 W | Centrée horizontalement ; son centre est à 0,49 de la hauteur du corps en partant de l'épaule |
| **Hauteur totale** | — | ≈ 1,50 W | Du fond au sommet du bouchon |

## Matériaux (Three.js `MeshPhysicalMaterial` et équivalents)

- **Verre :** `transmission: 1`, `ior: 1.5`, `thickness` cohérent avec l'épaisseur réelle, `roughness: 0–0.03`, léger `attenuationColor` légèrement vert ou neutre, `clearcoat` pour les reflets nets. Les arêtes doivent accrocher la lumière (reflets fins et lumineux sur les arêtes verticales et l'épaule, comme sur la photo).
- **Jus :** volume séparé dans la cavité, transmission avec `attenuationColor` doré (≈ `#D9A94A` en profondeur, plus clair sur les bords) et `attenuationDistance` réglée pour obtenir le dégradé de la photo. Prévois une couleur de jus paramétrable (pour les familles olfactives), avec le doré d'origine par défaut.
- **Bouchon :** laque vert profond (≈ `#173628`), `clearcoat: 1`, `roughness` faible, reflets verticaux allongés comme sur la photo.
- **Bague :** laiton poli, `metalness: 1`, `roughness ≈ 0.2`, couleur ≈ `#D4AC70`, rainures visibles.
- **Étiquette :** papier ivoire mat (≈ `#EEE7D7`) avec un très léger grain, appliqué en fine plaque sur le verre (pas de reflet de verre par-dessus). Texte généré en **texture vectorielle haute résolution** (canvas ou SVG rasterisé à 2048 px de large ou plus) :
  - « MAISON » en sans-serif fine, capitales très espacées ;
  - « SENSA » en serif, noir chaud ;
  - mêmes polices que le wordmark du site.

  Aucune faute, aucun texte flou.

## Éclairage et rendu

- Ambiance de la boutique : **lumière chaude de fin d'après-midi**, softboxes larges (drei `Environment` + `Lightformer`, ou HDRI d'intérieur chaleureux), lumière de contour pour dessiner les arêtes du verre, ombre de contact douce sous le flacon.
- Option de support : socle en travertin (texture `moodboard-palette-matieres.jpg` ou matière procédurale) avec réflexion légère.
- Post-traitement léger : SMAA, bloom très discret sur les reflets, tonemapping ACES ou AgX, grain fin facultatif. Pas d'effet « jeu vidéo ».
- Performance web : DPR plafonné à 2, résolution de transmission adaptée, chargement différé, pause du rendu hors écran. Version allégée sur mobile.

## Calibration obligatoire (boucle de vérification)

1. Rends le flacon de face, caméra orthographique ou longue focale, à la même échelle que la photo de référence.
2. Superpose le rendu et `flacon-reference-face.png` (côte à côte et en transparence à 50 %) dans une image de comparaison enregistrée dans `docs/calibration/`.
3. Ajuste les proportions, les matériaux et la lumière, puis recommence jusqu'à ce que les silhouettes coïncident et que l'aspect soit comparable.
4. Fais la même vérification en vue de trois quarts avec `trio-socles-travertin.jpg`.
5. Montre la comparaison finale à la personne avant d'utiliser le flacon dans le site.

## Livrables

- `components/three/Flacon.tsx` : composant React Three Fiber paramétrable (couleur du jus, rotation, intensité des reflets, présence de l'étiquette).
- `public/models/flacon-maison-sensa.glb` : export GLB (GLTFExporter) avec la texture de l'étiquette, réutilisable par la vidéo.
- `public/renders/` : **rendus haute définition à fond transparent** (2 400 px de haut minimum, en PNG et WebP) de face, de trois quarts gauche et droite, de dos et en plongée légère. Ils servent d'images produit nettes dans la boutique, le partage social et la solution de secours sans WebGL.
- Recommandé : modéliser aussi la **bougie** (verre épais, cire ivoire, mèche, étiquette), le **format voyage 10 ml** (tube vert laqué, bague et capot dorés) et le **coffret** vert (carton texturé, marquage doré) avec la même méthode, pour obtenir des visuels produit nets et cohérents.
