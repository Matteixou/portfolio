/* ───────────────────────────────────────────────────────────────────────
   Le mode disco (un secret : code Konami, ou l'interrupteur actionné cinq
   fois d'affilée). Une boule à facettes descend du plafond et des
   projecteurs colorés balaient la pièce pendant 12 secondes.
   Tout bouge en transform / opacity ; rien ne capte la souris.
   ─────────────────────────────────────────────────────────────────────── */

export const DUREE_DISCO = 12_000;

const SPOTS = [
  { couleur: "255 80 160", x: "10%", y: "20%", duree: "3.1s", delai: "0s" },
  { couleur: "80 200 255", x: "60%", y: "10%", duree: "3.7s", delai: "-1.2s" },
  { couleur: "255 210 80", x: "35%", y: "55%", duree: "2.9s", delai: "-0.6s" },
  { couleur: "140 255 120", x: "75%", y: "50%", duree: "3.4s", delai: "-2s" },
  { couleur: "190 120 255", x: "20%", y: "65%", duree: "4s", delai: "-1.7s" },
];

const FACETTES = Array.from({ length: 7 }, (_, i) => i);

export default function Disco() {
  return (
    <div className="disco pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden>
      {SPOTS.map((s) => (
        <span
          key={s.couleur}
          className="disco-spot"
          style={{
            left: s.x,
            top: s.y,
            background: `radial-gradient(closest-side, rgb(${s.couleur} / 0.42), rgb(${s.couleur} / 0))`,
            animationDuration: s.duree,
            animationDelay: s.delai,
          }}
        />
      ))}
      {/* la boule à facettes, suspendue au plafond */}
      <div className="disco-boule">
        <svg viewBox="-40 -120 80 160" className="h-full w-full overflow-visible">
          <defs>
            <radialGradient id="g-boule" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#c9ccd6" />
              <stop offset="1" stopColor="#6c7080" />
            </radialGradient>
            <clipPath id="c-boule">
              <circle cx="0" cy="0" r="30" />
            </clipPath>
          </defs>
          <path d="M0 -120 V-30" stroke="#d6d0c6" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="30" fill="url(#g-boule)" />
          <g clipPath="url(#c-boule)" stroke="#5a5e6c" strokeWidth="0.8" opacity="0.6">
            {FACETTES.map((i) => (
              <path key={`h${i}`} d={`M-30 ${-27 + i * 9} H30`} />
            ))}
            {FACETTES.map((i) => (
              <path key={`v${i}`} d={`M${-27 + i * 9} -30 V30`} />
            ))}
          </g>
          <g className="disco-reflets" fill="#fff">
            <circle cx="-12" cy="-14" r="2" />
            <circle cx="8" cy="-6" r="1.5" />
            <circle cx="-4" cy="10" r="1.6" />
            <circle cx="14" cy="12" r="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}
