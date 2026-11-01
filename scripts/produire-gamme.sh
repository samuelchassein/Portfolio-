#!/usr/bin/env bash
# Produit, pour chaque produit donné, le GLB, les rendus HD détourés et la
# séquence 360°. À lancer contre une version compilée du site (BASE).
#   BASE=http://localhost:3300 scripts/produire-gamme.sh <dossier-travail> bougie voyage coffret
set -euo pipefail
TRAVAIL="$1"; shift
for P in "$@"; do
  echo "== $P"
  PRODUIT="$P" node scripts/flacon-studio.mjs glb
  PRODUIT="$P" node scripts/flacon-studio.mjs hd "$TRAVAIL/hd-$P"
  NOM="$P"; [ "$P" = voyage ] && NOM=format-voyage
  node scripts/detourer.mjs "$TRAVAIL/hd-$P" public/renders "$NOM"
  PRODUIT="$P" node scripts/flacon-studio.mjs spin "$TRAVAIL/spin-$P"
done
echo "== terminé"
