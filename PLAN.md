# Maison Sensa : plan du site

Statut : **plan validé ; flacon 3D validé** (comparaisons dans `docs/calibration/`) ; fonction 360° ajoutée (§6 bis). Les sources du kit sont rangées dans `kit/` (briefs, `assets/`, `reference/`). `.env.local` est à la racine, exclu de Git.

---

## 1. Direction de style

### Ce que disent les visuels
Les 27 visuels racontent tous la même chose : lumière dorée de fin d'après-midi, ombres de feuillage au sol, travertin veiné, noyer cannelé, laiton poli, verre épais, fleurs blanches et olivier. Le vert profond n'apparaît qu'en aplats nets (bouchon, coffrets, menuiseries, bandeau des affiches). Le doré n'est jamais un fond : c'est un filet, une bague, un cadre de 1 px.

### Trois directions comparées

| | A. « Galerie minérale » | B. « Éditorial d'apothicaire » | C. « Liquid Glass luxe » (proposée par UI UX Pro Max) |
|---|---|---|---|
| Idée | La page est un lieu : grandes images plein cadre, arches, matières (travertin, noyer) en surfaces, beaucoup d'air | Magazine imprimé : colonnes, numérotation, petites capitales, filets, images plus petites | Translucidité, réfraction, panneaux de verre flous |
| Typo | Cormorant Garamond + Jost | Libre Caslon Display + Jost | Cormorant + Montserrat |
| Forces | Colle aux visuels, fait « entrer » dans la boutique, sert la scène d'ouverture | Très lisible, élégant, peu coûteux | Fait écho au verre du flacon |
| Faiblesses | Exigeant sur la qualité d'image (images petites : voir §5) | Ne met pas assez en valeur les photos de la boutique ; risque « blog » | Univers d'interface Apple, pas d'une parfumerie ; le flou coûte cher ; contraste fragile. Palette proposée (fond `#FAFAF9`, accent `#A16207`) trop froide |

**Choix : A, « Galerie minérale », avec la rigueur typographique de B** (numérotation « 01 / 04 », petites capitales espacées, filets) pour les pages de contenu. C est écartée : la section 3 du brief prime sur les suggestions du skill. Seule idée gardée de C : le verre est réservé au flacon 3D, il n'est jamais imité en CSS.

Réglages UI UX Pro Max retenus (`--variance 6 --motion 8 --density 3`) : mise en page équilibrée avec asymétries ponctuelles, motion complexe (scènes épinglées, révélations ligne à ligne), espacement généreux (échelle 24–96 px). Règles UX appliquées : cibles ≥ 44 px, contraste texte ≥ 4,5:1, focus visible, libellés visibles au-dessus des champs, erreurs au plus près du champ, `prefers-reduced-motion`.

frontend-design (à installer, voir §9) : servira à pousser chaque section vers quelque chose de propre à la marque. Garde-fous dès maintenant : aucune grille de cartes standard, aucun dégradé violet, aucun motif SaaS (pas d'icônes dans des pastilles, pas de « features grid »).

### Typographie : comparaison à l'œil avec le logo
Rendu côte à côte : `docs/decisions/comparaison-serifs-logo.png`.

- **Cormorant Garamond 600** : la plus proche du « SENSA » d'origine (graisse, contraste modéré, empattements fins, A pointu). **Retenue** pour le wordmark et les titres (500 pour les titres courants, 600 pour le wordmark et les très grands corps).
- Libre Caslon Display : trop maigre face au logo.
- Gloock : trop noire, contraste trop fort, plus « magazine » que maison.
- Petites capitales et texte courant : **Jost** 300/400 (MAISON : 400, interlettrage 0,42 em).

### Tokens
Palette du brief conservée telle quelle (`--ivoire` … `--encre-douce`), ajustée à l'œil pendant l'étape design system. Ajouts :
- `--ombre-feuillage` : texture SVG/PNG très légère d'ombres de feuilles pour les grands aplats ivoire (rappel du sol de la boutique).
- Grain papier à 3–4 % d'opacité.
- Anneau de focus doré (`--dore`) de 2 px avec décalage de 3 px, doublé d'un contour encre pour garder le contraste sur ivoire.
- Le doré sur ivoire ne sert jamais au texte courant (contraste ≈ 2,0:1) ; doré sur vert profond pour le texte des bandeaux (≈ 5,2:1).

---

## 2. Arborescence

```
/                     accueil (scènes 0 à 8)
/maison               histoire, philosophie, la boutique de Boulogne-Billancourt
/atelier              Atelier Signature + réservation en 3 étapes + FAQ
/diagnostic           diagnostic olfactif (une question par écran) + résultat
/boutique             catalogue
/boutique/[slug]      fiche produit (visualiseur 360° pour toute la gamme)
/panier               panier + commande simulée (coordonnées, retrait/livraison, récap, confirmation)
/carte-cadeau         configurateur avec aperçu en direct
/visite               visite 360° (maquette-360.html)
/contact              formulaire de contact
/mentions-legales  /cgv  /confidentialite  /cookies
/styleguide           validation du design system (noindex)
sitemap.xml, robots.txt, opengraph-image
```

Navigation : La Maison · L'Atelier · Diagnostic · Boutique · Visite 360° · Carte cadeau, plus panier et bouton **Réserver** fixe dans l'en-tête.

---

## 3. Structure du code

```
app/                        routes ci-dessus (App Router)
components/
  brand/                    Wordmark (SVG, encre/ivoire/doré), Filet, CadreDore, Arche, Pictos (trait doré)
  ui/                       Bouton, Champ, Case, Puce, Tiroir, Etapes, Calendrier
  layout/                   EnTete, PiedDePage, BandeauCookies, SmoothScroll (Lenis)
  scenes/                   Chargement, EntreeBoutique, Manifeste, DeuxEspaces, FlaconFamilles,
                            AtelierSignature, ExperienceProlongee, BandeauBoutique, Visite360, CarteCadeau, InfosPratiques
  three/                    Flacon.tsx, Socle.tsx, Botaniques, ScèneStudio, VisualiseurFlacon
  boutique/ diagnostic/ reservation/ carte-cadeau/
content/                    site.ts, products.ts, families.ts, diagnostic.ts, faq.ts, textes.ts
lib/
  email.ts                  EmailJS (seul point qui lit process.env.NEXT_PUBLIC_*)
  booking/                  BookingProvider (interface) + LocalBookingProvider
  payment/                  PaymentProvider (interface) + SimulatedPaymentProvider
  ics.ts, prix.ts (règle bougie 45 € avec atelier), anti-abus.ts
stores/                     panier, profil (diagnostic), reservation (Zustand + persist sous try/catch)
emails/                     template-client.html, template-boutique.html (+ versions texte)
public/models/              flacon-maison-sensa.glb
public/renders/             rendus HD transparents (PNG + WebP, ≥ 2 400 px de haut)
public/images/              visuels traités (recadrés, agrandis, AVIF/WebP)
public/visite-360/          maquette-360.html
scripts/                    traitement d'images, rendu des vues 3D, calibration, captures Playwright
docs/calibration/           comparaisons flacon / photo
```

Stack : Next.js (App Router) + TypeScript, Tailwind (tokens du §1), R3F + drei + postprocessing (chargés à la demande), GSAP + ScrollTrigger, Lenis, Framer Motion (tiroir panier, étapes), Zustand, `@emailjs/browser`, `next/font` (Cormorant Garamond, Jost).

---

## 4. Découpage de la page d'accueil

| Scène | Hauteur desktop / mobile | Images | Technique |
|---|---|---|---|
| 0. Chargement | ≤ 1,5 s | Wordmark SVG | GSAP : interlettrage de MAISON, masque vertical sur SENSA, filet tracé (`stroke-dashoffset`). Sauté si déjà vu dans la session |
| 1. Entrer dans la boutique | 300 vh / 150 vh, épinglée | façade ×2 → intérieur ×2 → comptoir ×2 | Façade : zoom ≤ 1,25× vers la porte, ombres de feuillage en couche SVG animée. Masque en forme de porte (`clip-path` animé sur l'axe de la porte) qui révèle l'intérieur aligné sur le même point de fuite, puis 1,0→1,15×, fondu enchaîné vers le comptoir + texte d'accueil |
| 2. Manifeste | éditorial | atelier-conseil-client en arche | Révélation ligne à ligne (SplitText maison, masques), parallaxe douce |
| 2 bis. Deux espaces | éditorial | deux-espaces-atelier / -boutique (petites : cadres ≤ 360 px CSS) | Deux arches côte à côte, respiration au survol, filet qui s'allonge |
| 3. Flacon et 4 familles | 400 vh / 250 vh, épinglée | Flacon 3D (canvas transparent) | Descente sur socle travertin, quart de tour par famille, ambiance de fond, botaniques SVG en profondeur avec flou, jus qui glisse vers la teinte, environnement lumineux accordé. Repli : rendus HD en fondu |
| 4. Atelier Signature | éditorial | atelier-table ×2 | Mise en page asymétrique, 4 étapes reliées par un fil doré tracé au scroll, bloc pictos « 45–60 min · 50 ml · 149 € » |
| 4 bis. Expérience prolongée | éditorial | parcours-1/2/3 (cadres ≤ 250 px CSS) | Trois portraits en arche, flèches dorées tracées au scroll ; carrousel à accroche sur mobile |
| 5. Boutique | bandeau horizontal | Rendus 3D HD des produits | Défilement par scroll ou glisser, inclinaison 3D légère au survol |
| 6. Visite 360° | plein cadre | mur des familles (recadré, voir §5) | Bouton circulaire qui pulse |
| 7. Carte cadeau | section vert profond | Carte dessinée en HTML/CSS | Inclinaison 3D au survol |
| 8. Infos pratiques + pied de page | — | comptoir | Carte OSM désaturée (chargée au clic), lettre d'information avec consentement séparé |

Règles transverses : transformations et opacités uniquement ; `prefers-reduced-motion` = aucune scène épinglée, fondus simples ; le bouton **Réserver** de l'en-tête est toujours accessible ; aucun piège de focus (les scènes épinglées n'interceptent ni le clavier ni les lecteurs d'écran, le contenu textuel reste dans le DOM dans l'ordre de lecture).

---

## 5. Images : constats après inspection

**Résolutions :** les grands visuels font 1 672 × 941 px, ce qui ne tient pas un plein écran Retina (2 880 px). Plan : agrandissement ×2 par Real-ESRGAN (le paquet pip est accessible ; les poids du modèle restent à confirmer, voir §9), contrôle à 100 % des visages, mains et lettrages. Même agrandies (3 344 px), ces images restent dans la tolérance de 1,25× pour un plein écran 1 440 px en densité 2.

**Petites images :** `deux-espaces-atelier/boutique` (≈ 452 px) → cadres de 360 px CSS maximum sur Retina après ×2, sinon 225 px. `parcours-*` (≈ 508 px) → même logique. `flacon-reference-face.png` (290 × 417) : référence de modélisation uniquement, jamais affichée.

**Textes générés par IA :** les wordmarks muraux et les étiquettes visibles sont propres sur les grands visuels ; les micro-textes des étuis et flacons de fond sont parfois flous, à surveiller dans les cadrages serrés.

**Point à arbitrer, le mur des familles :** `mur-familles-olfactives.jpg` affiche **8 familles** (Floral, Agrumes, Boisés, Ambrés, Frais, Épicés, Cuirés, Gourmands), alors que le brief en impose 4. La fiche papier de diagnostic en montre aussi 6 (Épicé, Gourmand). Proposition : recadrer le mur sur la **rangée du haut** (Floral, Agrumes, Boisés, Ambrés) et légèrement flouter les étiquettes des niches pour qu'aucun nom de famille ne soit lisible. Le diagnostic en ligne ne propose que les 4 familles du brief.

**Affiches :** seules les zones photo sont recadrées (bougie, recharge, format voyage), pour la galerie des fiches produit en complément des rendus 3D.

---

## 6. Flacon 3D (validé)

1. Modélisation procédurale en R3F selon `SPEC_FLACON_3D.md` : corps à arêtes arrondies (géométrie extrudée biseautée), cavité et jus séparés, tube plongeur, bague laiton à deux rainures, bouchon laqué, étiquette sur plaque (texture canvas 2 048 px avec Cormorant Garamond + Jost).
2. Rendu sans écran avec Playwright + Chromium (WebGL logiciel), caméra orthographique de face, superposition à 50 % et côte à côte avec la photo dans `docs/calibration/`, itérations jusqu'à coïncidence des silhouettes ; puis trois quarts contre `trio-socles-travertin.jpg`.
3. **Comparaison montrée avant de continuer.**
4. Export GLB (GLTFExporter, validé par le validateur Khronos), rendus HD transparents (face, trois quarts G/D, dos, plongée), détourés par la méthode des deux fonds (blanc / noir) pour garder la transparence réelle du verre.

Réglages retenus après calibration : biais de 8° pour la photo de face ; jus en transmission réelle avec une légère lueur de contre-jour (reste doré devant un fond sombre) ; étiquette masquée dans le tampon de réfraction pour éviter son dédoublement.

---

## 6 bis. Fonction 360° (ajoutée à la demande)

- **Toute la gamme en 3D :** flacon (fait), puis **bougie, format voyage 10 ml et coffret**, modélisés selon la même méthode, avec une comparaison aux photos montrée avant usage.
- **`VisualiseurProduit`** (composant unique) : rotation libre au doigt ou à la souris, inertie douce, zoom limité, retour automatique face caméra, gravure prévisualisée sur le flacon. Accessible au clavier (flèches gauche/droite pour tourner, + / − pour zoomer), libellé et consigne pour les lecteurs d'écran.
- **Où :** fiches produit (parfum, recharge, atelier, bougie, format voyage, coffret) ; bouton **Voir en 360°** dans le bandeau boutique de l'accueil, qui ouvre le visualiseur en plein écran (fenêtre modale, focus piégé dans la fenêtre, Échap pour fermer).
- **Secours sans WebGL, sur mobile peu puissant ou avec `prefers-reduced-motion` :** séquence de 36 rendus HD (un tous les 10°) que l'on fait défiler au glisser. Avec `prefers-reduced-motion`, aucune rotation automatique.
- **Chargement :** la 3D n'est chargée qu'à l'ouverture du visualiseur ; la première vue de la séquence s'affiche immédiatement.

Limite connue : le conteneur n'a pas de GPU ; le rendu HD passera par SwiftShader, lent mais déterministe. La qualité finale du verre sera aussi vérifiée dans un vrai navigateur.

---

## 7. Parcours et données

- **Réservation :** `BookingProvider` (interface documentée : `getDisponibilites`, `reserver`, `annuler`) ; implémentation locale avec créneaux mardi–samedi 10h00, 11h30, 14h30, 16h00, 17h30 (dans `content/site.ts`), créneaux pris simulés par hachage déterministe de la date. Profil du diagnostic pré-rempli et joint. `.ics` téléchargeable.
- **Panier :** Zustand persistant ; règle « bougie à 45 € si un atelier est au panier » centralisée dans `lib/prix.ts`, avec la mention « Prix atelier ». Recharge bloquée sans référence. Paiement : encart « Paiement sécurisé » + **Valider la commande**, derrière `PaymentProvider` prêt pour Stripe. Aucun faux formulaire de carte.
- **E-mails :** deux envois par action (client + boutique) avec le jeu de variables commun du brief ; échec partiel journalisé sans bloquer la confirmation ; honeypot, délai minimum, bouton désactivé pendant l'envoi.
- **Contenus :** tout dans `content/*.ts`, valeurs d'exemple explicites pour l'adresse, le téléphone, les horaires et les réseaux (listées dans le README).

---

## 8. Vérification

Captures Playwright de chaque page et de chaque scène à plusieurs positions de scroll, en 1 440 × 900 et 375 × 812 avec `deviceScaleFactor: 2`, plus le mode `prefers-reduced-motion`. Script de contrôle automatique de la règle « taille affichée × densité ≤ largeur native × 1,25 » sur toutes les `<img>`. Lighthouse sur les pages principales. Parcours complets : diagnostic → réservation pré-remplie ; atelier + bougie à 45 € ; recharge sans référence bloquée ; carte cadeau personnalisée. E-mails réels envoyés seulement après ta confirmation que les gabarits sont collés dans EmailJS.

---

## 9. Ce qui manque ou bloque

- **`maquette-360.html` n'est pas dans le kit** (zip séparé). Nécessaire pour `/visite` ; envoie-le quand tu peux.
- **frontend-design :** pas encore installé dans cette session (UI UX Pro Max l'est déjà dans le dépôt). Installation à tenter au début de l'étape design system ; en cas d'échec, je le signale et je continue.
- **Real-ESRGAN :** fait. Les 13 grands visuels sont agrandis ×2 (`assets-src/x2/`) et contrôlés à 100 %.
- **Emplacement :** le site est construit à la racine de ce dépôt (`Portfolio-`), à côté des skills existants.
