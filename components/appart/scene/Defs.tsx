/* Dégradés, motifs et formes réutilisés par toute la scène. */

/** Petit générateur pseudo-aléatoire déterministe (même rendu serveur / client) */
export function alea(graine: number) {
  let s = graine;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Bruit de la télé quand on zappe : calculé une fois pour toutes */
const hasardBruit = alea(7);
const BRUIT = Array.from({ length: 22 }, () => ({
  x: Math.floor(hasardBruit() * 12),
  y: Math.floor(hasardBruit() * 12),
  w: 1 + Math.floor(hasardBruit() * 3),
  o: 0.3 + hasardBruit() * 0.7,
}));

/** Feuille de monstera : la tige s'attache en (0,0), la feuille pousse vers le haut */
export const FEUILLE_MONSTERA =
  "M0 0 C10 1 34 -2 48 -16 C58 -26 60 -38 56 -46 L24 -36 L57 -55 C58 -64 55 -73 49 -80 L20 -58 L45 -86 C38 -95 28 -101 16 -103 L8 -80 L8 -104 Q4 -106 0 -105 Q-4 -106 -8 -104 L-8 -80 L-16 -103 C-28 -101 -38 -95 -45 -86 L-20 -58 L-49 -80 C-55 -73 -58 -64 -57 -55 L-24 -36 L-56 -46 C-60 -38 -58 -26 -48 -16 C-34 -2 -10 1 0 0 Z";

/** Feuille de pothos en cœur : attache en (0,0), pointe vers +y */
export const FEUILLE_POTHOS =
  "M0 0 C-4 -4 -12 -4 -14 4 C-16 14 -8 24 0 32 C8 24 16 14 14 4 C12 -4 4 -4 0 0 Z";

export default function Defs() {
  return (
    <defs>
      {/* ─── Ciel ─────────────────────────────────────────────────── */}
      <linearGradient id="g-ciel-jour" x1="0" y1="100" x2="0" y2="610" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#6c6aa2" />
        <stop offset="0.3" stopColor="#ad8cb8" />
        <stop offset="0.56" stopColor="#ec9f8e" />
        <stop offset="0.78" stopColor="#f7ae6a" />
        <stop offset="1" stopColor="#fbd38f" />
      </linearGradient>
      <linearGradient id="g-ciel-nuit" x1="0" y1="100" x2="0" y2="610" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#0c112c" />
        <stop offset="0.5" stopColor="#1c2450" />
        <stop offset="0.85" stopColor="#3a3566" />
        <stop offset="1" stopColor="#5b4672" />
      </linearGradient>
      <radialGradient id="g-soleil">
        <stop offset="0" stopColor="#fff4d2" />
        <stop offset="0.18" stopColor="#ffe0a0" stopOpacity="0.95" />
        <stop offset="0.45" stopColor="#ffb468" stopOpacity="0.4" />
        <stop offset="1" stopColor="#ff9a5a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g-lune">
        <stop offset="0" stopColor="#fff6e0" stopOpacity="0.55" />
        <stop offset="1" stopColor="#c9c6ff" stopOpacity="0" />
      </radialGradient>
      <mask id="m-lune">
        <circle cx="508" cy="176" r="20" fill="#fff" />
        <circle cx="517" cy="170" r="17" fill="#000" />
      </mask>

      {/* ─── Pièce ────────────────────────────────────────────────── */}
      <linearGradient id="g-mur" x1="0" y1="40" x2="0" y2="700" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#d9bf9c" />
        <stop offset="0.12" stopColor="#e8d4b6" />
        <stop offset="0.8" stopColor="#e6cfae" />
        <stop offset="1" stopColor="#d8bd98" />
      </linearGradient>
      <linearGradient id="g-mur-studio" x1="0" y1="40" x2="0" y2="700" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#3b2a37" />
        <stop offset="0.5" stopColor="#4b3447" />
        <stop offset="1" stopColor="#3d2b39" />
      </linearGradient>
      <radialGradient id="g-mur-chaud" cx="640" cy="380" r="760" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#ffb06c" stopOpacity="0.55" />
        <stop offset="0.45" stopColor="#f6a068" stopOpacity="0.22" />
        <stop offset="1" stopColor="#f6a068" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="g-tache-soleil" x1="0" y1="0" x2="1" y2="0.15">
        <stop offset="0" stopColor="#ffc283" stopOpacity="0" />
        <stop offset="0.35" stopColor="#ffc283" stopOpacity="0.26" />
        <stop offset="0.7" stopColor="#ffc283" stopOpacity="0.2" />
        <stop offset="1" stopColor="#ffc283" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="g-ombre-poutre" x1="0" y1="62" x2="0" y2="110" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#6e4a2c" stopOpacity="0.22" />
        <stop offset="1" stopColor="#6e4a2c" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="g-sol" x1="0" y1="690" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#8e5934" />
        <stop offset="0.45" stopColor="#744325" />
        <stop offset="1" stopColor="#5a321b" />
      </linearGradient>
      <linearGradient id="g-rideau" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
        <stop offset="0" stopColor="#fbf6ee" />
        <stop offset="0.55" stopColor="#efe3cf" />
        <stop offset="1" stopColor="#e3d3ba" />
      </linearGradient>
      <linearGradient id="g-rayon" x1="0" y1="694" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#ffc47c" stopOpacity="0.75" />
        <stop offset="1" stopColor="#ffb470" stopOpacity="0" />
      </linearGradient>
            {/* ─── Matières ─────────────────────────────────────────────── */}
      <pattern id="p-tapis" width="96" height="64" patternUnits="userSpaceOnUse" patternTransform="translate(10 760) scale(1 0.58)">
        <path d="M0 32 Q22 14 48 0 Q70 18 96 32 Q72 48 48 64 Q26 46 0 32 Z" fill="none" stroke="#3b2f28" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M48 22 L60 32 L48 42 L36 32 Z" fill="#3b2f28" opacity="0.55" />
        <path d="M0 26 v12 M96 26 v12" stroke="#3b2f28" strokeWidth="2" />
      </pattern>
      <pattern id="p-laine" width="11" height="9" patternUnits="userSpaceOnUse">
        <path d="M1 2 q2 -2 4 0 M6 7 q2 -2 4 0" fill="none" stroke="#d9cbb2" strokeWidth="1.2" opacity="0.8" />
      </pattern>
      <pattern id="p-boucle" width="14" height="13" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="3" r="1.3" fill="#cdb998" opacity="0.4" />
        <circle cx="9" cy="1.5" r="1.1" fill="#fffaf0" opacity="0.55" />
        <circle cx="6" cy="8" r="1.2" fill="#cdb998" opacity="0.35" />
        <circle cx="12" cy="10" r="1.3" fill="#fffaf0" opacity="0.5" />
        <circle cx="3" cy="11.5" r="1" fill="#fffaf0" opacity="0.45" />
      </pattern>
      <pattern id="p-tricot" width="8" height="10" patternUnits="userSpaceOnUse">
        <path d="M0 0 L4 6 L8 0 M0 5 L4 11 L8 5" fill="none" stroke="#454e28" strokeWidth="1.3" opacity="0.7" />
      </pattern>
      <pattern id="p-cannage" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="3" fill="none" stroke="#7a5430" strokeWidth="1" opacity="0.8" />
        <path d="M0 0 L10 10 M10 0 L0 10" stroke="#c49a66" strokeWidth="0.8" opacity="0.7" />
      </pattern>
      <pattern id="p-damier" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="16" height="16" fill="#f3ead9" />
        <rect width="8" height="8" fill="#26211d" />
        <rect x="8" y="8" width="8" height="8" fill="#26211d" />
      </pattern>
      <pattern id="p-lignes-tv" width="4" height="3" patternUnits="userSpaceOnUse">
        <rect width="4" height="1" fill="#000" opacity="0.35" />
      </pattern>
      <pattern id="p-bruit" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#5d6066" />
        {BRUIT.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height="1" fill="#f4f4f4" opacity={b.o} />
        ))}
      </pattern>

      {/* ─── Meubles ──────────────────────────────────────────────── */}
      <linearGradient id="g-velours" x1="0" y1="544" x2="0" y2="710" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#6d7d45" />
        <stop offset="0.45" stopColor="#4b5b2f" />
        <stop offset="1" stopColor="#35421f" />
      </linearGradient>
      <linearGradient id="g-orange" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a83c1c" />
        <stop offset="0.32" stopColor="#e1703f" />
        <stop offset="0.62" stopColor="#d65b2d" />
        <stop offset="1" stopColor="#9e391b" />
      </linearGradient>
      <linearGradient id="g-noyer" x1="0" y1="566" x2="0" y2="680" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#82502c" />
        <stop offset="1" stopColor="#5f3a1e" />
      </linearGradient>
      <linearGradient id="g-canape" x1="0" y1="650" x2="0" y2="1060" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#f6eee1" />
        <stop offset="1" stopColor="#e2d2b8" />
      </linearGradient>
      <linearGradient id="g-verre" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e8f4f2" stopOpacity="0.5" />
        <stop offset="1" stopColor="#bcd6d2" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="g-pot-blanc" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#d9d1c4" />
        <stop offset="0.35" stopColor="#f6f2ea" />
        <stop offset="1" stopColor="#cfc6b8" />
      </linearGradient>
      <linearGradient id="g-terre-cuite" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9b4c2b" />
        <stop offset="0.4" stopColor="#c46e45" />
        <stop offset="1" stopColor="#8f4426" />
      </linearGradient>

      {/* ─── Gymnase ───────────────────────────────────────────── */}
      <linearGradient id="g-ciel-gym" x1="0" y1="120" x2="0" y2="240" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#a98cba" />
        <stop offset="0.55" stopColor="#ef9f8c" />
        <stop offset="1" stopColor="#f9c486" />
      </linearGradient>
      <linearGradient id="g-ciel-gym-nuit" x1="0" y1="120" x2="0" y2="240" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#0e1330" />
        <stop offset="1" stopColor="#2e2a5a" />
      </linearGradient>
      <linearGradient id="g-sol-gym" x1="0" y1="690" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#d9a465" />
        <stop offset="1" stopColor="#b47c46" />
      </linearGradient>
      <linearGradient id="g-terrain" x1="0" y1="722" x2="0" y2="1044" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#d6f0ff" stopOpacity="0.22" />
        <stop offset="1" stopColor="#0b0f24" stopOpacity="0.18" />
      </linearGradient>
      <linearGradient id="g-faisceau" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f2f9ff" stopOpacity="0.62" />
        <stop offset="0.7" stopColor="#cfe9ff" stopOpacity="0.14" />
        <stop offset="1" stopColor="#cfe9ff" stopOpacity="0" />
      </linearGradient>
      <pattern id="p-filet" width="12" height="12" patternUnits="userSpaceOnUse">
        <path d="M0 0 H12 M0 0 V12" stroke="#1d1a1f" strokeWidth="1.3" />
      </pattern>

      {/* ─── Lumières (les halos, eux, sont des dégradés CSS) ─────── */}
      <radialGradient id="g-lanterne" cx="0.42" cy="0.4" r="0.62">
        <stop offset="0" stopColor="#fff6dc" />
        <stop offset="0.45" stopColor="#ffd38c" />
        <stop offset="0.85" stopColor="#ff9c46" />
        <stop offset="1" stopColor="#ec742c" />
      </radialGradient>
      <radialGradient id="g-lanterne-eteinte" cx="0.42" cy="0.4" r="0.65">
        <stop offset="0" stopColor="#f7ecda" />
        <stop offset="1" stopColor="#dcc4a0" />
      </radialGradient>
      <linearGradient id="g-dome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff0c9" />
        <stop offset="0.55" stopColor="#ffc472" />
        <stop offset="1" stopColor="#ff9a45" />
      </linearGradient>
      <linearGradient id="g-flamme" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff7d6" />
        <stop offset="0.5" stopColor="#ffd06a" />
        <stop offset="1" stopColor="#ff8b2e" />
      </linearGradient>
      <radialGradient id="g-ecran-vignette" cx="0.5" cy="0.5" r="0.7">
        <stop offset="0.6" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>

      {/* ─── Découpes ─────────────────────────────────────────────── */}
      <clipPath id="c-vitre">
        <rect x="408" y="100" width="424" height="504" />
      </clipPath>
      <clipPath id="c-ecran">
        <rect x="1256" y="404" width="272" height="138" rx="4" />
      </clipPath>

      <path id="f-monstera" d={FEUILLE_MONSTERA} />
      <path id="f-pothos" d={FEUILLE_POTHOS} />
    </defs>
  );
}
