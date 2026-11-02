# Mission : le film de lancement Maison Sensa (15 secondes)

> Brief d'origine : *« Make a dynamic 15-second motion graphic video that shows what an incredible motion designer you are, like you'd show for a resume. Go all out. »*

Applique cette ambition à **Maison Sensa**, parfumerie et atelier de création olfactive à Boulogne-Billancourt. Ce film doit être la meilleure pièce d'un showreel de motion designer : rythme, maîtrise du mouvement, 3D photoréaliste, typographie cinétique, transitions inventives, son synchronisé. Il doit aussi rester **fidèle à la marque** : lumineux, chaud, élégant, jamais tape-à-l'œil ni sombre.

**À lire avant de commencer :**
- `SPEC_FLACON_3D.md` : le flacon en vraie 3D, le héros du film.
- `PROMPT_CLAUDE_CODE.md`, sections 1 et 3 : la marque, la palette, les typographies et les signes graphiques.
- Le dossier `assets/`.

**Ne reprends rien d'une ancienne vidéo noire et dorée** : elle ne correspondait pas à la marque, et ses flacons n'étaient pas réalistes.

---

## 1. Ordre de travail avec le site

- **Cas recommandé :** le site a déjà été construit. Réutilise `public/models/flacon-maison-sensa.glb`, le composant `Flacon`, les polices et les tokens de couleur du projet du site.
- **Si les deux projets avancent en même temps :** construis le flacon selon `SPEC_FLACON_3D.md` dans un module **partagé** (par exemple `packages/flacon-3d/`), utilisé à la fois par le site et par le film. Il ne doit exister qu'**un seul** modèle du flacon. Signale-le pour éviter les doublons.
- Le film se range dans un dossier séparé `film/`, à côté du site.

## 2. Skills à utiliser

Si ces skills sont disponibles dans ta session, charge-les avant de commencer et suis-les : `product-launch-motion`, `video-making`, `motion-effects`, `sound-effects`, `reel-export`, ainsi que `frontend-design` pour la typographie. Sinon, applique les principes de la section 5.

## 3. Spécifications techniques

- **Outil :** Remotion (React) avec `@remotion/three` pour la 3D (React Three Fiber), afin d'obtenir un rendu image par image déterministe. Tu peux choisir une autre solution, tant que chaque image est calculée de façon exacte et reproductible.
- **Formats à livrer :**
  - `maison-sensa-lancement-16x9.mp4` : 1920 × 1080, 60 i/s, H.264, qualité élevée (CRF 16–18), son AAC.
  - `maison-sensa-lancement-9x16.mp4` : 1080 × 1920, adapté aux Reels, TikTok et Stories (recadrage repensé, pas un simple recadrage au centre).
  - Une image d'affiche (`poster.png`) tirée du plus beau plan.
- **Durée : exactement 15,0 s.**
- **Rythme :** tempo de **120 BPM** (un temps = 0,5 s, soit 30 temps). Chaque coupe, apparition et impact tombe sur un temps ou un demi-temps.

## 4. Storyboard (à affiner, mais garde la structure)

| Temps | Plan | Ce qu'on voit | Son |
|---|---|---|---|
| **0,0–1,5 s** | Le trait | Fond ivoire légèrement texturé. Un fil doré traverse l'écran d'un geste fluide, puis dessine en un seul trait la **silhouette du flacon** (bouchon, bague, corps). | Souffle aérien, tintement cristallin au moment où la silhouette se ferme |
| **1,5–3,5 s** | La matérialisation | La silhouette devient le **flacon 3D** : le verre se forme depuis le trait (dissolution vers la réfraction), puis le **jus doré se remplit** de bas en haut avec une ondulation réaliste. La bague dorée accroche un reflet et le bouchon vert se pose. Orbite de caméra lente, mise au point qui glisse. | Montée tonale douce, impact au posé du bouchon (temps 7) |
| **3,5–7,5 s** | Les 4 familles | Coupes au rythme, un temps et demi par famille : **Frais** (zestes et feuilles en suspension, lumière matinale), **Floral** (pétales blancs en pluie lente), **Boisé** (copeaux et feuilles sur fond noyer), **Ambré** (gouttes d'ambre et lumière dorée). Le flacon tourne d'un quart de tour à chaque coupe, sur un raccord de mouvement parfait. Le jus change très légèrement de teinte et le nom de la famille s'affiche en grand serif avec un **masque cinétique**. | Une signature sonore par famille sur la même grille rythmique |
| **7,5–10,0 s** | Le raccord étiquette | La caméra plonge vers l'**étiquette** : le mot « SENSA » remplit l'écran, puis se dédouble en typographie cinétique : « Votre identité, » → « votre signature olfactive. ». Les lettres se composent et se recomposent, avec des filets dorés qui se tracent. | Accents rythmiques secs et élégants, pas de basse lourde |
| **10,0–13,0 s** | La maison | Trois photos de la boutique et de l'atelier (`atelier-conseil-client`, `atelier-mouillette`, `interieur-vue-large`) révélées dans des **masques en arche** qui s'ouvrent au rythme. Le flacon 3D passe devant elles et se pose sur un **socle en travertin** ; la bougie s'allume (flamme animée) et le coffret vert glisse dans le champ. Pictogrammes dorés qui se dessinent : « Atelier individuel · 45–60 min · 50 ml · 149 € ». | Pulsation chaleureuse, crépitement très discret de la flamme |
| **13,0–15,0 s** | Signature | Le wordmark **MAISON SENSA** se compose : « MAISON » s'espace lettre par lettre, « SENSA » se révèle. Le filet doré se trace, puis la mention « Boulogne-Billancourt · Atelier sur rendez-vous » apparaît. Un dernier reflet balaie le flacon, puis **image finale tenue** 0,6 s. | Note finale résonnante, fin propre sur le temps 30 |

## 5. Niveau d'exigence (« Go all out »)

- **Principes du mouvement :** anticipation, chevauchement, accélération et décélération travaillées (courbes de Bézier personnalisées, jamais linéaires), flou de mouvement sur les déplacements rapides, aucun mouvement « par défaut ».
- **Transitions inventives :** raccords de forme (trait → flacon, étiquette → typographie, arche → photo) et raccords de mouvement entre les plans. **Aucun fondu enchaîné banal** sauf intention claire.
- **3D photoréaliste :** même qualité que la fiche technique (réfraction, caustiques suggérées, ombres de contact, profondeur de champ). Les particules botaniques sont modélisées ou découpées proprement, avec du flou de profondeur, jamais du clipart.
- **Typographie :** serif élégante de la marque et sans-serif espacée, cohérentes avec le site. Typographie cinétique précise, crénage soigné, aucune faute.
- **Lisibilité pour tous :** chaque texte reste à l'écran assez longtemps pour être lu (0,8 s minimum pour une ligne courte), avec un contraste suffisant. Rien d'important dans les marges de sécurité des formats verticaux (interface des réseaux sociaux).
- **Images :** respecte les règles de qualité d'image du site. Aucune photo agrandie au-delà de sa résolution ; les photos restent dans des cadres ou des arches de taille raisonnable. Le produit est toujours le modèle 3D.
- **Palette :** ivoire, vert profond, doré, noyer et travertin. Lumière chaude de fin d'après-midi. Le fond n'est **jamais noir**.

## 6. Son

- Compose la musique et le sound design **toi-même par synthèse dans le code** (pour éviter tout problème de droits) ou utilise une bibliothèque libre de droits dont la licence est vérifiée et documentée.
- Style : élégant et moderne, avec des cordes pincées ou du piano feutré, des textures cristallines et des percussions légères. Synchronisé au cadre près sur la grille de 120 BPM.
- Mixage : environ −14 LUFS intégrés, crêtes sous −1 dBTP, sans saturation. Vérifie avec ffmpeg (`loudnorm`, `ebur128`).

## 7. Méthode et vérification

1. Écris le storyboard final et l'animatique (images clés par plan) dans `film/STORYBOARD.md`, et montre-les avant le rendu final.
2. Construis plan par plan et rends des **planches contact** (une image toutes les 0,5 s) pour vérifier le rythme et la composition.
3. Vérifie : la durée exacte, la synchronisation image et son, la lisibilité de chaque texte, l'absence d'image floue, les deux formats et le niveau sonore.
4. Livre les deux MP4, l'affiche, ainsi que le code source rejouable (`npm run render`) avec un README.

### Critères de réussite
- [ ] Un professionnel du motion design trouverait ce film digne d'un showreel.
- [ ] Le flacon est le même modèle 3D photoréaliste que sur le site.
- [ ] Chaque coupe et chaque impact tombent sur le rythme.
- [ ] L'univers est lumineux et chaleureux, fidèle aux visuels de `assets/`.
- [ ] Les textes sont lisibles, sans faute, et la fin sur le wordmark est nette et mémorable.
