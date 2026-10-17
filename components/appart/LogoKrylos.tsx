/* ───────────────────────────────────────────────────────────────────────
   Le logo de Krylos, en quatre pétales (découpés dans le logo officiel de
   krylos.fr : public/images/krylos/). Chaque pétale est un calque qui
   bouge seul, en transform :
   - au repos, les pétales respirent doucement ;
   - au survol, ils s'écartent en tournant : le K se dessine entre eux ;
   - dans le panneau, ils arrivent de quatre côtés et s'assemblent.
   Les mouvements sont dans globals.css (.logo-krylos).
   ─────────────────────────────────────────────────────────────────────── */

/** Position de chaque pétale dans le logo d'origine (512 × 512) */
const PETALES = [
  { src: "/images/krylos/petale-1.webp", x: 2, y: 0, w: 269, h: 292 },
  { src: "/images/krylos/petale-2.webp", x: 220, y: 17, w: 288, h: 230 },
  { src: "/images/krylos/petale-3.webp", x: 300, y: 203, w: 212, h: 279 },
  { src: "/images/krylos/petale-4.webp", x: 0, y: 260, w: 359, h: 252 },
];

const pc = (v: number) => `${(v / 512) * 100}%`;

/** Les quatre pétales, à poser dans un conteneur carré `.logo-krylos` */
export function PetalesKrylos() {
  return (
    <>
      {PETALES.map((p, i) => (
        <span key={p.src} className={`petale petale-${i + 1}`} aria-hidden>
          <span className={`souffle souffle-${i + 1}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- petites images déjà optimisées, positionnées au pixel près */}
            <img src={p.src} alt="" draggable={false} style={{ left: pc(p.x), top: pc(p.y), width: pc(p.w), height: pc(p.h) }} />
          </span>
        </span>
      ))}
    </>
  );
}

/** Le logo seul, pour les panneaux : il s'assemble à l'ouverture et s'ouvre au survol */
export function LogoKrylos({ className = "" }: { className?: string }) {
  return (
    <span className={`logo-krylos logo-panneau relative block ${className}`} role="img" aria-label="Logo de Krylos">
      <PetalesKrylos />
    </span>
  );
}
