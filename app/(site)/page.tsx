import { Chargement } from "@/components/scenes/Chargement";
import { EntreeBoutique } from "@/components/scenes/EntreeBoutique";
import { Manifeste } from "@/components/scenes/Manifeste";
import { DeuxEspaces } from "@/components/scenes/DeuxEspaces";
import { FlaconFamilles } from "@/components/scenes/FlaconFamilles";
import { AtelierSignature } from "@/components/scenes/AtelierSignature";
import { ExperienceProlongee } from "@/components/scenes/ExperienceProlongee";
import { BandeauBoutique } from "@/components/scenes/BandeauBoutique";
import { CarteCadeauTeaser, InfosPratiques, VisiteTeaser } from "@/components/scenes/VisiteCarteInfos";

export default function Accueil() {
  return (
    <>
      <Chargement />
      <EntreeBoutique />
      <Manifeste />
      <DeuxEspaces />
      <FlaconFamilles />
      <AtelierSignature />
      <ExperienceProlongee />
      <BandeauBoutique />
      <VisiteTeaser />
      <CarteCadeauTeaser />
      <InfosPratiques />
    </>
  );
}
