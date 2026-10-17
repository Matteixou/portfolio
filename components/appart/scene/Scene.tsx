import { memo, useMemo } from "react";
import { ImageSalon, PLEIN, placer } from "./Calque";
import Defs from "./Defs";
import { PetalesKrylos } from "../LogoKrylos";
import { B_LOGO_KRYLOS, Bougies, Cadres, Champignon, Chat, Fenetre, LampeChevet, Lanterne, Lettre, Platine, Tele } from "./objets";
import { BOITES } from "./statiques";
import { Balcon, CitrouillesSalon, GuirlandeSalon, LueursCitrouillesSalon, LumieresSapin, ToileAraignee, VitresSaison } from "./saisons";
import { AuSol, FanionsSalon, SurLaTable } from "./temps-forts";
import { Horloge } from "./horloge";
import { SecretsDuCiel, YeuxChat } from "./secrets-salon";
import type { ActionsScene, EtatScene } from "./types";
import { Dehors, Ecran, Fumee, Lumieres, Vapeur } from "./vivants";

/* ───────────────────────────────────────────────────────────────────────
   Le salon, empilé du fond vers l'avant :
   dehors → mur → objets du mur → meubles → objets posés → premier plan
   → voile de la nuit → lumières → vignettage.

   Le décor fixe est fait d'images (dessinées une seule fois), les objets
   et les animations sont de petits calques indépendants. Les états visuels
   (nuit, lampes, bougies) passent par des attributs data-* sur la pièce :
   le CSS s'en occupe, React ne redessine rien.
   ─────────────────────────────────────────────────────────────────────── */

/** Les dégradés et motifs partagés par tous les petits SVG de la page */
const Definitions = memo(function Definitions() {
  return (
    <svg className="definitions" aria-hidden width="0" height="0">
      <Defs />
    </svg>
  );
});

/* les secrets du salon : des fonctions stables pour ne pas re-rendre leurs calques */
function useSecretsSalon(trouver: ActionsScene["trouverSecret"]) {
  return useMemo(
    () => ({
      trouverLune: () => trouver("lune"),
      trouverTour: () => trouver("tour-eiffel"),
      trouverHorloge: () => trouver("horloge"),
      trouverChat: () => trouver("chat"),
    }),
    [trouver],
  );
}

export default memo(function Scene({ etat, actions }: { etat: EtatScene; actions: ActionsScene }) {
  const { trouverLune, trouverTour, trouverHorloge, trouverChat } = useSecretsSalon(actions.trouverSecret);
  const { ouvrir, survoler } = actions;
  // le décor de la période (saison + temps fort de l'année) : rien côté serveur
  const { decor } = etat;
  return (
    <>
      <Definitions />
      <Dehors saison={decor?.dehors ?? null} />
      {decor?.balcon && <Balcon type={decor.balcon} />}
      <ImageSalon nom="fond" boite={PLEIN} />
      <ImageSalon nom="soir" boite={PLEIN} className="jour-seul" />
      {decor?.vitres && <VitresSaison type={decor.vitres} />}

      <Fenetre nuit={etat.nuit} basculer={actions.basculerNuit} />
      {decor?.citrouilles && <ToileAraignee />}
      {decor?.fanions && <FanionsSalon couleurs={decor.fanions} />}
      {/* la nuit, la lune et la tour Eiffel cachent un secret */}
      {etat.nuit && <SecretsDuCiel trouverLune={trouverLune} trouverTour={trouverTour} />}
      <Cadres ouvrir={ouvrir} survoler={survoler} />
      <Horloge trouver={trouverHorloge} />
      <Lanterne allume={etat.lampes.lanterne} basculer={() => actions.basculerLampe("lanterne")} />

      <ImageSalon nom={decor?.sapin ? "meubles-noel" : "meubles"} boite={PLEIN} />
      {decor?.citrouilles && <CitrouillesSalon />}
      {decor?.sol && <AuSol type={decor.sol} />}
      <Platine tourne={etat.platine} basculer={actions.basculerPlatine} />
      <Tele ouvrir={ouvrir} survoler={survoler} />
      <Champignon allume={etat.lampes.champignon} basculer={() => actions.basculerLampe("champignon")} />
      <Vapeur />
      <Lettre ouvrir={ouvrir} survoler={survoler} />
      <Bougies allumees={etat.bougies} souffler={actions.souffler} />
      {decor?.table && <SurLaTable type={decor.table} />}

      <div className="remplir prl-avant">
        <ImageSalon nom="avant" boite={BOITES.avant} />
        <Chat caresses={etat.caresses} caresser={actions.caresser} chapeau={decor?.chapeau ?? null} />
        <YeuxChat
          caresses={etat.caresses}
          lunettesNoires={decor?.chapeau === "lunettes" || decor?.chapeau === "lunettes-coeur"}
          reveiller={trouverChat}
        />
        <LampeChevet allume={etat.lampes.chevet} basculer={() => actions.basculerLampe("chevet")} />
      </div>

      <div className="voile" aria-hidden />
      <Lumieres ciel={decor?.ciel ?? null} balcon={decor?.balcon ?? null} />
      {/* la nuit, le logo de l'affiche Krylos s'éclaire comme un caisson lumineux
          (data-lieu : il s'ouvre au survol de l'affiche, comme l'original) */}
      <div className="nuit-seule" aria-hidden>
        <div className="calque logo-krylos logo-lumineux" data-lieu="krylos" style={placer(B_LOGO_KRYLOS)}>
          <span className="halo-krylos" />
          <PetalesKrylos />
        </div>
      </div>
      {/* les lumières de saison brillent par-dessus la nuit */}
      {decor?.sapin && <LumieresSapin />}
      {decor?.citrouilles && <LueursCitrouillesSalon />}
      {decor?.guirlande && <GuirlandeSalon couleurs={decor.guirlande} />}
      <Ecran chaine={etat.chaine} zap={etat.zap} />
      <Fumee souffle={etat.souffle} bougies={etat.bougies} />
      <div className="vignette" aria-hidden />
    </>
  );
});
