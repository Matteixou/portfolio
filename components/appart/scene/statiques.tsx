import type { ReactNode } from "react";
import type { Boite } from "./Calque";
import { CielDeJour, CielDeNuit, Fond, LumiereDuSoir, MasqueVitre, Meubles, Nuages, PremierPlan } from "./decor";
import { CielGymnase, GymnaseFond } from "./decor-gymnase";
import { StudioFond, StudioMeubles } from "./decor-studio";
import Defs from "./Defs";

/* ───────────────────────────────────────────────────────────────────────
   Les images du décor fixe. `npm run salon` rend chacune en fichier SVG
   autonome dans public/salon/ (nom suivi d'une empreinte, pour le cache)
   et met à jour salon.json. À relancer après toute retouche de decor.tsx.
   ─────────────────────────────────────────────────────────────────────── */

export const BOITES = {
  /** le ciel déborde de la vitre de 20 unités pour la parallaxe */
  ciel: { x: 388, y: 80, w: 464, h: 544 },
  nuages: { x: 330, y: 110, w: 600, h: 300 },
  piece: { x: 0, y: 0, w: 1600, h: 1000 },
  /** le premier plan déborde à gauche et en bas pour la parallaxe */
  avant: { x: -100, y: 630, w: 1000, h: 440 },
  /** le bandeau de ciel derrière les hautes fenêtres du gymnase */
  cielGym: { x: 0, y: 110, w: 1600, h: 140 },
} satisfies Record<string, Boite>;

function Document({ boite, children }: { boite: Boite; children: ReactNode }) {
  const { x, y, w, h } = boite;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`${x} ${y} ${w} ${h}`} width={w} height={h}>
      <Defs />
      {children}
    </svg>
  );
}

export const CALQUES = {
  "ciel-jour": () => (
    <Document boite={BOITES.ciel}>
      <CielDeJour />
    </Document>
  ),
  "ciel-nuit": () => (
    <Document boite={BOITES.ciel}>
      <CielDeNuit />
    </Document>
  ),
  "nuages-jour": () => (
    <Document boite={BOITES.nuages}>
      <Nuages couleur="#f8c3b2" clair="#fbd3ad" />
    </Document>
  ),
  "nuages-nuit": () => (
    <Document boite={BOITES.nuages}>
      <Nuages couleur="#343b66" clair="#2c3260" />
    </Document>
  ),
  fond: () => (
    <Document boite={BOITES.piece}>
      <Fond />
    </Document>
  ),
  soir: () => (
    <Document boite={BOITES.piece}>
      <LumiereDuSoir />
    </Document>
  ),
  meubles: () => (
    <Document boite={BOITES.piece}>
      <Meubles />
    </Document>
  ),
  /** à Noël, le sapin remplace le ficus (image chargée seulement en décembre) */
  "meubles-noel": () => (
    <Document boite={BOITES.piece}>
      <Meubles noel />
    </Document>
  ),
  avant: () => (
    <Document boite={BOITES.avant}>
      <PremierPlan />
    </Document>
  ),
  /** silhouette de ce qui passe devant la vitre (masque des lumières de nuit) */
  "masque-vitre": () => (
    <Document boite={BOITES.piece}>
      <MasqueVitre />
    </Document>
  ),
  "gymnase-ciel-jour": () => (
    <Document boite={BOITES.cielGym}>
      <CielGymnase nuit={false} />
    </Document>
  ),
  "gymnase-ciel-nuit": () => (
    <Document boite={BOITES.cielGym}>
      <CielGymnase nuit />
    </Document>
  ),
  "gymnase-fond": () => (
    <Document boite={BOITES.piece}>
      <GymnaseFond />
    </Document>
  ),
  "studio-fond": () => (
    <Document boite={BOITES.piece}>
      <StudioFond />
    </Document>
  ),
  "studio-meubles": () => (
    <Document boite={BOITES.piece}>
      <StudioMeubles />
    </Document>
  ),
};

export type NomCalque = keyof typeof CALQUES;
