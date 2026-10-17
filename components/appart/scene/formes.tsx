/* Formes partagées entre un objet (éteint) et sa lumière (allumée). */

/** Le globe du lampadaire lanterne */
export const LANTERNE = { cx: 150, cy: 460, r: 70 };

/** Les côtes de papier du globe */
export function CotesLanterne({ couleur }: { couleur: string }) {
  const { cx, cy, r } = LANTERNE;
  return (
    <g fill="none" stroke={couleur} strokeWidth="1.3" opacity="0.8">
      {[-56, -42, -28, -14, 0, 14, 28, 42, 56].map((dy) => {
        const rx = Math.sqrt(r * r - dy * dy);
        return <path key={dy} d={`M${cx - rx} ${cy + dy} A${rx} 3.5 0 0 0 ${cx + rx} ${cy + dy}`} />;
      })}
    </g>
  );
}

/** Le chapeau d'une lampe champignon */
export function domeChampignon(cx: number, base: number, l: number) {
  const h = l * 0.62;
  return `M${cx - l} ${base} Q${cx - l} ${base - h} ${cx} ${base - h} Q${cx + l} ${base - h} ${cx + l} ${base} Z`;
}
