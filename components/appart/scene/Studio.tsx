import { memo } from "react";
import type { EtatStream } from "@/data/stream";
import { ImageSalon, PLEIN } from "./Calque";
import { Ecrans, Enseigne, Frigo, Instruments, LampeOnAir, LampeStudio, TableauHoraires, ZoneClavier, ZoneCordes } from "./objets-studio";
import { CitrouilleFrigo, GuirlandeStudio, LueurCitrouilleFrigo } from "./saisons";
import { FanionsStudio } from "./temps-forts";
import type { ActionsScene, EtatScene } from "./types";
import { EcransStudio, LumieresStudio } from "./vivants-studio";

/* ───────────────────────────────────────────────────────────────────────
   Le studio de stream, à droite du salon. Même empilement que le salon :
   décor fixe (images) → objets → meubles → voile de nuit → lumières.
   ─────────────────────────────────────────────────────────────────────── */

export default memo(function Studio({
  etat,
  actions,
  etatStream,
}: {
  etat: EtatScene;
  actions: ActionsScene;
  etatStream: EtatStream;
}) {
  const { decor } = etat;
  return (
    <>
      <ImageSalon nom="studio-fond" boite={PLEIN} />
      <TableauHoraires />
      <LampeOnAir />
      <Enseigne allume={etat.neon} basculer={actions.basculerNeon} />
      <LampeStudio allume={etat.lampeStudio} basculer={actions.basculerLampeStudio} />
      <Ecrans ouvrir={actions.ouvrir} survoler={actions.survoler} />
      <ImageSalon nom="studio-meubles" boite={PLEIN} />
      <Instruments ouvrir={actions.ouvrir} survoler={actions.survoler} accords={etat.accords} touches={etat.touches} />
      <ZoneCordes gratter={actions.gratter} />
      <ZoneClavier jouer={actions.jouerTouche} />
      <Frigo />
      {decor?.citrouilles && <CitrouilleFrigo />}
      {decor?.fanions && <FanionsStudio couleurs={decor.fanions} />}

      <div className="voile" aria-hidden />
      <LumieresStudio />
      {decor?.citrouilles && <LueurCitrouilleFrigo />}
      {decor?.guirlande && <GuirlandeStudio couleurs={decor.guirlande} />}
      <EcransStudio etat={etatStream} />
      <div className="vignette" aria-hidden />
    </>
  );
});
