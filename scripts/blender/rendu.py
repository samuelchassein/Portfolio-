"""Rendus photoréalistes Maison Sensa avec Blender (Cycles), à partir des GLB.

Usage (Blender en module Python, `pip install bpy`) :
  python -I scripts/blender/rendu.py --produit flacon --vue face --scene studio \
      --sortie public/renders/flacon-face.png --largeur 1800 --hauteur 2400 --echantillons 256

  --produit : flacon | bougie | format-voyage | coffret
  --vue     : face | trois-quarts-gauche | trois-quarts-droite | dos | plongee | angle:<degrés>
  --scene   : studio (fond transparent, ombre portée seule)
              boutique (mise en scène : socle travertin, noyer cannelé, ombres de feuillage)
              gamme (les quatre produits ensemble, en mise en scène)

Les matériaux sont recréés pour le lancer de rayons (verre creux à cavité réelle,
jus à absorption volumique dorée, laque, laiton, carton grainé), d'après
SPEC_FLACON_3D.md. Les GLB restent la source unique de la géométrie.
"""

import argparse
import math
import os
import sys

import bpy
import bmesh
from mathutils import Vector

RACINE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODELES = os.path.join(RACINE, "public", "models")

# Réglage global de l'éclairage (calibré : le noir de l'étiquette doit rester noir).
INTENSITE = float(os.environ.get("INTENSITE", 0.38))

VUES = {
    "face": (-8, 4),
    "trois-quarts-gauche": (35, 8),
    "trois-quarts-droite": (-35, 8),
    "dos": (180, 4),
    "plongee": (-20, 26),
}


def hexa(h, a=1.0):
    h = h.lstrip("#")
    srgb = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


# --------------------------------------------------------------------------
# Scène vide
# --------------------------------------------------------------------------
def scene_vide():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.01
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.cycles.max_bounces = 24
    sc.cycles.transmission_bounces = 24
    sc.cycles.glossy_bounces = 12
    sc.cycles.transparent_max_bounces = 16
    sc.cycles.volume_bounces = 2
    sc.cycles.caustics_reflective = True
    sc.cycles.caustics_refractive = True
    sc.cycles.blur_glossy = 0.6
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = os.environ.get("LOOK", "AgX - Punchy")
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    sc.render.image_settings.color_depth = "16"
    return sc


# --------------------------------------------------------------------------
# Matériaux
# --------------------------------------------------------------------------
def principled(mat):
    mat.use_nodes = True
    for n in mat.node_tree.nodes:
        if n.type == "BSDF_PRINCIPLED":
            return n
    n = mat.node_tree.nodes.new("ShaderNodeBsdfPrincipled")
    out = next(x for x in mat.node_tree.nodes if x.type == "OUTPUT_MATERIAL")
    mat.node_tree.links.new(n.outputs[0], out.inputs[0])
    return n


def regler(p, **v):
    noms = {
        "base": "Base Color",
        "metal": "Metallic",
        "rugosite": "Roughness",
        "ior": "IOR",
        "transmission": "Transmission Weight",
        "vernis": "Coat Weight",
        "vernis_rugosite": "Coat Roughness",
        "sss": "Subsurface Weight",
        "sss_rayon": "Subsurface Radius",
        "sss_echelle": "Subsurface Scale",
        "emission": "Emission Color",
        "emission_force": "Emission Strength",
        "speculaire": "Specular IOR Level",
        "alpha": "Alpha",
    }
    for k, val in v.items():
        entree = p.inputs[noms[k]]
        if entree.is_linked and k == "base":
            continue
        entree.default_value = val


def mat_verre(mat, teinte="#F3F5EE"):
    p = principled(mat)
    regler(p, base=hexa(teinte), metal=0.0, rugosite=0.0, ior=1.5, transmission=1.0, vernis=0.0)


def mat_jus(mat, couleur="#FFFAB0", densite=float(os.environ.get("DENSITE_JUS", 24.0))):
    """Jus : interface liquide (IOR 1,36) + absorption volumique dorée.
    La couleur est celle transmise : calculée pour qu'environ 0,5 W de jus donne
    l'ambre doré de la photo (≈ 95 % de rouge, 70 % de vert, 25 % de bleu)."""
    p = principled(mat)
    regler(p, base=hexa("#FFF6E0"), metal=0.0, rugosite=0.0, ior=1.36, transmission=1.0)
    nt = mat.node_tree
    out = next(x for x in nt.nodes if x.type == "OUTPUT_MATERIAL")
    vol = nt.nodes.new("ShaderNodeVolumeAbsorption")
    c = hexa(couleur)
    vol.inputs["Color"].default_value = c
    vol.inputs["Density"].default_value = densite
    nt.links.new(vol.outputs[0], out.inputs["Volume"])


def mat_laque(mat, couleur="#1F4733", rugosite=0.14):
    p = principled(mat)
    regler(p, base=hexa(couleur), metal=0.0, rugosite=rugosite, vernis=1.0, vernis_rugosite=0.03)


def mat_laiton(mat, rugosite=0.16):
    p = principled(mat)
    regler(p, base=hexa("#E2BC7E"), metal=1.0, rugosite=rugosite)


def mat_papier(mat):
    p = principled(mat)
    regler(p, metal=0.0, rugosite=0.95, emission_force=0.0, speculaire=0.08)
    if hasattr(mat, "surface_render_method"):
        mat.surface_render_method = "DITHERED"


def mat_marquage_dore(mat):
    p = principled(mat)
    regler(p, metal=0.9, rugosite=0.28, emission_force=0.0)


def mat_cire(mat):
    p = principled(mat)
    regler(
        p,
        base=hexa("#F6ECDB"),
        metal=0.0,
        rugosite=0.45,
        sss=0.6,
        sss_rayon=(1.0, 0.55, 0.3),
        sss_echelle=0.06,
        emission_force=0.0,
    )


def mat_carton(mat):
    p = principled(mat)
    regler(p, base=hexa("#244A3A"), metal=0.0, rugosite=0.62, vernis=0.0)
    nt = mat.node_tree
    bruit = nt.nodes.new("ShaderNodeTexNoise")
    bruit.inputs["Scale"].default_value = 900.0
    bruit.inputs["Detail"].default_value = 6.0
    bosse = nt.nodes.new("ShaderNodeBump")
    bosse.inputs["Strength"].default_value = 0.12
    nt.links.new(bruit.outputs["Fac"], bosse.inputs["Height"])
    nt.links.new(bosse.outputs["Normal"], p.inputs["Normal"])


def configurer_materiaux(objets, couleur_jus=None):
    for o in objets:
        for slot in getattr(o, "material_slots", []):
            m = slot.material
            if not m:
                continue
            nom = m.name.split(".")[0]
            if nom in ("verre", "verre-bougie"):
                mat_verre(m)
            elif nom == "tube":
                mat_verre(m, "#FFFFFF")
            elif nom == "jus":
                mat_jus(m, couleur_jus or "#FFFAB0")
            elif nom == "laque-verte":
                mat_laque(m, "#11291C" if o.name.startswith("bouchon") else "#163828", 0.1 if o.name.startswith("bouchon") else 0.18)
            elif nom == "laiton":
                mat_laiton(m)
            elif nom == "etiquette":
                mat_papier(m)
            elif nom in ("marquage-dore",):
                mat_marquage_dore(m)
            elif nom == "marquage-bougie":
                mat_papier(m)
            elif nom == "cire":
                mat_cire(m)
            elif nom == "carton-vert":
                mat_carton(m)


# --------------------------------------------------------------------------
# Géométrie : verre creux (cavité réelle) pour le flacon
# --------------------------------------------------------------------------
def creuser_flacon(objets):
    verre = next((o for o in objets if o.name.startswith("verre")), None)
    jus = next((o for o in objets if o.name.startswith("jus")), None)
    if not verre or not jus:
        return
    # Cavité = jus prolongé jusqu'à 0,07 W sous l'épaule (remplissage 93 %),
    # très légèrement agrandie : la paroi intérieure du verre devient visible.
    bpy.ops.object.select_all(action="DESELECT")
    cav = jus.copy()
    cav.data = jus.data.copy()
    cav.name = "cavite"
    bpy.context.collection.objects.link(cav)
    bm = bmesh.new()
    bm.from_mesh(cav.data)
    zs = [v.co.z for v in bm.verts] if False else None
    # Coordonnées locales glTF importées : l'axe vertical est Z après import.
    zmin = min(v.co.z for v in bm.verts)
    zmax = max(v.co.z for v in bm.verts)
    h = zmax - zmin
    facteur = 1 / 0.93
    for v in bm.verts:
        v.co.z = zmin + (v.co.z - zmin) * facteur
        v.co.x *= 1.004
        v.co.y *= 1.004
    bm.to_mesh(cav.data)
    bm.free()
    mod = verre.modifiers.new("cavite", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.solver = "EXACT"
    mod.object = cav
    bpy.context.view_layer.objects.active = verre
    verre.select_set(True)
    bpy.ops.object.modifier_apply(modifier="cavite")
    bpy.data.objects.remove(cav, do_unlink=True)
    # Le booléen donne aux parois de la cavité le matériau du jus : on remet tout
    # le verre en « verre », sinon Cycles mélange les volumes et le jus pâlit.
    for p in verre.data.polygons:
        p.material_index = 0
        p.use_smooth = True
    while len(verre.data.materials) > 1:
        verre.data.materials.pop(index=len(verre.data.materials) - 1)


# --------------------------------------------------------------------------
# Import d'un produit
# --------------------------------------------------------------------------
def importer(produit, couleur_jus=None):
    avant = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODELES, f"{produit}-maison-sensa.glb"))
    objets = [o for o in bpy.data.objects if o not in avant]
    racine = next(o for o in objets if o.parent is None)
    racine.rotation_mode = "XYZ"
    meshes = [o for o in objets if o.type == "MESH"]
    if produit == "flacon":
        creuser_flacon(meshes)
    configurer_materiaux(meshes, couleur_jus)
    if produit == "bougie":
        ajouter_flamme(racine, meshes)
    return racine, meshes


def ajouter_flamme(racine, meshes):
    cire = next((o for o in meshes if o.name.startswith("cire")), None)
    if not cire:
        return
    zmax = max((cire.matrix_world @ Vector(c)).z for c in cire.bound_box)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1)
    f = bpy.context.active_object
    f.name = "flamme"
    f.scale = (0.022, 0.022, 0.07)
    f.location = (0, 0, zmax + 0.11)
    m = bpy.data.materials.new("flamme")
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        if n.type != "OUTPUT_MATERIAL":
            nt.nodes.remove(n)
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = hexa("#FFC26B")
    em.inputs["Strength"].default_value = 28.0
    nt.links.new(em.outputs[0], next(x for x in nt.nodes if x.type == "OUTPUT_MATERIAL").inputs[0])
    f.data.materials.append(m)
    f.visible_shadow = False
    f.parent = racine
    bpy.ops.object.light_add(type="POINT", location=(0, 0, zmax + 0.12))
    l = bpy.context.active_object
    l.data.energy = 6.0
    l.data.color = hexa("#FFB766")[:3]
    l.data.shadow_soft_size = 0.02
    l.parent = racine


def boite_monde(objets):
    pts = [o.matrix_world @ Vector(c) for o in objets if o.type == "MESH" for c in o.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return mn, mx


# --------------------------------------------------------------------------
# Lumière
# --------------------------------------------------------------------------
def lampe_surface(nom, lieu, cible, taille, energie, couleur="#FFE6C2", forme="RECTANGLE"):
    bpy.ops.object.light_add(type="AREA", location=lieu)
    l = bpy.context.active_object
    l.name = nom
    l.data.shape = forme
    l.data.size, l.data.size_y = taille
    l.data.energy = energie * INTENSITE
    l.data.color = hexa(couleur)[:3]
    d = Vector(cible) - Vector(lieu)
    l.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return l


def eclairage_studio(centre, hauteur):
    """Softboxes chaudes de fin d'après-midi, contre-jours pour les arêtes."""
    c = centre
    lampe_surface("cle", (-3.2, -2.6, c.z + 1.6), c, (1.4, 3.6), 900, "#FFE2B6")
    lampe_surface("appoint", (3.4, -2.2, c.z + 1.0), c, (1.2, 3.2), 380, "#FFEBD2")
    lampe_surface("contre-g", (-1.6, 2.6, c.z + 0.8), c, (0.25, 3.6), 520, "#FFF2DE")
    lampe_surface("contre-d", (1.6, 2.6, c.z + 0.8), c, (0.25, 3.6), 520, "#FFF2DE")
    lampe_surface("plafond", (0.2, -0.4, c.z + 4.2), c, (2.6, 2.6), 300, "#FFDDA6")
    lampe_surface("bande-face", (0.9, -4.5, c.z), c, (0.15, 3.2), 120, "#FFFFFF")
    lampe_surface("fond-lumineux", (0, 3.6, c.z), c, (3.5, 3.5), 260, "#FFE9C9")


def monde_studio(reflets="#3A2A1C", force_reflets=0.55, fond="#F6EDDD", force_fond=1.25):
    """Monde à deux visages : l'ivoire du site pour les rayons qui traversent
    le verre (ce que l'on voit derrière le flacon sur la page), une pièce chaude
    et sombre pour les reflets. Avec un film transparent, le fond direct reste
    détouré."""
    w = bpy.data.worlds.new("monde-studio")
    bpy.context.scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    out = nt.nodes["World Output"]
    for n in list(nt.nodes):
        if n != out:
            nt.nodes.remove(n)
    lp = nt.nodes.new("ShaderNodeLightPath")
    ou = nt.nodes.new("ShaderNodeMath")
    ou.operation = "MAXIMUM"
    nt.links.new(lp.outputs["Is Camera Ray"], ou.inputs[0])
    nt.links.new(lp.outputs["Is Transmission Ray"], ou.inputs[1])
    sombre = nt.nodes.new("ShaderNodeBackground")
    sombre.inputs["Color"].default_value = hexa(reflets)
    sombre.inputs["Strength"].default_value = force_reflets
    clair = nt.nodes.new("ShaderNodeBackground")
    clair.inputs["Color"].default_value = hexa(fond)
    clair.inputs["Strength"].default_value = force_fond
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(ou.outputs[0], mix.inputs[0])
    nt.links.new(sombre.outputs[0], mix.inputs[1])
    nt.links.new(clair.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])


def monde(couleur="#3A2A1C", force=0.6):
    w = bpy.data.worlds.new("monde")
    bpy.context.scene.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = hexa(couleur)
    bg.inputs["Strength"].default_value = force


# --------------------------------------------------------------------------
# Décor « boutique »
# --------------------------------------------------------------------------
def materiau_travertin(nom="travertin", echelle=1.0):
    m = bpy.data.materials.new(nom)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (1.0 * echelle, 1.0 * echelle, 6.0 * echelle)
    nt.links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    veines = nt.nodes.new("ShaderNodeTexNoise")
    veines.inputs["Scale"].default_value = 1.4
    veines.inputs["Detail"].default_value = 8.0
    veines.inputs["Distortion"].default_value = 0.6
    nt.links.new(mapping.outputs["Vector"], veines.inputs["Vector"])
    rampe = nt.nodes.new("ShaderNodeValToRGB")
    rampe.color_ramp.elements[0].position = 0.38
    rampe.color_ramp.elements[0].color = hexa("#BFA582")
    rampe.color_ramp.elements[1].position = 0.62
    rampe.color_ramp.elements[1].color = hexa("#E6D7BD")
    nt.links.new(veines.outputs["Fac"], rampe.inputs["Fac"])
    pores = nt.nodes.new("ShaderNodeTexVoronoi")
    pores.inputs["Scale"].default_value = 9.0 * echelle
    seuil = nt.nodes.new("ShaderNodeMath")
    seuil.operation = "LESS_THAN"
    seuil.inputs[1].default_value = 0.11
    nt.links.new(coord.outputs["Object"], pores.inputs["Vector"])
    nt.links.new(pores.outputs["Distance"], seuil.inputs[0])
    melange = nt.nodes.new("ShaderNodeMix")
    melange.data_type = "RGBA"
    melange.inputs["B"].default_value = hexa("#9C8158")
    nt.links.new(seuil.outputs[0], melange.inputs["Factor"])
    nt.links.new(rampe.outputs["Color"], melange.inputs["A"])
    nt.links.new(melange.outputs["Result"], p.inputs["Base Color"])
    p.inputs["Roughness"].default_value = 0.32
    bosse = nt.nodes.new("ShaderNodeBump")
    bosse.inputs["Strength"].default_value = 0.25
    nt.links.new(seuil.outputs[0], bosse.inputs["Height"])
    nt.links.new(bosse.outputs["Normal"], p.inputs["Normal"])
    return m


def materiau_noyer():
    m = bpy.data.materials.new("noyer-cannele")
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    # Cannelures verticales : onde en X
    onde = nt.nodes.new("ShaderNodeTexWave")
    onde.wave_type = "BANDS"
    onde.bands_direction = "X"
    onde.wave_profile = "SIN"
    onde.inputs["Scale"].default_value = 1.6
    nt.links.new(coord.outputs["Object"], onde.inputs["Vector"])
    fibres = nt.nodes.new("ShaderNodeTexNoise")
    fibres.inputs["Scale"].default_value = 18.0
    fibres.inputs["Detail"].default_value = 10.0
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (8.0, 8.0, 0.4)
    nt.links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    nt.links.new(mapping.outputs["Vector"], fibres.inputs["Vector"])
    rampe = nt.nodes.new("ShaderNodeValToRGB")
    rampe.color_ramp.elements[0].color = hexa("#2E1A0F")
    rampe.color_ramp.elements[1].color = hexa("#5E3820")
    nt.links.new(fibres.outputs["Fac"], rampe.inputs["Fac"])
    nt.links.new(rampe.outputs["Color"], p.inputs["Base Color"])
    p.inputs["Roughness"].default_value = 0.45
    bosse = nt.nodes.new("ShaderNodeBump")
    bosse.inputs["Strength"].default_value = 0.9
    bosse.inputs["Distance"].default_value = 0.05
    nt.links.new(onde.outputs["Fac"], bosse.inputs["Height"])
    nt.links.new(bosse.outputs["Normal"], p.inputs["Normal"])
    return m


def bloc(nom, dims, lieu, mat, biseau=0.01):
    bpy.ops.mesh.primitive_cube_add(size=1, location=lieu)
    o = bpy.context.active_object
    o.name = nom
    o.scale = dims
    bpy.ops.object.transform_apply(scale=True)
    if biseau:
        b = o.modifiers.new("biseau", "BEVEL")
        b.width = biseau
        b.segments = 3
    o.data.materials.append(mat)
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def feuillage_gobo(cible):
    """Soleil de fin d'après-midi filtré par un feuillage : projecteur dont la
    lumière est découpée par un motif (technique du gobo), sans plan visible."""
    lieu = Vector((cible.x - 4.2, cible.y - 3.0, cible.z + 5.0))
    bpy.ops.object.light_add(type="SPOT", location=lieu)
    s = bpy.context.active_object
    s.name = "soleil-feuillage"
    s.data.energy = 16000
    s.data.spot_size = math.radians(34)
    s.data.spot_blend = 0.25
    s.data.shadow_soft_size = 0.05
    s.data.color = hexa("#FFC88A")[:3]
    d = Vector(cible) - lieu
    s.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    s.data.use_nodes = True
    nt = s.data.node_tree
    em = next(n for n in nt.nodes if n.type == "EMISSION")
    coord = nt.nodes.new("ShaderNodeTexCoord")
    # Coordonnées de projection : direction normalisée par sa composante Z
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(coord.outputs["Normal"], sep.inputs[0])
    divx = nt.nodes.new("ShaderNodeMath")
    divx.operation = "DIVIDE"
    divy = nt.nodes.new("ShaderNodeMath")
    divy.operation = "DIVIDE"
    nt.links.new(sep.outputs["X"], divx.inputs[0])
    nt.links.new(sep.outputs["Z"], divx.inputs[1])
    nt.links.new(sep.outputs["Y"], divy.inputs[0])
    nt.links.new(sep.outputs["Z"], divy.inputs[1])
    comb = nt.nodes.new("ShaderNodeCombineXYZ")
    nt.links.new(divx.outputs[0], comb.inputs["X"])
    nt.links.new(divy.outputs[0], comb.inputs["Y"])
    bruit = nt.nodes.new("ShaderNodeTexNoise")
    bruit.inputs["Scale"].default_value = 2.5
    bruit.inputs["Detail"].default_value = 3.0
    nt.links.new(comb.outputs[0], bruit.inputs["Vector"])
    deform = nt.nodes.new("ShaderNodeVectorMath")
    deform.operation = "MULTIPLY_ADD"
    deform.inputs[1].default_value = (0.25, 0.25, 0.25)
    nt.links.new(bruit.outputs["Color"], deform.inputs[0])
    nt.links.new(comb.outputs[0], deform.inputs[2])
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 24.0
    nt.links.new(deform.outputs[0], vor.inputs["Vector"])
    rampe = nt.nodes.new("ShaderNodeValToRGB")
    rampe.color_ramp.elements[0].position = 0.26
    rampe.color_ramp.elements[0].color = (0.04, 0.04, 0.04, 1)
    rampe.color_ramp.elements[1].position = 0.33
    rampe.color_ramp.elements[1].color = (1, 1, 1, 1)
    nt.links.new(vor.outputs["Distance"], rampe.inputs["Fac"])
    fois = nt.nodes.new("ShaderNodeMath")
    fois.operation = "MULTIPLY"
    fois.inputs[1].default_value = 1.0
    nt.links.new(rampe.outputs["Color"], fois.inputs[0])
    nt.links.new(fois.outputs[0], em.inputs["Strength"])


def decor_boutique(socle_l=2.2, socle_p=1.5):
    trav = materiau_travertin()
    comptoir = materiau_travertin("comptoir", 0.6)
    noyer = materiau_noyer()
    bloc("socle", (socle_l, socle_p, 0.22), (0, 0, -0.11), trav, 0.012)
    bloc("comptoir", (14, 6, 0.3), (0, 1.0, -0.37), comptoir, 0.02)
    bloc("mur-noyer", (16, 0.25, 9), (0, 6.5, 3.5), noyer, 0)


# --------------------------------------------------------------------------
# Caméra
# --------------------------------------------------------------------------
def camera(cible, hauteur_cadre, elev_deg, focale=105, dof=None, largeur=1800, hauteur=2400, marge=1.0):
    sc = bpy.context.scene
    sc.render.resolution_x = largeur
    sc.render.resolution_y = hauteur
    sc.render.resolution_percentage = 100
    bpy.ops.object.camera_add()
    cam = bpy.context.active_object
    cam.data.lens = focale
    cam.data.sensor_fit = "VERTICAL"
    cam.data.sensor_height = 24
    # distance pour que la hauteur du cadre tienne dans l'image
    vfov = 2 * math.atan(12 / focale)
    dist = (hauteur_cadre * marge / 2) / math.tan(vfov / 2)
    e = math.radians(elev_deg)
    cam.location = (cible.x, cible.y - dist * math.cos(e), cible.z + dist * math.sin(e))
    d = Vector(cible) - cam.location
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    cam.data.clip_end = 200
    if dof:
        cam.data.dof.use_dof = True
        cam.data.dof.focus_distance = dist
        cam.data.dof.aperture_fstop = dof
    sc.camera = cam
    return cam


def sol_ombre():
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0))
    s = bpy.context.active_object
    s.name = "sol-ombre"
    s.is_shadow_catcher = True
    # Le sol ne doit apparaître ni dans les reflets ni à travers le verre.
    s.visible_glossy = False
    s.visible_transmission = False
    return s


# --------------------------------------------------------------------------
def main():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    ap = argparse.ArgumentParser()
    ap.add_argument("--produit", default="flacon")
    ap.add_argument("--vue", default="face")
    ap.add_argument("--scene", default="studio")
    ap.add_argument("--sortie", required=True)
    ap.add_argument("--largeur", type=int, default=1800)
    ap.add_argument("--hauteur", type=int, default=2400)
    ap.add_argument("--echantillons", type=int, default=256)
    ap.add_argument("--jus", default=None)
    ap.add_argument("--blend", default=None, help="enregistre aussi la scène .blend")
    a = ap.parse_args(argv)

    sc = scene_vide()
    sc.cycles.samples = a.echantillons

    if a.vue.startswith("angle:"):
        rot, elev = float(a.vue.split(":")[1]), 6
    else:
        rot, elev = VUES[a.vue]

    if a.scene == "gamme":
        produits = [("bougie", (-1.75, 0.15, 0), -18), ("flacon", (-0.15, -0.05, 0), -10), ("format-voyage", (0.95, -0.15, 0), 0), ("coffret", (2.35, 0.45, 0), -24)]
        tous = []
        for nom, lieu, r in produits:
            racine, meshes = importer(nom)
            racine.location = lieu
            racine.rotation_euler[2] = math.radians(r)
            tous += meshes
        bpy.context.view_layer.update()
        mn, mx = boite_monde(tous)
    else:
        racine, meshes = importer(a.produit, a.jus)
        racine.rotation_euler[2] = math.radians(rot)
        bpy.context.view_layer.update()
        mn, mx = boite_monde(meshes)

    centre = (mn + mx) / 2
    haut = mx.z - mn.z
    larg = max(mx.x - mn.x, mx.y - mn.y)
    ratio = a.largeur / a.hauteur

    if a.scene == "studio":
        monde_studio()
        eclairage_studio(centre, haut)
        sol_ombre()
        sc.render.film_transparent = True
        cadre = max(haut * 1.18, larg * 1.35 / ratio)
        camera(centre, cadre, elev, largeur=a.largeur, hauteur=a.hauteur)
    else:
        monde("#4A3424", 0.5)
        global INTENSITE
        INTENSITE *= 0.55  # softboxes adoucies : le soleil filtré mène la lumière
        eclairage_studio(centre, haut)
        decor_boutique(socle_l=max(2.2, larg + 1.0) if a.scene == "boutique" else 6.8, socle_p=1.5 if a.scene == "boutique" else 1.9)
        feuillage_gobo(centre)
        cadre = max(haut * 1.75, larg * 1.6 / ratio)
        cible = Vector((centre.x, centre.y, centre.z + haut * 0.12))
        camera(cible, cadre, max(elev, 7), focale=85, dof=1.8, largeur=a.largeur, hauteur=a.hauteur)

    os.makedirs(os.path.dirname(os.path.abspath(a.sortie)), exist_ok=True)
    sc.render.filepath = os.path.abspath(a.sortie)
    if a.blend:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(a.blend))
    bpy.ops.render.render(write_still=True)
    print("rendu", a.sortie)


if __name__ == "__main__":
    main()
