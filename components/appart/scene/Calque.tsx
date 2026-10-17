import type { CSSProperties, ReactNode } from "react";
import salon from "./salon.json";
import type { NomCalque } from "./statiques";

/* ───────────────────────────────────────────────────────────────────────
   La pièce est un empilement de calques HTML positionnés en % de la pièce.
   Chaque calque contient un petit SVG dont la viewBox est sa propre boîte :
   les dessins gardent les coordonnées globales (repère 1600 × 1000).

   Pourquoi : un calque HTML qui s'anime en transform / opacity est déplacé
   par la carte graphique, sans redessiner le reste de la scène.
   ─────────────────────────────────────────────────────────────────────── */

export interface Boite {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const PLEIN: Boite = { x: 0, y: 0, w: 1600, h: 1000 };

export function placer({ x, y, w, h }: Boite): CSSProperties {
  return { left: `${x / 16}%`, top: `${y / 10}%`, width: `${w / 16}%`, height: `${h / 10}%` };
}

/** Un SVG qui remplit sa boîte parente, dans le repère global */
export function Vue({ boite, children }: { boite: Boite; children: ReactNode }) {
  const { x, y, w, h } = boite;
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="none" className="vue" aria-hidden>
      {children}
    </svg>
  );
}

/** Un morceau de scène positionné, décoratif (ne capte pas la souris) */
export function Calque({
  boite,
  className = "",
  style,
  children,
}: {
  boite: Boite;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={`calque ${className}`} style={{ ...placer(boite), ...style }} aria-hidden>
      <Vue boite={boite}>{children}</Vue>
    </div>
  );
}

/** Une image du décor fixe (générée par `npm run salon`) */
export function ImageSalon({ nom, boite, className = "" }: { nom: NomCalque; boite: Boite; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- calque vectoriel déjà optimisé, rien à redimensionner
    <img
      src={salon[nom]}
      alt=""
      className={`calque ${className}`}
      style={placer(boite)}
      draggable={false}
      fetchPriority={nom === "fond" || nom.startsWith("meubles") ? "high" : undefined}
    />
  );
}

/** Un halo de lumière, en dégradé CSS (centre et rayon dans le repère global) */
export function Halo({ cx, cy, r, className = "" }: { cx: number; cy: number; r: number; className?: string }) {
  return <div className={`halo ${className}`} style={placer({ x: cx - r, y: cy - r, w: 2 * r, h: 2 * r })} aria-hidden />;
}
