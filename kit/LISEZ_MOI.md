# Kit Claude Code : site Maison Sensa

## Utilisation

1. Dézippe ce dossier sur ton ordinateur. Dézippe aussi `maison-sensa-maquette-360.zip` et place `maquette-360.html` dans le dossier `reference/` (tu peux aussi l'ajouter plus tard, Claude Code te le demandera).
2. Ouvre Claude Code **dans ce dossier** (terminal : `cd maison-sensa-site-kit` puis `claude`).
3. Envoie ce message :

   > Lis PROMPT_CLAUDE_CODE.md en entier, regarde toutes les images du dossier assets et les documents du dossier reference, puis réalise le site en suivant la méthode de travail décrite.

4. Claude Code installera les skills UI UX Pro Max et frontend-design. Il te montrera ensuite son plan (avec la direction de style choisie), puis la **comparaison entre le flacon 3D et ta photo**. Valide ces deux étapes, puis laisse-le enchaîner.

## La vidéo de lancement (15 secondes)

Le kit contient aussi `PROMPT_MOTION_DESIGN.md`, le brief du film de lancement. Il réutilise le flacon 3D du site.

- **Recommandé :** une fois le site terminé, ouvre une nouvelle session Claude Code dans le même dossier et envoie :
  > Lis PROMPT_MOTION_DESIGN.md et SPEC_FLACON_3D.md, puis réalise le film de lancement.
- **En même temps que le site :** possible, mais lance d'abord le site. Le prompt du film demande alors de partager le même modèle 3D au lieu d'en créer un second.

## E-mails (EmailJS)

Tes identifiants EmailJS sont déjà dans le fichier caché `.env.local` : clé publique, service, template client, template boutique et adresse maison.sensaproject@gmail.com. Sur Mac, appuie sur Cmd + Maj + . pour voir les fichiers cachés.

- Claude Code créera deux gabarits HTML dans `emails/`. Tu les colleras dans tes deux templates EmailJS en suivant la notice qu'il écrira dans le README.
- Ne mets jamais `.env.local` sur GitHub (le `.gitignore` l'exclut déjà) et n'y ajoute jamais ta Private Key.
- Au moment de la mise en ligne, ajoute ton nom de domaine dans les domaines autorisés d'EmailJS.

## Contenu

- `PROMPT_CLAUDE_CODE.md` : le brief complet du site (marque, direction artistique, motion design, pages, règles).
- `SPEC_FLACON_3D.md` : la fiche technique du flacon en vraie 3D, commune au site et au film.
- `PROMPT_MOTION_DESIGN.md` : le brief du film de lancement de 15 secondes.
- `assets/` : tes visuels renommés et classés (marque, boutique, produits, supports, parcours), plus la photo de référence du flacon.
- `reference/` : la maquette 360° et les textes utiles du dossier (outils de vente, merchandising, dossier actualisé).

## À préparer avant la mise en ligne

L'adresse, le téléphone, l'e-mail, les horaires, les réseaux sociaux, le délai de remise du parfum et les informations légales (raison sociale, SIREN, hébergeur). Claude Code mettra des valeurs d'exemple faciles à remplacer.

Si tu obtiens un jour un rendu haute définition du flacon sur fond transparent, il suffira de remplacer un seul fichier pour améliorer la scène du flacon héros.
