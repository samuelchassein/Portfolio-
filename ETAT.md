# État du projet Maison Sensa

Fichier de reprise : ce qui est fait, ce qui reste, où sont les choses. À tenir à jour à chaque étape.
Brief : `kit/PROMPT_CLAUDE_CODE.md` · Plan et décisions : `PLAN.md` · Branche : `claude/new-session-629lgy`.

## Fait

- **Plan** validé (`PLAN.md`) : direction « Galerie minérale », Cormorant Garamond + Jost.
- **3D** (`components/three/`) : flacon calibré sur la photo (`docs/calibration/`), bougie, format voyage, coffret ; GLB dans `public/models/`.
- **Rendus Blender** (`scripts/blender/rendu.py`, `produire.sh` reprenable) : fait pour flacon (5 vues), bougie, format voyage, coffret (3 vues chacun), 360° des 4 produits, scène gamme, scènes boutique flacon et gamme. Reste : scènes boutique bougie, format voyage, coffret (relancer `produire.sh`, il saute l’existant). Conversion : `node scripts/convertir-rendus.mjs`.
- **Images** : agrandies ×2 (`assets-src/x2/` → `public/images/`), recadrages d'affiches (`public/images/produits/`), mur des familles recadré et étiquettes floutées (`mur-familles-haut.jpg`).
- **Design system** validé : `app/globals.css` (tokens), `components/brand/*`, `components/ui/*`, page `/styleguide`.
- **Habillage** : `app/(site)/layout.tsx` (en-tête, pied, tiroir panier, Lenis).
- **Accueil** : scènes 0 à 8 (`components/scenes/*`), versions sans animation. Choix : tour complet du flacon par famille (étiquette lisible à chaque famille).
- **Contenus** : `content/site.ts`, `familles.ts`, `produits.ts`. Panier : `stores/panier.ts` (règle bougie 45 € avec atelier).

## Reste (ordre de priorité)

1. ~~`/atelier`, réservation, gabarits `emails/`, notice README~~ fait.
2. ~~`/diagnostic`~~ fait.
3. ~~Boutique, fiches (visualiseur 360°), panier, commande simulée~~ fait (tests : recharge bloquée, atelier + bougie 45 €, commande).
4. ~~`/carte-cadeau`~~ fait.
5. ~~`/maison`, `/contact`, pages légales, bandeau cookies, SEO~~ fait.
6. `/visite` : page prête ; s’active seule dès que `public/visite-360/maquette-360.html` est déposé (fichier toujours manquant).
7. ~~Vérification groupée (1 440 / 375, sans animation), build de production~~ fait. Reste : Lighthouse, à lancer quand Blender aura fini (CPU occupé).
8. Tests e-mails réels après collage des gabarits dans EmailJS par la personne.

## Mode de travail

Économe en tokens : une capture de contrôle par page, vérification groupée à la fin. Commit + push après chaque page.

## Outils

- Serveur : `npx next dev -p 3100`. Captures : `scripts/captures.mjs`, `scripts/captures-defilement.mjs`.
- Blender : `PY=<venv bpy> scripts/blender/produire.sh` (venv dans le scratchpad de session : à recréer avec `pip install bpy` si nouvelle session).
