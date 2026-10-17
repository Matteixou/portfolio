import { memo } from "react";
import { technos, type Techno } from "@/data/technos";

/* Le mur de cadres : un cadre par outil. Les motifs sont dessinés à la
   main, comme les affiches du salon (pas de logos officiels). */

const STYLES = [
  { cadre: "border-[#1f1b18]", fond: "bg-[#f2b48e] text-espresso", trait: "#3a281d" },
  { cadre: "border-[#9a6a40]", fond: "bg-olive text-creme", trait: "#f6efe4" },
  { cadre: "border-[#f6f1e8] ring-1 ring-sable", fond: "bg-miel text-espresso", trait: "#3a281d" },
  { cadre: "border-[#1f1b18]", fond: "bg-[#a99bc4] text-espresso", trait: "#2e2440" },
  { cadre: "border-[#9a6a40]", fond: "bg-brique text-creme", trait: "#f6efe4" },
  { cadre: "border-[#f6f1e8] ring-1 ring-sable", fond: "bg-sable text-espresso", trait: "#59623a" },
];

function Glyphe({ glyph, couleur }: { glyph: Techno["glyph"]; couleur: string }) {
  const commun = { fill: "none", stroke: couleur, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (glyph) {
    case "triangle":
      return <path d="M24 9 L39 37 H9 Z" fill={couleur} />;
    case "orbite":
      return (
        <g {...commun} strokeWidth={2}>
          <ellipse cx="24" cy="24" rx="17" ry="6.5" />
          <ellipse cx="24" cy="24" rx="17" ry="6.5" transform="rotate(60 24 24)" />
          <ellipse cx="24" cy="24" rx="17" ry="6.5" transform="rotate(-60 24 24)" />
          <circle cx="24" cy="24" r="2.6" fill={couleur} stroke="none" />
        </g>
      );
    case "accolades":
      return (
        <g {...commun}>
          <path d="M18 10 C12 10 14 22 9 24 C14 26 12 38 18 38" />
          <path d="M30 10 C36 10 34 22 39 24 C34 26 36 38 30 38" />
        </g>
      );
    case "vagues":
      return (
        <g {...commun}>
          <path d="M8 18 C14 12 20 24 26 18 S36 12 40 18" />
          <path d="M8 30 C14 24 20 36 26 30 S36 24 40 30" />
        </g>
      );
    case "hexagone":
      return <path {...commun} d="M24 7 L39 15.5 V32.5 L24 41 L9 32.5 V15.5 Z" />;
    case "elephant":
      return (
        <g {...commun}>
          <path d="M12 34 V22 C12 14 20 10 27 12 C34 14 37 20 36 27 C35 32 31 34 30 38" />
          <path d="M20 34 V26 M28 24 C28 30 32 32 36 30" />
          <circle cx="27" cy="20" r="1.2" fill={couleur} stroke="none" />
        </g>
      );
    case "prisme":
      return (
        <g {...commun}>
          <path d="M24 7 L38 36 L20 41 L10 30 Z" />
          <path d="M24 7 L20 41" />
        </g>
      );
    case "serpent":
      return (
        <g {...commun}>
          <path d="M14 38 C8 38 8 30 14 30 H30 C38 30 38 18 30 18 H20 C12 18 12 9 20 9 H32" />
          <circle cx="33" cy="9" r="1.4" fill={couleur} stroke="none" />
        </g>
      );
    case "branches":
      return (
        <g {...commun}>
          <path d="M16 8 V40" />
          <path d="M16 20 C16 28 32 22 32 32" />
          <circle cx="16" cy="40" r="3" fill={couleur} stroke="none" />
          <circle cx="16" cy="8" r="3" fill={couleur} stroke="none" />
          <circle cx="32" cy="33" r="3" fill={couleur} stroke="none" />
        </g>
      );
    case "baleine":
      return (
        <g {...commun}>
          <path d="M7 26 H36 C38 32 32 39 22 39 C12 39 8 33 7 26 Z" />
          <path d="M36 26 C38 22 41 21 42 22" />
          <path d="M13 21 h5 v5 M19 21 h5 v5 M25 21 h5 v5 M19 15 h5 v5" />
        </g>
      );
    default:
      return null;
  }
}

function Atelier() {
  return (
    <div>
      <p className="leading-relaxed text-moka">
        Les outils avec lesquels je construis les projets de Krylos. Chaque cadre du mur en est un.
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
        {technos.map((t, i) => {
          const s = STYLES[i % STYLES.length];
          const penche = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9][i % 6];
          return (
            <li key={t.name} className="group">
              <div
                className={`rounded-[4px] border-[6px] ${s.cadre} bg-[#f4ede2] p-2 shadow-[0_14px_24px_-14px_rgb(43_34_29/0.6)] transition-transform duration-300 group-hover:rotate-0`}
                style={{ rotate: `${penche}deg` }}
              >
                <div className={`flex aspect-[5/4] flex-col justify-between p-3 ${s.fond}`}>
                  <svg viewBox="0 0 48 48" className="size-10" aria-hidden>
                    <Glyphe glyph={t.glyph} couleur={s.trait} />
                  </svg>
                  <div>
                    <p className="font-serif text-lg leading-tight font-medium">{t.name}</p>
                    <p className="text-xs opacity-90">{t.note}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-9 rounded-2xl border border-dashed border-cognac/50 p-5">
        <p className="font-main text-xl leading-none text-brique">et cet appartement ?</p>
        <p className="mt-2 text-sm leading-relaxed text-espresso">
          Il est dessiné à la main en SVG, objet par objet, et animé en CSS : la lumière, la fumée des bougies, le
          chat qui respire. Pas de 3D, pas de photo, juste du code. Construit avec Next.js, React, TypeScript et
          Tailwind CSS.
        </p>
      </div>
    </div>
  );
}

/* Mémorisé : le panneau ne se redessine pas quand la pièce change */
export default memo(Atelier);
