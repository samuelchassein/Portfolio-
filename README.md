# Maison Sensa — site officiel

Parfumerie et atelier de création olfactive à Boulogne-Billancourt.
Next.js (App Router) · TypeScript · Tailwind CSS · React Three Fiber · GSAP + Lenis · Zustand · EmailJS.

## Lancer le site en local

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # version de production
```

Les identifiants EmailJS sont lus dans `.env.local` (jamais versionné, voir `.env.example`).

## Déployer (Vercel ou Netlify, offre gratuite)

1. Importez le dépôt GitHub dans Vercel (ou Netlify). Le framework Next.js est détecté automatiquement.
2. Ajoutez les **5 variables d'environnement** (Settings → Environment Variables) avec les valeurs de `.env.local` :
   `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_BOUTIQUE`, `NEXT_PUBLIC_MAISON_SENSA_EMAIL`.
   Facultatif : `NEXT_PUBLIC_SITE_URL` (adresse définitive du site, pour le référencement).
3. Déployez, puis ajoutez le domaine du site dans les domaines autorisés d'EmailJS (voir plus bas).

## Modifier les contenus (sans toucher aux composants)

| Fichier | Contenu |
|---|---|
| `content/site.ts` | Adresse, téléphone, e-mail, horaires, réseaux, créneaux de l'atelier, délai de remise, frais de livraison, mentions légales |
| `content/produits.ts` | Catalogue et prix (dont le prix du coffret : `PRIX.coffret`, « Sur demande en boutique » tant qu'il vaut `null`) |
| `content/familles.ts` | Les 4 familles : notes, évocations, couleurs d'ambiance et de jus |
| `content/diagnostic.ts` | Questions et senteurs du diagnostic, textes de résultat |
| `content/faq.ts`, `content/atelier.ts` | FAQ et déroulé de l'atelier |
| `content/visite.ts` | Visite 360° : les 5 espaces de la boutique (textes, photos, prix, liens) |

## À compléter avant mise en ligne

Toutes ces valeurs sont des **exemples** à remplacer :

- [ ] `content/site.ts` → `adresse.rue` (« Adresse à renseigner »), `adresse.lienPlan`, `telephone`, `horaires`, `reseaux`
- [ ] `content/site.ts` → `atelier.delaiRemise` (« précisé lors de votre réservation »), `fraisLivraison` (`null` = « communiqués avant l'expédition »)
- [ ] `content/site.ts` → `legal` : raison sociale, forme juridique, SIREN, RCS, TVA, directeur de la publication, hébergeur
- [ ] `content/produits.ts` → `PRIX.coffret`
- [ ] Pages légales (`app/(site)/(legal)/`) : tous les passages **[À COMPLÉTER]** (rétractation, cartes cadeaux, médiateur, durées de conservation, prestataire de paiement)
- [ ] Le plan stylisé de la page d'accueil (`components/scenes/VisiteCarteInfos.tsx`, `PlanStylise`) est indicatif : à aligner sur l'adresse réelle
- [ ] EmailJS : autoriser le domaine du site (section suivante)

## E-mails avec EmailJS

Chaque action (réservation, commande, contact) envoie **deux e-mails** avec les **templates déjà configurés** dans le compte EmailJS de maison.sensaproject@gmail.com : le template client (`NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT`) et le template boutique (`NEXT_PUBLIC_EMAILJS_TEMPLATE_BOUTIQUE`). Rien n'est à recoller dans EmailJS.

Pour rester compatible avec ces templates, le site envoie les noms de variables usuels d'EmailJS, avec les mêmes valeurs dans les deux e-mails :

| Variable | Contenu |
|---|---|
| `name`, `from_name`, `user_name`, `to_name` | nom du client (`to_name` vaut « Maison Sensa » pour l'e-mail boutique) |
| `email`, `from_email`, `user_email` | e-mail du client |
| `to_email` | destinataire : le client, ou maison.sensaproject@gmail.com pour la boutique |
| `reply_to` | adresse de réponse : Maison Sensa pour le client, le client pour la boutique |
| `title`, `subject` | objet de l'e-mail |
| `message` | **récapitulatif complet** en texte : introduction, référence, détails, total, téléphone, message du client |
| `time` | date et heure de l'envoi (heure de Paris) |
| `phone` | téléphone du client (si fourni) |

Variables supplémentaires disponibles si un template les utilise : `type`, `titre`, `intro`, `reference`, `details_texte`, `details_html` (à insérer avec `{{{details_html}}}`), `total`, `client_nom`, `client_email`, `client_telephone`, `message_client`, `boutique_adresse`, `boutique_email`.

**Au moment de la mise en ligne :** ajoutez le domaine du site dans les domaines autorisés d'EmailJS (Account → Security), et les 5 variables dans Vercel ou Netlify (voir plus haut).

**Quota :** l'offre gratuite d'EmailJS limite le nombre d'envois par mois et **chaque action en consomme deux**. Une fois la limite atteinte, les envois échouent jusqu'au mois suivant : le parcours reste confirmé à l'écran pour le visiteur (message de secours) et l'erreur est journalisée.

Si une variable d'environnement manque, le site fonctionne quand même (confirmation à l'écran, avertissement en console de développement). Protection anti-abus : champ piège invisible, délai minimum avant envoi, bouton désactivé pendant l'envoi. La **clé privée** EmailJS n'est jamais utilisée.

## Brancher plus tard une vraie réservation ou un vrai paiement

- **Réservation** : `lib/booking/index.ts` définit l'interface `BookingProvider` (`joursOuverts`, `creneaux`, `reserver`, `annuler`). La version actuelle (`ReservationLocale`) est simulée dans le navigateur. Pour Calendly, Planity ou une API : écrivez une classe qui implémente cette interface et remplacez `fournisseurReservation`.
- **Paiement** : `lib/payment/index.ts` définit `PaymentProvider` (`payer`). La version actuelle est simulée ; aucun formulaire de carte n'existe sur le site. Pour Stripe : une route serveur crée une session Stripe Checkout et renvoie son URL ; `payer` redirige vers cette URL, puis une page de retour confirme la commande.

## Structure

```
app/(site)/          pages publiques (accueil, atelier, diagnostic, boutique, panier, carte-cadeau, visite, maison, contact, légales)
app/styleguide       design system (non indexé)
app/dev/flacon       studio 3D interne (calibration, rendus, export GLB ; non indexé)
components/scenes    scènes de la page d'accueil
components/visite    visite 360° : maquette 3D de la boutique (React Three Fiber)
components/three     flacon, bougie, format voyage, coffret (React Three Fiber), visualiseur 360°
components/brand     wordmark vectoriel, filets, cadres, arches, pictogrammes
components/ui        boutons, champs de formulaire
content/             contenus modifiables
lib/                 e-mails, réservation, paiement, .ics, anti-abus
stores/              panier (règle bougie 45 € avec atelier), profil du diagnostic
public/models        modèles 3D GLB (réutilisables par le film)
public/renders       rendus Blender HD (PNG + WebP), 360° et mises en scène
scripts/             outils : rendus Blender, captures, détourage, wordmark
kit/                 brief, visuels et documents d'origine
```

## 3D et rendus

- Le site affiche le flacon en 3D temps réel (React Three Fiber). Sans WebGL ou avec `prefers-reduced-motion`, il bascule sur les rendus Blender.
- Rendus photoréalistes : `scripts/blender/rendu.py` (Blender en module Python : `pip install bpy`), production complète et reprenable avec `PY=<python avec bpy> scripts/blender/produire.sh`, puis `node scripts/convertir-rendus.mjs`.
- Pour améliorer la scène du flacon héros avec un rendu fourni par ailleurs, il suffit de remplacer les fichiers de `public/renders/`.

Suivi détaillé de l'avancement : `ETAT.md`. Décisions de conception : `PLAN.md`.
