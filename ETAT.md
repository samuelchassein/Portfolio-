# État du projet Maison Sensa

Fichier de reprise : ce qui est fait, ce qui reste, où sont les choses. À tenir à jour à chaque étape.
Brief : `kit/PROMPT_CLAUDE_CODE.md` · Plan et décisions : `PLAN.md` · Branche : `claude/new-session-629lgy`.

## Fait

- **Plan** validé (`PLAN.md`) : direction « Galerie minérale », Cormorant Garamond + Jost.
- **3D** (`components/three/`) : flacon calibré sur la photo (`docs/calibration/`), bougie, format voyage, coffret ; GLB dans `public/models/`.
- **Rendus Blender** : tous faits (studio, 360° des 4 produits, scènes boutique, utilisées dans les galeries des fiches produit). Relance : `produire.sh` (saute l’existant), puis `node scripts/convertir-rendus.mjs`.
- **Images** : agrandies ×2 (`assets-src/x2/` → `public/images/`), recadrages d'affiches (`public/images/produits/`), mur des familles recadré et étiquettes floutées (`mur-familles-haut.jpg`).
- **Design system** validé : `app/globals.css` (tokens), `components/brand/*`, `components/ui/*`, page `/styleguide`.
- **Habillage** : `app/(site)/layout.tsx` (en-tête, pied, tiroir panier, Lenis).
- **Accueil** : scènes 0 à 8 (`components/scenes/*`), versions sans animation. Choix : tour complet du flacon par famille (étiquette lisible à chaque famille).
- **Contenus** : `content/site.ts`, `familles.ts`, `produits.ts`. Panier : `stores/panier.ts` (règle bougie 45 € avec atelier).

- **Redimensionnement** (skills `mobile-native` et `emil-design-eng` d’Emil Kowalski, dans `.claude/skills/`) : au-delà de 1 680 px la taille racine suit la fenêtre (max 20 px), viewport `viewport-fit=cover` + `interactive-widget=resizes-content`, encoche et barre d’accueil (`env(safe-area-inset-*)`) sur l’en-tête, le menu, le panier et le bandeau cookies, pas de flash au toucher, champs à 16 px minimum au doigt, appui `scale(0.97)` (classe `.appui`), approche resserrée des grands titres. Audit 320 → 1 920 px : aucun débordement horizontal.

## Reste (ordre de priorité)

1. ~~`/atelier`, réservation, notice README~~ fait.
2. ~~`/diagnostic`~~ fait.
3. ~~Boutique, fiches (visualiseur 360°), panier, commande simulée~~ fait (tests : recharge bloquée, atelier + bougie 45 €, commande).
4. ~~`/carte-cadeau`~~ fait.
5. ~~`/maison`, `/contact`, pages légales, bandeau cookies, SEO~~ fait.
6. ~~/visite~~ fait : la maquette 360° fournie est reconstruite dans le site (`components/visite/`, contenus dans `content/visite.ts`), aux couleurs de la marque, 5 espaces clients, visite guidée, clavier, repli en images sans WebGL. Lighthouse : accessibilité, bonnes pratiques, SEO à 100.
7. ~~Vérification groupée, build de production, Lighthouse~~ fait (build de prod : accessibilité, bonnes pratiques, SEO à 100 ; perf mobile 54 accueil (3D), 89 atelier, 81 fiche produit ; bureau 69 / 100 / 99).
8. E-mails : on garde les templates EmailJS existants de la personne (gabarits `emails/` supprimés à sa demande) ; `lib/email.ts` envoie les variables usuelles d’EmailJS (`name`, `email`, `title`, `message` = récapitulatif complet, `time`…). Test réel à faire quand le quota mensuel EmailJS sera rechargé.

## Mode de travail

Économe en tokens : une capture de contrôle par page, vérification groupée à la fin. Commit + push après chaque page.

## Outils

- Serveur : `npx next dev -p 3100`. Captures : `scripts/captures.mjs`, `scripts/captures-defilement.mjs`.
- Blender : `PY=<venv bpy> scripts/blender/produire.sh` (venv dans le scratchpad de session : à recréer avec `pip install bpy` si nouvelle session).
