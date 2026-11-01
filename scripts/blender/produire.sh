#!/usr/bin/env bash
# Production des rendus Blender (Cycles) de la gamme Maison Sensa.
#   PY=<python avec bpy> scripts/blender/produire.sh [etape…]
# Étapes : studio-flacon 360-flacon gamme studio-gamme 360-gamme boutique
# Sorties : public/renders/<produit>-<vue>.png (détourées, verre réfractant l'ivoire du site)
#           public/renders/scenes/*.png (mises en scène)
#           tmp-360/<produit>/NN.png (converties ensuite en WebP par scripts/convertir-rendus.mjs)
set -euo pipefail
PY="${PY:-python3}"
R="scripts/blender/rendu.py"
HD="--largeur 1800 --hauteur 2400 --echantillons ${ECH_HD:-56}"
ETAPES="${*:-studio-flacon 360-flacon gamme studio-gamme 360-gamme boutique}"

# Reprenable : une image déjà rendue n'est pas refaite (FORCER=1 pour tout refaire).
rendre() {
  local sortie=""
  local prec=""
  for a in "$@"; do [ "$prec" = "--sortie" ] && sortie="$a"; prec="$a"; done
  if [ -z "${FORCER:-}" ] && [ -s "$sortie" ]; then echo "-- déjà fait : $sortie"; return; fi
  echo "== $*"
  "$PY" -I "$R" "$@" 2>&1 | grep -E "^rendu|Error|Traceback" || true
}

for E in $ETAPES; do
  case "$E" in
    studio-flacon)
      for V in face trois-quarts-gauche trois-quarts-droite dos plongee; do
        rendre --produit flacon --vue "$V" --scene studio --sortie "public/renders/flacon-$V.png" $HD
      done ;;
    360-flacon|360-gamme)
      if [ "$E" = 360-flacon ]; then LISTE=flacon; else LISTE="bougie format-voyage coffret"; fi
      for P in $LISTE; do
        for i in $(seq 0 35); do
          rendre --produit "$P" --vue "angle:$((-i * 10))" --scene studio \
            --sortie "tmp-360/$P/$(printf %02d "$i").png" --largeur 600 --hauteur 800 --echantillons "${ECH_360:-24}"
        done
      done ;;
    gamme)
      rendre --scene gamme --vue face --sortie public/renders/scenes/gamme-boutique.png --largeur 2400 --hauteur 1600 --echantillons "${ECH_HD:-56}" ;;
    studio-gamme)
      for P in bougie format-voyage coffret; do
        for V in face trois-quarts-gauche trois-quarts-droite; do
          rendre --produit "$P" --vue "$V" --scene studio --sortie "public/renders/$P-$V.png" $HD
        done
      done ;;
    boutique)
      for P in flacon bougie format-voyage coffret; do
        rendre --produit "$P" --vue trois-quarts-gauche --scene boutique --sortie "public/renders/scenes/$P-boutique.png" $HD
      done ;;
  esac
done
echo "== terminé"
