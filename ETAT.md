# État du projet Maison Sensa

Fichier de reprise : ce qui est fait, ce qui reste, où sont les choses. À tenir à jour à chaque étape.
Brief : `kit/PROMPT_CLAUDE_CODE.md` · Plan et décisions : `PLAN.md` · Branche : `claude/new-session-629lgy`.

## Fait

- **Plan** validé (`PLAN.md`) : direction « Galerie minérale », Cormorant Garamond + Jost.
- **3D** (`components/three/`) : flacon calibré sur la photo (`docs/calibration/`), bougie, format voyage, coffret ; GLB dans `public/models/`.
- **Rendus Blender** (`scripts/blender/rendu.py`, `produire.sh` reprenable) : flacon 5 vues HD faites (`public/renders/flacon-*.png|webp`). Reste : 360° (36 vues × 4), scène gamme, 3 vues × 3 produits, scènes boutique. Conversion : `node scripts/convertir-rendus.mjs`.
- **Images** : agrandies ×2 (`assets-src/x2/` → `public/images/`), recadrages d'affiches (`public/images/produits/`), mur des familles recadré et étiquettes floutées (`mur-familles-haut.jpg`).
- **Design system** validé : `app/globals.css` (tokens), `components/brand/*`, `components/ui/*`, page `/styleguide`.
- **Habillage** : `app/(site)/layout.tsx` (en-tête, pied, tiroir panier, Lenis).
- **Accueil** : scènes 0 à 8 (`components/scenes/*`), versions sans animation. Choix : tour complet du flacon par famille (étiquette lisible à chaque famille).
- **Contenus** : `content/site.ts`, `familles.ts`, `produits.ts`. Panier : `stores/panier.ts` (règle bougie 45 € avec atelier).

## Reste (ordre de priorité)

1. ~~`/atelier` + réservation~~ fait. Reste : gabarits `emails/` + notice README.
2. ~~`/diagnostic`~~ fait.
3. ~~Boutique, fiches (visualiseur 360°), panier, commande simulée~~ fait (tests : recharge bloquée, atelier + bougie 45 €, commande).
4. ~~`/carte-cadeau`~~ fait.
5. `/maison`, `/contact`, pages légales, bandeau cookies, SEO (métadonnées, OG, sitemap, robots, LocalBusiness).
6. `/visite` : **bloqué**, `maquette-360.html` manquant (zip séparé à fournir).
7. Vérification groupée (captures 1 440 / 375, sans animation), Lighthouse, README.
8. Tests e-mails réels après collage des gabarits dans EmailJS par la personne.

## Mode de travail

Économe en tokens : une capture de contrôle par page, vérification groupée à la fin. Commit + push après chaque page.

## Outils

- Serveur : `npx next dev -p 3100`. Captures : `scripts/captures.mjs`, `scripts/captures-defilement.mjs`.
- Blender : `PY=<venv bpy> scripts/blender/produire.sh` (venv dans le scratchpad de session : à recréer avec `pip install bpy` si nouvelle session).
