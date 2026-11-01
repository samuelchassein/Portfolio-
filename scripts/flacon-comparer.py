"""Comparaison rendu 3D / photo de référence : côte à côte + superposition 50 %
+ contours de la photo sur le rendu. Usage : python3 scripts/flacon-comparer.py rendu.png ref.png sortie.png "titre" """
import sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

rendu_p, ref_p, sortie, titre = sys.argv[1:5]
rendu = Image.open(rendu_p).convert("RGBA")
ref = Image.open(ref_p).convert("RGB").resize(rendu.size, Image.LANCZOS)
fond = Image.new("RGBA", rendu.size, (246, 237, 221, 255))
rendu_plat = Image.alpha_composite(fond, rendu).convert("RGB")
melange = Image.blend(ref, rendu_plat, 0.5)
bords = ref.convert("L").filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 40 else 0)
contours = rendu_plat.copy()
contours.paste((220, 30, 30), mask=bords)
W, H = rendu.size
pad, top = 16, 46
out = Image.new("RGB", (W * 4 + pad * 5, H + top + pad), (246, 237, 221))
d = ImageDraw.Draw(out)
for i, (im, nom) in enumerate([(ref, "Photo de référence"), (rendu_plat, "Rendu 3D"), (melange, "Superposition 50 %"), (contours, "Contours de la photo sur le rendu")]):
    x = pad + i * (W + pad)
    out.paste(im, (x, top))
    d.text((x, top - 18), nom, fill=(28, 26, 23))
d.text((pad, 8), titre, fill=(28, 26, 23))
out.save(sortie, quality=92)
print(sortie)
