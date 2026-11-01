# Mission : créer le site de Maison Sensa

Tu vas concevoir et développer le site officiel de **Maison Sensa**, une parfumerie et un atelier de création olfactive à Boulogne-Billancourt. Le site se présente comme un **vrai site de lancement de marque** : pas de mention « projet », « maquette » ou « prototype » visible par le visiteur.

Le niveau attendu est celui d'une maison de parfum haut de gamme (références d'esprit : Diptyque, Maison Francis Kurkdjian, Byredo), avec un **motion design au scroll** abouti. Ce n'est pas un template : chaque section doit donner l'impression d'avoir été pensée pour cette marque.

Tout ce dont tu as besoin est dans ce dossier. Lis ce fichier en entier, ainsi que **`SPEC_FLACON_3D.md`** (le flacon en vraie 3D), puis parcours `assets/` et `reference/` **avant d'écrire la moindre ligne de code**.

**Exigence n°1 : la qualité visuelle.** C'est un site de lancement. Tout doit être net, propre et lisible par tous, sur tous les écrans. Aucune image pixellisée, floue ou agrandie au-delà de sa résolution. Le produit est montré en **vraie 3D photoréaliste**, pas en image plate.

**Un second projet suivra :** une vidéo de lancement de 15 secondes (`PROMPT_MOTION_DESIGN.md`). Elle réutilisera ton flacon 3D (export GLB) et ton design system : construis-les proprement et de façon réutilisable.

---

## 0. Skills de design à installer et utiliser en premier

Avant de concevoir quoi que ce soit, installe et charge ces skills. Utilise-les **à chaque étape de design** (direction artistique, design system, chaque scène, vérification), pas seulement au début.

1. **UI UX Pro Max** (base de styles, palettes, associations de polices et règles UX, avec un script de recherche local) :
   ```bash
   npm install -g uipro-cli
   uipro init --ai claude
   ```
   Autre possibilité dans Claude Code : `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill`, puis installer le plugin proposé. En cas de doute sur la commande, suis le README du dépôt `nextlevelbuilder/ui-ux-pro-max-skill`.
2. **frontend-design** (le skill d'Anthropic pour un design distinctif et non générique) : installe-le depuis la marketplace officielle d'Anthropic (`/plugin marketplace add anthropics/claude-code`, puis `/plugin install frontend-design`). S'il est déjà disponible, charge-le simplement.

Comment t'en servir :
- Interroge UI UX Pro Max avec le contexte « parfumerie de luxe, atelier olfactif, boutique physique, e-commerce, réservation, univers clair ivoire, vert profond, doré, noyer, travertin ». Compare **2 ou 3 directions** de style et de typographie, puis retiens celle qui sert le mieux les visuels fournis. Note ton choix et ta justification dans `PLAN.md`.
- Applique ses règles UX (cibles tactiles, contrastes, états de formulaire, feedback) à la réservation, au diagnostic et au panier.
- Avec frontend-design, vise une identité **propre à une parfumerie** : rien de générique, aucun motif « SaaS », aucun dégradé violet, aucune grille de cartes standard. Chaque section doit pouvoir être reconnue comme Maison Sensa sans le logo.
- **En cas de conflit,** la direction artistique de la section 3 et les visuels de `assets/` priment sur les suggestions des skills : les skills servent à aller plus loin dans la créativité et la rigueur, pas à changer l'univers de la marque.
- Si une installation échoue, signale-le et continue avec ce qui est disponible.

---

## 1. La marque en bref

- **Concept :** une boutique ouverte sans rendez-vous + un **Atelier Signature** individuel sur rendez-vous, où le client compose son parfum avec un conseiller, parmi des accords définis et validés par la maison.
- **Signature de marque :** « Votre identité, votre signature olfactive. »
- **Accroches disponibles :** « Un parfum qui vous ressemble. » · « Deux espaces, une expérience. » · « Une expérience qui se prolonge : je crée, j'emporte, je reviens. » · « Et si votre parfum racontait votre histoire ? » · « Une odeur peut faire revenir un souvenir. » · « Créez votre signature olfactive. » · « Votre parfum, votre signature. » · « Prolongez l'émotion chez vous. » · « Votre parfum vous accompagne. » · « Retrouvez votre signature olfactive. » · « Offrez une signature olfactive. »
- **Ton :** français, vouvoiement, sensoriel, chaleureux, sobre. Des phrases courtes. Pas de jargon marketing, pas de superlatifs creux, pas d'emojis.
- **Lieu :** Boulogne-Billancourt (Hauts-de-Seine).

### L'offre (prix TTC)

| Produit | Détail | Prix |
|---|---|---|
| **Atelier Signature** | Rendez-vous individuel avec un conseiller, 45 à 60 min, parfum 50 ml inclus | 149 € |
| Bougie parfumée | Une par famille olfactive | 59 € |
| Bougie associée à un atelier | Même bougie, proposée dans le panier si un atelier y est | 45 € |
| Format voyage 10 ml | Étui vert et doré | 29 € |
| Coffret cadeau | Coffret vert à marquage doré | Prix à définir dans `content/products.ts` (affiché « Sur demande en boutique » si vide) |
| Recharge 50 ml | Pour retrouver son parfum créé en atelier | 89 € |
| Gravure | Option sur le flacon (cadeau) | 15 € |
| Carte cadeau | « Un atelier individuel et un parfum de 50 ml » | 149 € |

### Les 4 familles olfactives (n'en ajoute pas d'autres)

| Famille | Univers | Pistes d'ambiance visuelle |
|---|---|---|
| **Frais** | Agrumes, notes vertes, eaux, aromatiques | Lumière matinale, vert tendre, zestes, feuillages |
| **Floral** | Fleurs blanches, rose, jasmin, poudré | Ivoire rosé, pétales, fleurs blanches du visuel |
| **Boisé** | Cèdre, santal, vétiver, mousses | Noyer cannelé, vert profond, sous-bois |
| **Ambré** | Résines, vanille, épices douces | Doré chaud, ambre, fin d'après-midi |

### Le déroulé de l'Atelier Signature

1. **Accueil :** on découvre vos attentes, pour vous ou pour offrir.
2. **Exploration :** vous découvrez les familles olfactives et leurs accords.
3. **Sélection :** guidé par votre conseiller, vous composez votre parfum.
4. **Votre signature :** récapitulatif de votre choix, flacon 50 ml, référence conservée pour vos recharges.

---

## 2. Les ressources fournies

### `assets/` : visuels de la marque

Ce sont des visuels générés par IA (environ 1 672 px de large). Ils définissent **exactement** l'univers à respecter.

| Fichier | Contenu | Usage prévu |
|---|---|---|
| `marque/logo-maison-sensa.jpg` | Wordmark : « MAISON » en capitales espacées sans-serif, « SENSA » en grande serif | **À recréer en SVG** (texte vectorisé) : ne jamais afficher ce PNG |
| `marque/moodboard-palette-matieres.jpg` | Palette, textures noyer cannelé et travertin, typographies | Référence du design system |
| `boutique/facade.jpg` | Façade crème, menuiseries vertes, enseigne | **Ouverture** de la séquence « entrer dans la boutique » |
| `boutique/interieur-vue-large.jpg` | Vue d'ensemble de la boutique | Séquence d'entrée, page Maison |
| `boutique/comptoir-accueil.jpg` | Comptoir d'accueil en travertin et noyer | Séquence d'entrée, infos pratiques |
| `boutique/mur-familles-olfactives.jpg` | Mur de niches par famille | Transition vers les familles, page Boutique |
| `boutique/atelier-table.jpg` | Table d'atelier, tabourets verts | Atelier, réservation |
| `boutique/atelier-conseil-client.jpg` | Conseillère et client pendant un atelier | Atelier (photo humaine principale) |
| `produits/gamme-sur-comptoir.jpg` | Coffret, flacon, bougie, format voyage | Boutique, section gamme |
| `produits/table-gamme-complete.jpg` | Mise en scène de toute la gamme | Boutique, carte cadeau |
| `produits/trio-socles-travertin.jpg` | Bougie, flacon et coffret sur socles | Accueil, fiches produit |
| `produits/affiche-bougie-59.jpg` | Affiche bougie (texte incrusté) | **Recadrer la zone photo** sans le texte, pour la fiche Bougie |
| `produits/affiche-recharge-89.jpg` | Affiche recharge (texte incrusté) | Recadrer la photo pour la fiche Recharge |
| `produits/flacon-reference-face.png` | **Flacon de face, sans compression** | **Référence absolue du modèle 3D** (voir `SPEC_FLACON_3D.md`). Ne pas l'afficher sur le site |
| `produits/affiche-format-voyage-29.jpg` | Affiche format voyage | Recadrer la photo pour la fiche Format voyage |
| `supports/affiche-atelier-149.jpg` | Affiche atelier | Référence de mise en page |
| `supports/affiche-atelier-creation.jpg` | Affiche avec pictogrammes | Inspiration pour le bloc « 45–60 min · 50 ml · 149 € » |
| `supports/carte-cadeau.jpg` | Carte cadeau | Référence de design pour la page Carte cadeau |
| `supports/fiche-diagnostic-olfactif.jpg` | Fiche papier de diagnostic | **Base du questionnaire** du diagnostic en ligne |
| `supports/post-instagram.jpg` | Post Instagram | Inspiration pour la section manifeste |
| `boutique/atelier-mouillette.jpg` | Main tenant une mouillette au-dessus du comptoir, flacon, bougie, coffret | Diagnostic (en-tête), atelier, scène « Un parfum qui vous ressemble » |
| `boutique/deux-espaces-interieur.jpg` | Vue d'ensemble de la boutique | Section « Deux espaces, une expérience » |
| `boutique/deux-espaces-atelier.jpg` | Flacon, mouillettes et flacons d'essai sur travertin | Carte « L'atelier » de cette section |
| `boutique/deux-espaces-boutique.jpg` | Bougie, format voyage, coffret et flacon | Carte « La boutique » de cette section |
| `parcours/parcours-1-je-cree.jpg` | Cliente qui sent une mouillette avec une conseillère | Étape « 1. Je crée » |
| `parcours/parcours-2-j-emporte.jpg` | Cliente qui découvre son flacon | Étape « 2. J'emporte » |
| `parcours/parcours-3-je-reviens.jpg` | Cliente qui revient au comptoir | Étape « 3. Je reviens » (recharge) |

Les images de `boutique/deux-espaces-*`, `boutique/atelier-mouillette.jpg` et `parcours/` ont déjà été recadrées hors des affiches d'origine : elles ne contiennent plus de texte. Elles sont **petites** (environ 450 à 1 000 px de large) : respecte strictement les règles de qualité de la section 6.

### `reference/` : documents de la marque

- `outils-vente-communication.md` : fiche atelier, diagnostic, argumentaire, réponses aux objections (excellente base pour la FAQ).
- `merchandising.md` : parcours client, organisation des espaces, assortiment.
- `dossier-actualise.md` : contexte général. **Document interne :** n'en publie rien de financier, rien sur les concurrents, rien sur l'état d'avancement.
- `maquette-360.html` : visite 3D de la boutique (Three.js 0.128 via CDN, images en base64). À intégrer dans la page Visite. Ce fichier est fourni à part (zip séparé) : s'il n'est pas encore dans `reference/`, demande-le à la personne au moment de construire `/visite`.

---

## 3. Direction artistique

L'univers est **lumineux, chaud et minéral**, à l'inverse d'un univers noir et doré. Lumière dorée de fin d'après-midi, ombres de feuillage, travertin, noyer cannelé, verre, laiton, fleurs blanches et branches d'olivier.

### Palette (échantillonnée sur le moodboard ; affine-la à l'œil)

```css
--ivoire:        #F6EDDD;  /* fond principal */
--ivoire-clair:  #FBF6EE;  /* surfaces, cartes */
--travertin:     #E8DCC8;  /* séparations, fonds secondaires */
--vert-profond:  #1F3A2E;  /* couleur signature : boutons, bandeaux, pied de page */
--vert-nuit:     #142820;  /* survols, texte sur ivoire si besoin */
--dore:          #C9A26A;  /* filets, détails, pictos ; texte uniquement en grand corps */
--dore-clair:    #D4AC70;
--noyer:         #64371B;  /* accents chauds, textures */
--encre:         #1C1A17;  /* texte courant */
--encre-douce:   #5B544A;  /* texte secondaire */
```

- Le doré sur ivoire **ne passe pas le contraste** pour du texte courant : réserve-le aux filets, aux pictogrammes et aux très grands titres.
- Le vert profond est la couleur des **actions** (boutons pleins, bandeaux de réservation) et des sections « nuit ».
- Utilise un léger grain papier ou une texture travertin très subtile sur les grands aplats ivoire. Rien de criard.

### Typographie

- **Titres :** une serif élégante proche de « SENSA » et des titres des affiches. Teste et compare à l'œil avec le logo : *Cormorant Garamond* (500–600), *Libre Caslon Display* ou *Gloock*. Garde celle qui colle le mieux.
- **Petites capitales espacées** (« MAISON », surtitres, navigation) : sans-serif géométrique fine (*Jost* 400, letter-spacing 0.3–0.45em).
- **Texte courant :** *Jost* ou équivalent, 300–400, très lisible.
- Grande échelle typographique : titres héros entre 64 et 120 px sur desktop, beaucoup d'air.

### Signes graphiques récurrents (tirés des affiches)

- Filet doré court centré sous les titres.
- Cadre doré fin (1 px) autour des encarts premium : carte cadeau, prix de l'atelier.
- Bandeau vert profond avec texte doré pour les appels à l'action forts.
- Arches arrondies (comme les niches du mur et les étagères) en masque d'images.
- Pictogrammes au trait doré fin (personnes, horloge, flacon, étiquette), comme sur `affiche-atelier-creation.jpg`.

---

## 4. Expérience et motion design : la page d'accueil

Le parti pris mélange trois approches : une **ouverture cinématographique** où l'on entre dans la boutique, un **flacon héros** pour les familles, et une **mise en page éditoriale** pour le reste.

Utilise **GSAP + ScrollTrigger** pour les scènes épinglées et **Lenis** pour un défilement doux. Toutes les animations sont des transformations et opacités (pas d'animation de layout), à 60 images/s.

### Scène 0 : chargement (1,5 s maximum)
Fond ivoire. Le wordmark SVG apparaît : « MAISON » s'espace lettre par lettre, « SENSA » se révèle par un masque vertical. Un filet doré se trace dessous. Puis transition vers la scène 1. Pas de barre de progression.

### Scène 1 : entrer dans la boutique (épinglée, environ 300 vh)
1. `facade.jpg` en plein écran, léger mouvement de feuillage (parallaxe des couches ou mouvement lent de l'ombre portée). Titre : « Votre identité, votre signature olfactive. » et un indicateur « Défiler pour entrer ».
2. Au scroll, la caméra **avance doucement vers la porte centrale** (zoom limité à 1,25× maximum sur une image préalablement agrandie ×2, voir section 6), pendant qu'un **masque en forme de porte** s'ouvre au centre et révèle l'intérieur. C'est le masque qui crée la sensation d'entrer, pas un zoom profond qui pixelliserait l'image.
3. L'intérieur `interieur-vue-large.jpg` apparaît par la porte, puis occupe l'écran avec un léger mouvement vers l'avant (1,0× à 1,15×).
4. Fondu vers `comptoir-accueil.jpg`, avec un texte d'accueil : « Bienvenue chez Maison Sensa. Une boutique à découvrir librement, un atelier pour composer votre parfum. »
5. Sortie de scène vers la section suivante.

Les fondus doivent sembler continus, comme un seul mouvement de caméra : fais correspondre les axes et les échelles entre les images. **À aucun moment de la séquence une image ne doit paraître floue ou pixellisée** sur un écran 1 440 px ou Retina. Vérifie-le par captures à chaque étape du scroll.

### Scène 2 : manifeste (éditorial)
Grand texte serif qui se révèle ligne par ligne au scroll : « Une odeur peut faire revenir un souvenir. Et si elle pouvait raconter votre histoire ? ». À côté, une image en arche (`atelier-conseil-client.jpg`) avec une parallaxe douce.

### Scène 2 bis : deux espaces, une expérience (éditorial)
Titre « Deux espaces, une expérience » entre deux filets dorés. Deux grandes cartes côte à côte, images en arche :
- **L'atelier** (`deux-espaces-atelier.jpg`) : « Créez votre parfum avec un conseiller · 45 à 60 minutes · 50 ml · 149 € », bouton **Atelier sur rendez-vous** ;
- **La boutique** (`deux-espaces-boutique.jpg`) : « Bougies · Formats voyage · Coffrets cadeaux », bouton **Boutique sans rendez-vous**.

Au survol, l'image respire très légèrement et le filet doré s'allonge. Sur mobile, les cartes s'empilent.

### Scène 3 : le flacon héros et les 4 familles (épinglée, environ 400 vh)
- Le **flacon en vraie 3D** (React Three Fiber, construit selon `SPEC_FLACON_3D.md`) reste au centre de l'écran, dans un canvas WebGL transparent au-dessus du fond.
- Au scroll, il fait **une rotation complète et maîtrisée** : un quart de tour par famille, avec de légères inclinaisons, une respiration verticale et une réaction douce à la souris sur desktop. La lumière glisse sur les arêtes du verre, le jus réfracte le décor, l'étiquette reste lisible face caméra au moment où le nom de chaque famille apparaît.
- Entrée de scène : le flacon descend et se pose sur un socle de travertin, avec une ombre de contact. Sortie : il recule et se fond dans la section suivante.
- À chaque famille (Frais → Floral → Boisé → Ambré) :
  - le **fond change d'ambiance** (dégradé de couleur et de lumière) selon le tableau de la section 1 ;
  - des **éléments botaniques** flottent autour du flacon, en profondeur et avec un léger flou de champ (zestes et feuilles, pétales blancs, copeaux et feuilles de chêne, gouttes d'ambre et gousses de vanille). Dessine-les en SVG ou découpe-les proprement dans les visuels ; ils doivent rester raffinés, jamais clipart ;
  - le nom de la famille s'affiche en très grand serif, avec un compteur « 01 / 04 », trois notes caractéristiques et une phrase d'évocation ;
  - la couleur du jus (paramètre du composant 3D) glisse **légèrement** vers la teinte de la famille, sans jamais perdre le réalisme. L'environnement lumineux de la scène 3D s'accorde à l'ambiance ;
  - sans WebGL ou avec `prefers-reduced-motion`, affiche à la place les **rendus haute définition** de `public/renders/` en fondu.
- Fin de scène : « Laquelle vous ressemble ? » avec deux boutons, **Faire mon diagnostic** et **Réserver l'atelier**.

### Scène 4 : l'Atelier Signature (éditorial)
Mise en page asymétrique : `atelier-table.jpg` grand format, les 4 étapes du déroulé qui apparaissent une à une avec un fil doré qui les relie au scroll, puis le bloc « Accompagnement individuel · 45 à 60 minutes · Parfum 50 ml · 149 € » avec pictogrammes dorés (inspiré de `affiche-atelier-creation.jpg`) et le bouton **Réserver mon atelier**.

### Scène 4 bis : une expérience qui se prolonge (éditorial)
Titre « Une expérience qui se prolonge ». Trois étapes reliées par des flèches dorées qui se tracent au scroll :
1. **Je crée** (`parcours-1-je-cree.jpg`) : l'atelier avec un conseiller ;
2. **J'emporte** (`parcours-2-j-emporte.jpg`) : votre flacon 50 ml et votre référence ;
3. **Je reviens** (`parcours-3-je-reviens.jpg`) : la recharge 50 ml à 89 €.

Images en format portrait, en arche ou à angles doux. Elles apparaissent l'une après l'autre avec un léger décalage. Sur mobile, défilement horizontal avec accroche.

### Scène 5 : la boutique
Bandeau horizontal de produits, glissé par le scroll ou par le glisser-déposer : bougie, format voyage, recharge, coffret, carte cadeau. Visuels produit **nets** : de préférence les rendus 3D haute définition de `public/renders/` sur fond ivoire avec ombre douce ; sinon, des photos recadrées affichées à leur taille native ou moins. Survol avec rotation 3D légère ou léger zoom. Lien « Voir la boutique ».

### Scène 6 : visite 360°
Grande image `mur-familles-olfactives.jpg` avec un bouton circulaire « Visiter la boutique en 360° » qui pulse doucement, vers `/visite`.

### Scène 7 : carte cadeau
Section vert profond : « Offrez une signature olfactive », visuel de la carte avec un léger effet 3D au survol, bouton vers `/carte-cadeau`.

### Scène 8 : infos pratiques et pied de page
Adresse, horaires, plan (carte statique stylisée ou intégration OpenStreetMap désaturée), contact, réseaux sociaux, inscription à la lettre d'information (avec consentement séparé). Pied de page vert profond, wordmark doré.

### Règles de motion
- **`prefers-reduced-motion`** : aucune scène épinglée. Images statiques et fondus simples, tout le contenu reste accessible.
- **Mobile (moins de 768 px)** : version allégée de chaque scène. Séquence d'entrée raccourcie (environ 150 vh), flacon plus petit, moins de particules, pas d'effet souris. Teste sur 375 × 812.
- Courbes d'animation douces (`power2.out`, `expo.out`), aucun rebond.
- Pas d'animation qui bloque la lecture : un visiteur doit pouvoir atteindre le bouton de réservation en moins de 3 secondes de scroll rapide. Ajoute un bouton **Réserver** fixe dans l'en-tête.

---

## 5. Pages et fonctionnalités

Navigation : **La Maison · L'Atelier · Diagnostic · Boutique · Visite 360° · Carte cadeau**, avec les icônes panier et réserver.

### `/atelier` : l'Atelier Signature et la réservation
- Présentation complète, déroulé, ce qui est inclus, FAQ (issue des réponses aux objections de `reference/outils-vente-communication.md`).
- **Réservation en 3 étapes :**
  1. **Date et créneau** : calendrier élégant. Créneaux par défaut du mardi au samedi à 10h00, 11h30, 14h30, 16h00 et 17h30 ; tout est configurable dans `content/site.ts`. Les créneaux déjà pris sont simulés de façon déterministe.
  2. **Vos informations** : prénom, nom, e-mail, téléphone, « pour moi / pour offrir », message facultatif. Si le visiteur a fait le diagnostic, son profil est **pré-rempli** et joint à la réservation. Case de consentement aux conditions, et case marketing séparée et non cochée. **Aucune donnée de santé** demandée.
  3. **Confirmation** : récapitulatif, référence de réservation, fichier `.ics` téléchargeable, et « Vous recevrez une confirmation par e-mail ».
- Le parcours est **simulé** (stockage local), mais isolé derrière une interface `BookingProvider` documentée, pour brancher plus tard Calendly, Planity ou une API.

### `/diagnostic` : le diagnostic olfactif en ligne
Transposition interactive de `supports/fiche-diagnostic-olfactif.jpg`, avec `boutique/atelier-mouillette.jpg` en image d'accueil (« Un parfum qui vous ressemble »). Une question par écran, avec des transitions douces et une progression fine dorée :
1. Votre occasion : pour moi / pour offrir.
2. Des questions d'évocation qui orientent vers les 4 familles (par exemple « Un dimanche idéal ? », « Une matière ? », « Un moment de la journée ? »), avec des choix illustrés.
3. L'intensité souhaitée : discrète / modérée / présente.
4. Vos senteurs favorites et celles à éviter : puces à sélectionner (agrumes, rose, vanille, cuir, musc, etc.).
5. Usage : quotidien / sortie / occasion.

**Résultat :** famille dominante et famille secondaire, avec un visuel d'ambiance repris de la scène 3, un texte personnalisé et trois notes à explorer. Ensuite, **Réserver mon atelier avec ce profil** (profil transmis à la réservation) et la suggestion de la bougie de la famille. Formule toujours : « une piste à explorer avec votre conseiller ». Ne promets jamais un parfum précis.

### `/boutique`, `/boutique/[slug]` et panier
- Catalogue : bougies (4, une par famille), format voyage 10 ml, recharge 50 ml, coffret cadeau, carte cadeau, atelier.
- Sur la fiche du parfum, de la recharge ou de l'atelier, un **visualiseur 3D du flacon** (rotation au doigt ou à la souris, zoom limité, gravure prévisualisée sur le flacon quand l'option est choisie).
- Fiche produit : galerie, description sensorielle, contenance, prix, ajout au panier. Gravure en option sur les produits où elle a du sens.
- **Recharge :** champ obligatoire « Référence de votre parfum (indiquée sur votre flacon) ».
- **Règle de panier :** si un Atelier est dans le panier, la bougie passe à 45 € au lieu de 59 €, avec mention « Prix atelier ».
- Panier en tiroir latéral (Zustand, persistance locale), page `/panier`, puis **commande simulée** : coordonnées, retrait en boutique ou livraison, récapitulatif, puis confirmation avec numéro de commande.
- **Ne crée aucun faux formulaire de carte bancaire.** À l'étape paiement, affiche un encart « Paiement sécurisé » avec un bouton **Valider la commande**, et isole la logique derrière une interface `PaymentProvider` prête pour Stripe.

### `/carte-cadeau`
Choix : Atelier Signature (149 €) ou montant libre (50, 100, 150 € ou personnalisé). Saisie « Pour » et « De la part de », message, puis aperçu en direct de la carte, dessinée en HTML/CSS d'après `supports/carte-cadeau.jpg`. Ajout au panier.

### `/visite` : visite 360°
Intègre `reference/maquette-360.html` (place-le dans `public/visite-360/` et affiche-le en plein écran sous l'en-tête du site, ou porte son code dans un composant si c'est propre). Prévois un écran de chargement aux couleurs de la marque et une alternative si WebGL n'est pas disponible. **Vérifie le rendu** et harmonise ses couleurs avec la nouvelle palette claire si nécessaire.

### `/maison`
L'histoire et la philosophie : le parfum comme identité, l'accompagnement individuel, la boutique de Boulogne-Billancourt. Grandes images, citations typographiques.

### `/contact` et pages légales
Formulaire de contact simulé. Pages **Mentions légales, CGV, Politique de confidentialité, Cookies**, rédigées comme des gabarits avec des champs `[À COMPLÉTER]` (raison sociale, SIREN, hébergeur, etc.). Bandeau cookies minimal et conforme (refuser aussi simple qu'accepter).

### E-mails de confirmation avec EmailJS (réel, pas simulé)

Maison Sensa dispose d'une adresse dédiée, **maison.sensaproject@gmail.com**, connectée à un compte **EmailJS**. Les e-mails partent **vraiment** (le paiement, lui, reste simulé).

**Configuration : déjà prête.** Le fichier `.env.local` à la racine contient les identifiants : clé publique, service, les deux templates et l'adresse de la boutique.
```
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY        clé publique
NEXT_PUBLIC_EMAILJS_SERVICE_ID        service connecté à la boîte Gmail
NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT   e-mail envoyé au client
NEXT_PUBLIC_EMAILJS_TEMPLATE_BOUTIQUE notification envoyée à Maison Sensa
NEXT_PUBLIC_MAISON_SENSA_EMAIL        maison.sensaproject@gmail.com
```
- Crée le projet Next.js **dans ce dossier** pour réutiliser ce `.env.local` tel quel, ou copie-le à la racine du projet.
- Utilise le SDK `@emailjs/browser`, et lis les valeurs **uniquement** via `process.env.NEXT_PUBLIC_*`, centralisées dans `lib/email.ts`.
- **N'écris jamais ces valeurs en dur** dans le code, le README ou un autre fichier versionné. Garde `.env.local` dans `.gitignore`. Le README liste seulement les noms des variables.
- La **clé privée** EmailJS ne doit jamais être utilisée ni demandée.
- Si une variable manque, le site continue de fonctionner (confirmation à l'écran) et affiche un avertissement en console de développement.

**Deux templates, réutilisés pour tous les cas.** Il n'existe que deux templates EmailJS ; ne présume pas de leur contenu actuel. Construis donc un système **générique** : chaque action envoie un e-mail client et une notification boutique, avec le même jeu de variables.

| Action | Template CLIENT (au client) | Template BOUTIQUE (à Maison Sensa) |
|---|---|---|
| Réservation d'atelier | Confirmation : date, heure, durée, prix, référence, profil de diagnostic s'il existe, adresse, conditions de modification | « Nouvelle réservation » avec toutes les infos et les coordonnées du client |
| Commande boutique ou carte cadeau | Confirmation : articles, total, retrait ou livraison, numéro, message de la carte cadeau | « Nouvelle commande » avec les mêmes infos |
| Formulaire de contact | Accusé de réception court | Le message complet, avec « Répondre à » vers le client |

Variables communes à envoyer à chaque fois (documente-les dans le README) :
`to_email`, `to_name`, `reply_to`, `subject`, `type` (reservation / commande / contact), `titre`, `intro`, `reference`, `details_html`, `details_texte`, `total`, `client_nom`, `client_email`, `client_telephone`, `message`, `boutique_adresse`, `boutique_email`.

**Gabarits HTML à coller dans EmailJS.** Crée `emails/template-client.html` et `emails/template-boutique.html`. Ils doivent être en HTML compatible avec les messageries (tableaux, styles en ligne, 600 px de large, polices de secours) et aux couleurs de la marque : fond ivoire, wordmark, filet doré, bouton vert profond, pied de page avec l'adresse et l'e-mail. Le contenu variable passe par `{{{details_html}}}`, avec triple accolade pour que le HTML soit interprété. Les autres variables s'écrivent en double accolade. Garde un rendu propre même si une variable est vide. Prévois aussi une version texte.

**Notice dans le README, à suivre une fois.** Explique pas à pas comment :
- ouvrir chaque template dans EmailJS et coller le HTML correspondant ;
- régler le **template client** : « To Email » = `{{to_email}}`, « Subject » = `{{subject}}`, « Reply To » = `maison.sensaproject@gmail.com` ;
- régler le **template boutique** : « To Email » = `maison.sensaproject@gmail.com`, « Subject » = `{{subject}}`, « Reply To » = `{{reply_to}}` ;
- ajouter le domaine du site (et `localhost` pour les tests) dans la liste des domaines autorisés d'EmailJS, et activer la limite d'envois ;
- ajouter les 5 variables dans les réglages d'environnement de Vercel ou Netlify au moment du déploiement.

Signale aussi que l'offre gratuite d'EmailJS est limitée en nombre d'envois par mois, et que chaque action en consomme deux.

**Protection anti-abus.** Ajoute un champ piège invisible (honeypot), un délai minimum avant envoi, et désactive le bouton pendant l'envoi. Affiche des messages clairs en cas d'échec, sans perdre la réservation ni la commande. Si l'e-mail client part mais pas la notification boutique (ou l'inverse), le parcours reste confirmé côté visiteur et l'erreur est journalisée.

**Mentions.** La politique de confidentialité mentionne EmailJS comme sous-traitant d'envoi d'e-mails. L'adresse de contact affichée sur le site est maison.sensaproject@gmail.com, sauf si une autre est fixée dans `content/site.ts`.

### Données de contact
Toutes les informations pratiques sont centralisées dans `content/site.ts` : adresse, téléphone, e-mail, horaires, réseaux, créneaux et délai de remise du parfum. **N'invente ni adresse, ni téléphone, ni horaires réels.** Mets des valeurs d'exemple explicites (`"Adresse à renseigner, 92100 Boulogne-Billancourt"`) et liste-les dans le README, dans une section « À compléter avant mise en ligne ».

---

## 6. Traitement des images

1. **Inspecte chaque visuel à 100 %.** Ce sont des images IA : de petits textes sont parfois déformés (« MAISЯON » sur des étuis, étiquettes illisibles). Recadre, choisis des cadrages qui ne zooment pas sur ces défauts, ou floute très légèrement les micro-textes fautifs. Le nom de marque ne doit **jamais** apparaître mal orthographié à l'écran.
2. **Affiches avec texte incrusté** (`affiche-*.jpg`, `carte-cadeau.jpg`, `post-instagram.jpg`) : ne les affiche jamais telles quelles. Recadre uniquement la zone photographique (entre le logo du haut et le texte du bas).
3. **Règles de qualité d'image, à appliquer partout :**
   - N'affiche **jamais** une image plus grande que sa résolution réelle. La taille affichée en pixels CSS multipliée par la densité de l'écran (2 sur Retina) doit rester inférieure ou égale à la largeur native, avec une tolérance de 1,25× au maximum après agrandissement IA.
   - **Agrandis ×2 ou ×4 par IA** les visuels destinés aux grands formats (façade, intérieur, comptoir, mur, atelier) avec Real-ESRGAN (`realesrgan-ncnn-vulkan`, paquet pip `realesrgan`, ou équivalent disponible). Contrôle à 100 % qu'aucun artefact n'apparaît : visages, textes et mains doivent rester naturels. Sinon, garde l'original et réduis sa taille d'affichage.
   - Les petites images (`deux-espaces-*`, `parcours-*`) restent dans des cadres de taille raisonnable (cartes, arches, colonnes), jamais en plein écran.
   - Si une image ne tient pas la qualité à la taille voulue, **change la mise en page** (cadre, arche, colonne, fond ivoire avec rendu 3D) plutôt que d'étirer l'image.
   - Le produit seul est toujours montré via le **modèle 3D ou ses rendus haute définition** (`public/renders/`), jamais via un agrandissement d'une petite photo.
   - Vérifie chaque page par captures en 1 440 × 900 avec `deviceScaleFactor: 2`, et sur mobile en 375 × 812 avec la même densité.
4. **Optimisation :** génère AVIF/WebP en plusieurs tailles, avec `next/image` et des `sizes` corrects, sans jamais générer de taille supérieure à la source.
5. **Logo :** recrée le wordmark en SVG (« MAISON » en sans-serif espacée au-dessus de « SENSA » en serif), en versions encre, ivoire et dorée. Ajoute un favicon « S » serif sur vert profond.

---

## 7. Règles de contenu (impératives)

- **Ne promets jamais** un parfum « unique au monde », une « formule exclusive », une fabrication française ou des ingrédients « 100 % naturels ». Écris « composé selon vos goûts, parmi nos accords ».
- **Aucun faux avis, aucune fausse note client, aucun faux témoignage, aucune fausse mention presse.** S'il faut une section de réassurance, utilise des engagements de la maison (accompagnement individuel, temps dédié, référence conservée pour vos recharges).
- Délai de remise du parfum : lis-le dans `content/site.ts` (valeur par défaut « précisé lors de votre réservation »).
- Les bougies sont « de la même famille olfactive » que votre parfum, jamais « la même odeur ».
- Orthographe et typographie françaises soignées : espaces insécables avant « : ; ? ! », guillemets « », prix au format « 149 € ».

---

## 8. Stack technique

Choisis la meilleure option, avec cette base recommandée :

- **Next.js (App Router) + TypeScript**, compatible avec un déploiement gratuit sur Vercel ou Netlify.
- **Tailwind CSS**, avec les tokens de la section 3 dans la configuration.
- **Three.js + React Three Fiber + drei + @react-three/postprocessing** pour le flacon 3D (voir `SPEC_FLACON_3D.md`), chargés à la demande.
- **GSAP + ScrollTrigger** (scènes) et **Lenis** (défilement doux) ; Framer Motion autorisé pour les micro-interactions de l'interface (tiroir panier, étapes du diagnostic).
- **Zustand** pour le panier, le profil de diagnostic et la réservation, avec persistance locale protégée par try/catch.
- Contenus (produits, familles, textes, réglages) dans `content/*.ts` : modifiables sans toucher aux composants.
- Polices via `next/font`.
- SEO : métadonnées par page, Open Graph (image générée aux couleurs de la marque), données structurées `LocalBusiness` (sans fausses données), `sitemap.xml`, `robots.txt`.

---

## 9. Qualité, accessibilité, performance

- Lighthouse de 90 ou plus en performance, accessibilité, bonnes pratiques et SEO, sur mobile et desktop.
- Navigation au clavier complète, focus visible (anneau doré), textes alternatifs descriptifs, contrastes WCAG AA.
- Les scènes épinglées ne doivent jamais piéger le focus ou rendre le contenu inaccessible aux lecteurs d'écran.
- Aucun décalage de mise en page au chargement ; scènes lourdes chargées à la demande.

---

## 10. Méthode de travail

1. **Analyse :** lis tout le dossier, regarde chaque image, puis rédige un court plan (arborescence, composants, découpage des scènes) dans `PLAN.md`.
2. **Le flacon 3D et les images :** construis le flacon selon `SPEC_FLACON_3D.md`, avec la boucle de calibration, l'export GLB et les rendus HD. Fais les agrandissements IA, les recadrages et l'optimisation. **Montre-moi la comparaison entre le rendu 3D et la photo** avant de continuer.
3. **Design system :** tokens, typographies, wordmark SVG, boutons, filets, cadres. Crée une page `/styleguide` (non indexée) pour le valider.
4. **Page d'accueil**, scène par scène, en vérifiant chaque scène dans le navigateur.
5. **Pages secondaires et parcours :** atelier et réservation, diagnostic, boutique et panier, carte cadeau, visite 360°, maison, contact, pages légales.
6. **Vérification visuelle :** avec Playwright, capture chaque page et chaque scène à plusieurs positions de scroll, en 1 440 × 900 et 375 × 812. Compare à l'univers des visuels de `assets/` et corrige tout ce qui fait « template » ou s'en éloigne. Teste aussi le mode `prefers-reduced-motion`.
7. **Parcours complets :** diagnostic → réservation pré-remplie ; panier avec atelier + bougie à 45 € ; recharge sans référence (doit bloquer) ; carte cadeau personnalisée. Une fois les gabarits collés dans EmailJS (demande-le à la personne et attends sa confirmation), envoie **un vrai e-mail de test** pour chaque action, en mettant maison.sensaproject@gmail.com comme client, puis demande-lui de confirmer la réception et le rendu.
8. **README** en français : lancement en local, déploiement, structure, modification des contenus, liste « À compléter avant mise en ligne », branchement futur de la réservation et du paiement.

### Critères de réussite
- [ ] On a l'impression d'entrer physiquement dans la boutique au premier scroll.
- [ ] Le flacon est en vraie 3D, fidèle à la photo (comparaison validée), photoréaliste, et chaque famille a une ambiance distincte et raffinée.
- [ ] Aucune image floue ou pixellisée, en 1 440 px Retina comme sur mobile.
- [ ] `public/models/flacon-maison-sensa.glb` et `public/renders/` existent, prêts pour la vidéo de lancement.
- [ ] Les sections « Deux espaces, une expérience » et « Une expérience qui se prolonge » utilisent les nouvelles images.
- [ ] La palette, les matières et la lumière correspondent aux visuels fournis : clair, chaud, vert, doré et noyer.
- [ ] Les 4 parcours (réservation, diagnostic, panier, carte cadeau) fonctionnent de bout en bout.
- [ ] Les e-mails de réservation, de commande et de contact partent via EmailJS, aux couleurs de la marque, sans aucun identifiant écrit dans le code.
- [ ] Les choix de style retenus avec UI UX Pro Max et frontend-design sont documentés dans `PLAN.md`.
- [ ] Aucun texte de marque déformé, aucune fausse donnée, aucune promesse interdite.
- [ ] Version mobile soignée, et version sans animation complète.
