import { alea } from "./Defs";

/* ───────────────────────────────────────────────────────────────────────
   Les dessins qui ne bougent jamais. Ils ne sont pas rendus dans la page :
   `npm run salon` les transforme en images SVG (public/salon/), que le
   navigateur dessine une seule fois. Repère global : 1600 × 1000.
   ─────────────────────────────────────────────────────────────────────── */

/** La vitre de la fenêtre : un trou dans le mur, par où l'on voit le ciel */
export const VITRE = { x: 408, y: 100, w: 424, h: 504 };
const TROU = "M408 100 H832 V604 H408 Z";

/* ─── Dehors ───────────────────────────────────────────────────────── */

/** Fenêtres des immeubles d'en face (aussi utilisées par les lumières de nuit) */
export const FENETRES_VILLE: { x: number; y: number }[] = [];
for (let x = 388; x < 852; x += 17) {
  for (const y of [567, 585]) {
    if ([470, 560, 650, 720, 800].some((bord) => Math.abs(x - bord) < 7)) continue;
    FENETRES_VILLE.push({ x, y });
  }
}

const CHEMINEES: [number, number, number, number][] = [
  [420, 524, 8, 14],
  [438, 527, 6, 11],
  [522, 550, 8, 12],
  [600, 520, 8, 12],
  [613, 523, 6, 9],
  [752, 514, 10, 12],
  [770, 517, 6, 9],
  [830, 538, 8, 12],
];

export const TOUR_EIFFEL =
  "M498 517 Q512 470 515 430 L517 400 L519 391 L521 391 L523 400 L525 430 Q528 470 542 517 H534 Q524 492 520 490 Q516 492 506 517 Z";

export function Toits({ loin, pres, fenetres, opaciteFenetres }: { loin: string; pres: string; fenetres: string; opaciteFenetres: number }) {
  return (
    <>
      <path
        fill={loin}
        d="M380 612 V520 H410 V505 H440 V515 H470 V498 H492 V512 H560 V500 H590 V490 H606 V506 H630 V488 Q660 450 690 488 V506 H720 V494 H752 V470 H762 L770 420 L778 470 H788 V500 H820 V492 H860 V612 Z"
      />
      <path fill={loin} d={TOUR_EIFFEL} />
      <rect fill={loin} x="507" y="467" width="26" height="3" />
      <rect fill={loin} x="511" y="438" width="18" height="2.5" />
      <rect fill={loin} x="519.3" y="380" width="1.4" height="12" />
      <circle fill={loin} cx="660" cy="452" r="3" />
      <path
        fill={pres}
        d="M380 612 V556 L392 538 H458 L470 556 V562 H560 V546 L572 532 H638 L650 546 V552 H720 V540 L732 526 H788 L800 540 V550 H860 V612 Z"
      />
      {CHEMINEES.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} fill={pres} x={x} y={y} width={w} height={h} />
      ))}
      <g fill={fenetres} opacity={opaciteFenetres}>
        {FENETRES_VILLE.map((f) => (
          <rect key={`${f.x}-${f.y}`} x={f.x} y={f.y} width="8" height="11" rx="1" />
        ))}
      </g>
    </>
  );
}

export function CielDeJour() {
  return (
    <>
      <rect x="370" y="60" width="500" height="580" fill="url(#g-ciel-jour)" />
      <circle cx="708" cy="486" r="210" fill="url(#g-soleil)" />
      <circle cx="708" cy="486" r="27" fill="#fff1c9" />
      <Toits loin="#c9918b" pres="#9a6460" fenetres="#ffd9a0" opaciteFenetres={0.45} />
    </>
  );
}

export function CielDeNuit() {
  return (
    <>
      <rect x="370" y="60" width="500" height="580" fill="url(#g-ciel-nuit)" />
      <Toits loin="#2d3152" pres="#1a1d33" fenetres="#252846" opaciteFenetres={1} />
    </>
  );
}

export function Nuages({ couleur, clair }: { couleur: string; clair: string }) {
  return (
    <>
      <path
        fill={couleur}
        opacity="0.85"
        d="M440 178 C452 166 474 164 490 170 C500 160 524 158 538 168 C556 162 580 166 592 178 C560 185 470 187 440 178 Z"
      />
      <path
        fill={clair}
        opacity="0.8"
        d="M612 262 C626 248 652 246 668 254 C680 242 712 240 728 252 C748 246 776 252 790 264 C740 272 650 272 612 262 Z"
      />
      <ellipse fill={couleur} cx="600" cy="336" rx="190" ry="5" opacity="0.5" />
      <path
        fill={couleur}
        opacity="0.6"
        d="M690 140 C702 130 724 128 740 134 C754 126 780 128 794 138 C770 145 716 146 690 140 Z"
      />
      <ellipse fill={clair} cx="520" cy="392" rx="120" ry="4" opacity="0.55" />
    </>
  );
}

/* ─── Le fond de la pièce : mur, embrasure, parquet, tapis ────────── */

const FUITE = { x: 800, y: 300 };
export const JOINTS = Array.from({ length: 24 }, (_, i) => {
  const xBas = -760 + i * 140;
  const k = (694 - FUITE.y) / (1040 - FUITE.y);
  return `M${xBas} 1040 L${(FUITE.x + (xBas - FUITE.x) * k).toFixed(1)} 694`;
}).join(" ");
const BOUTS: [number, number, number][] = [
  [180, 760, 40],
  [620, 720, 30],
  [1010, 735, 34],
  [1430, 760, 44],
  [1520, 880, 60],
  [880, 960, 70],
];
const TAPIS = "M360 760 L1480 760 L1700 1044 L110 1044 Z";

export function Fond() {
  return (
    <>
      {/* mur et plafond, percés à l'endroit de la vitre */}
      <path fillRule="evenodd" d={`M-40 40 H1640 V700 H-40 Z ${TROU}`} fill="url(#g-mur)" />
      <rect x="-40" y="-40" width="1680" height="88" fill="#ece0cc" />
      <rect x="-40" y="46" width="1680" height="16" fill="#dfcaa9" />
      <path fillRule="evenodd" d={`M-40 62 H1640 V110 H-40 Z ${TROU}`} fill="url(#g-ombre-poutre)" />
      <rect x="-40" y="680" width="1680" height="16" fill="#f1e6d4" />
      <rect x="-40" y="695" width="1680" height="3" fill="#a98660" opacity="0.6" />

      {/* embrasure de la fenêtre */}
      <path fillRule="evenodd" d={`M390 84 H850 V618 H390 Z ${TROU}`} fill="#d6bb95" />
      <path fillRule="evenodd" d={`M396 90 H844 V612 H396 Z ${TROU}`} fill="#cdb089" />

      {/* garde-corps du balcon, reflets sur la vitre */}
      <g fill="#211d1a">
        <rect x="408" y="565" width="424" height="4" />
        <rect x="408" y="597" width="424" height="3" />
        {Array.from({ length: 36 }, (_, i) => (
          <rect key={i} x={412 + i * 12} y="569" width="2" height="30" />
        ))}
      </g>
      <path d="M440 100 L520 100 L420 300 L408 300 Z" fill="#fff" opacity="0.07" />
      <path d="M650 236 L690 236 L630 360 L612 360 Z" fill="#fff" opacity="0.06" />

      {/* parquet */}
      <rect x="-40" y="694" width="1680" height="350" fill="url(#g-sol)" />
      <path d={JOINTS} stroke="#3e2213" strokeWidth="1.6" opacity="0.4" />
      <g stroke="#3e2213" strokeWidth="1.4" opacity="0.35">
        {BOUTS.map(([x, y, l]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y} h${l}`} />
        ))}
      </g>

      {/* tapis berbère */}
      <path d={TAPIS} fill="#2c1d14" opacity="0.25" transform="translate(0 6)" />
      <path d={TAPIS} fill="#efe6d5" />
      <path d={TAPIS} fill="url(#p-laine)" />
      <path d={TAPIS} fill="url(#p-tapis)" opacity="0.5" />
      <path d={TAPIS} fill="none" stroke="#e2d4bb" strokeWidth="3" />
      <path
        d={Array.from({ length: 140 }, (_, i) => `M${364 + i * 8} 760 v-7`).join(" ")}
        stroke="#e8dcc6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  );
}

/** Huisseries, rebord, tringle et voilages (l'objet « fenêtre », et le masque de la vitre) */
export function Huisseries() {
  return (
    <>
      <g fill="#24201d">
        <rect x="400" y="92" width="440" height="10" />
        <rect x="400" y="602" width="440" height="10" />
        <rect x="400" y="92" width="10" height="520" />
        <rect x="830" y="92" width="10" height="520" />
        <rect x="400" y="232" width="440" height="8" />
        <rect x="616" y="232" width="8" height="380" />
        <rect x="547" y="92" width="6" height="146" />
        <rect x="687" y="92" width="6" height="146" />
        <rect x="604" y="410" width="5" height="26" rx="2" />
        <rect x="631" y="410" width="5" height="26" rx="2" />
      </g>
      <rect x="380" y="610" width="480" height="14" rx="2" fill="#efe4d2" />
      <rect x="380" y="622" width="480" height="8" fill="#b99a74" opacity="0.45" />
      <rect x="348" y="80" width="556" height="5" rx="2.5" fill="#2a2420" />
      <circle cx="348" cy="82.5" r="7" fill="#2a2420" />
      <circle cx="904" cy="82.5" r="7" fill="#2a2420" />
      <path d="M364 86 H442 C432 300 448 500 438 694 H348 C360 500 352 300 364 86 Z" fill="url(#g-rideau)" opacity="0.94" />
      <path d="M364 86 C356 300 362 500 348 694" fill="none" stroke="#d8c7ad" strokeWidth="2" opacity="0.6" />
      <path d="M804 86 H884 C890 300 880 500 902 694 H812 C804 500 818 300 804 86 Z" fill="url(#g-rideau)" opacity="0.94" />
      <path d="M884 86 C890 300 880 500 902 694" fill="none" stroke="#d8c7ad" strokeWidth="2" opacity="0.6" />
    </>
  );
}

/** Ce qui passe devant la vitre, en silhouette : sert à cacher la tour Eiffel,
    les étoiles et la lune derrière les feuilles, le fauteuil et les montants. */
export function MasqueVitre() {
  return (
    <>
      <filter id="f-silhouette" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
      </filter>
      <mask id="m-vitre" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000">
        <rect x={VITRE.x} y={VITRE.y} width={VITRE.w} height={VITRE.h} fill="#fff" />
        <g filter="url(#f-silhouette)">
          <Huisseries />
          <Monstera />
          <Fauteuil />
          <Gueridon />
        </g>
      </mask>
      <rect x={VITRE.x} y={VITRE.y} width={VITRE.w} height={VITRE.h} fill="#fff" mask="url(#m-vitre)" />
    </>
  );
}

/** Lumière du coucher de soleil (disparaît la nuit) */
export function LumiereDuSoir() {
  return (
    <>
      <path fillRule="evenodd" d={`M-40 40 H1640 V700 H-40 Z ${TROU}`} fill="url(#g-mur-chaud)" />
      <path d="M896 150 L1060 120 L1076 600 L904 650 Z" fill="url(#g-tache-soleil)" />
      <path d="M430 698 L812 698 L860 760 L420 760 Z" fill="#ffcf96" opacity="0.18" />
    </>
  );
}

/* ─── Plantes ──────────────────────────────────────────────────────── */

const VERTS = ["#2f5f30", "#3f7a3a", "#4f8c42", "#2a4f29", "#5a9a4a"];

export function FeuillePothos({ x, y, r, s, couleur }: { x: number; y: number; r: number; s: number; couleur: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <use href="#f-pothos" fill={couleur} />
      <path d="M0 2 V26" stroke="#9cc27f" strokeWidth="1" opacity="0.55" />
    </g>
  );
}

const LIANES: { d: string; de: [number, number]; a: [number, number] }[] = [
  { d: "M78 176 C68 230 48 290 58 372", de: [78, 176], a: [58, 372] },
  { d: "M100 188 C106 240 94 300 110 380", de: [100, 188], a: [110, 380] },
  { d: "M124 178 C142 222 152 262 148 320", de: [124, 178], a: [148, 320] },
  { d: "M90 184 C80 214 86 250 78 292", de: [90, 184], a: [78, 292] },
];
const hasardLianes = alea(3);
const FEUILLES_LIANES = LIANES.flatMap((l, li) =>
  Array.from({ length: 6 }, (_, k) => {
    const t = (k + 1) / 7;
    const ondule = Math.sin(t * Math.PI) * (li % 2 ? 10 : -14);
    return {
      x: l.de[0] + (l.a[0] - l.de[0]) * t + ondule,
      y: l.de[1] + (l.a[1] - l.de[1]) * t,
      r: (k % 2 ? 50 : -50) + hasardLianes() * 30 - 15,
      s: 0.7 + hasardLianes() * 0.35,
      c: VERTS[Math.floor(hasardLianes() * VERTS.length)],
    };
  }),
);

function PothosSuspendu() {
  return (
    <g>
      <g stroke="#eadfc8" strokeWidth="1.6" fill="none">
        <path d="M100 48 L70 152" />
        <path d="M100 48 L100 152" />
        <path d="M100 48 L130 152" />
      </g>
      <circle cx="100" cy="98" r="4" fill="#eadfc8" />
      <circle cx="100" cy="46" r="3" fill="#7a6a58" />
      <path d="M66 150 H134 L126 186 Q100 197 74 186 Z" fill="url(#g-terre-cuite)" />
      <rect x="64" y="146" width="72" height="8" rx="3" fill="#c97a50" />
      <g fill="none" stroke="#3d6a34" strokeWidth="2">
        {LIANES.map((l) => (
          <path key={l.d} d={l.d} />
        ))}
      </g>
      {FEUILLES_LIANES.map((f, i) => (
        <FeuillePothos key={i} x={f.x} y={f.y} r={f.r} s={f.s} couleur={f.c} />
      ))}
      <FeuillePothos x={74} y={150} r={-140} s={0.9} couleur="#3f7a3a" />
      <FeuillePothos x={100} y={146} r={180} s={1} couleur="#4f8c42" />
      <FeuillePothos x={126} y={150} r={140} s={0.85} couleur="#2f5f30" />
    </g>
  );
}

const MONSTERA: [number, number, number, number, string][] = [
  [240, 600, -78, 0.85, "#2a4f29"],
  [440, 612, 76, 0.85, "#2f5a2e"],
  [262, 520, -48, 1.15, "#2f5a2e"],
  [420, 530, 46, 1.1, "#2a4f29"],
  [300, 455, -18, 1.35, "#3a6b35"],
  [374, 450, 14, 1.3, "#2f5a2e"],
  [338, 524, 2, 1, "#4c8040"],
];

export function Monstera() {
  return (
    <g>
      <ellipse cx="336" cy="742" rx="56" ry="8" fill="#3a2214" opacity="0.3" />
      <g fill="none" stroke="#3e6b33" strokeWidth="3.5" strokeLinecap="round">
        {MONSTERA.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M336 646 Q${(336 + x) / 2} ${(646 + y) / 2 + 20} ${x} ${y}`} />
        ))}
      </g>
      {MONSTERA.map(([x, y, r, s, c]) => (
        <g key={`f-${x}-${y}`} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <use href="#f-monstera" fill={c} />
          <path d="M0 0 V-98" stroke="#6d9a58" strokeWidth="1.6" opacity="0.7" />
        </g>
      ))}
      <path d="M294 644 H378 L366 740 H306 Z" fill="url(#g-terre-cuite)" />
      <rect x="288" y="636" width="96" height="14" rx="4" fill="#c46e45" />
    </g>
  );
}

const hasardTuteur = alea(11);
const FEUILLES_TUTEUR = Array.from({ length: 13 }, (_, i) => {
  const cote = i % 2 ? 1 : -1;
  return {
    x: 922 + cote * (6 + hasardTuteur() * 8),
    y: 628 - i * 24,
    r: cote * (70 + hasardTuteur() * 40),
    s: 1.4 + hasardTuteur() * 0.9 - i * 0.03,
    c: VERTS[Math.floor(hasardTuteur() * VERTS.length)],
  };
});

export function PlanteTuteur() {
  return (
    <g>
      <ellipse cx="922" cy="722" rx="44" ry="7" fill="#3a2214" opacity="0.3" />
      <rect x="918" y="320" width="8" height="330" rx="3" fill="#6d5a3c" />
      {FEUILLES_TUTEUR.map((f, i) => (
        <FeuillePothos key={i} x={f.x} y={f.y} r={f.r} s={f.s} couleur={f.c} />
      ))}
      <path d="M888 644 H956 L950 704 Q922 726 894 704 Z" fill="url(#g-pot-blanc)" />
      <rect x="884" y="638" width="76" height="10" rx="4" fill="#f4efe6" />
    </g>
  );
}

/* ─── Fauteuil, guéridon rouge ─────────────────────────────────────── */

export function Fauteuil() {
  return (
    <g>
      <ellipse cx="578" cy="734" rx="132" ry="10" fill="#2c180c" opacity="0.3" />
      <g stroke="#1e1c1a" strokeWidth="4" strokeLinecap="round">
        <path d="M498 700 L488 734" />
        <path d="M660 700 L670 734" />
        <path d="M524 700 L520 722" />
        <path d="M636 700 L640 722" />
      </g>
      <path
        d="M482 700 C474 640 476 590 492 566 C506 548 540 544 578 544 C616 544 650 548 664 566 C680 590 682 640 674 700 Z"
        fill="url(#g-velours)"
      />
      <g fill="none" strokeLinecap="round">
        <path d="M486 598 C520 588 636 588 670 598" stroke="#2f3b1a" strokeWidth="3" opacity="0.55" />
        <path d="M488 592 C522 582 634 582 668 592" stroke="#8a9a5c" strokeWidth="2" opacity="0.45" />
        <path d="M484 636 C520 626 636 626 672 636" stroke="#2f3b1a" strokeWidth="3" opacity="0.5" />
        <path d="M486 630 C522 620 634 620 670 630" stroke="#8a9a5c" strokeWidth="2" opacity="0.35" />
        <path d="M500 558 C530 550 626 550 656 558" stroke="#94a465" strokeWidth="3" opacity="0.5" />
      </g>
      <ellipse cx="486" cy="646" rx="22" ry="46" fill="#4f6031" />
      <ellipse cx="670" cy="646" rx="22" ry="46" fill="#4a5b2e" />
      <path
        d="M468 676 C468 650 486 642 510 642 H646 C670 642 688 650 688 676 C688 700 670 708 646 708 H510 C486 708 468 700 468 676 Z"
        fill="#4a5a2d"
      />
      <path d="M480 652 C500 646 656 646 676 652" fill="none" stroke="#8a9a5c" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
      <g transform="rotate(-8 580 614)">
        <rect x="546" y="580" width="68" height="66" rx="16" fill="url(#p-damier)" />
        <rect x="546" y="580" width="68" height="66" rx="16" fill="none" stroke="#1f1b18" strokeWidth="1.5" opacity="0.4" />
        <path d="M552 588 C570 600 590 600 608 588" fill="none" stroke="#fff" strokeWidth="2" opacity="0.25" />
      </g>
    </g>
  );
}

export function Gueridon() {
  return (
    <g>
      <ellipse cx="735" cy="716" rx="30" ry="5" fill="#2c180c" opacity="0.3" />
      <rect x="730" y="644" width="10" height="70" fill="#c04523" />
      <ellipse cx="735" cy="714" rx="22" ry="5" fill="#b33e1f" />
      <rect x="701" y="636" width="68" height="9" fill="#b8401f" />
      <ellipse cx="735" cy="636" rx="34" ry="8" fill="#d8552f" />
      <path d="M721 608 H749 L746 636 H724 Z" fill="url(#g-pot-blanc)" />
      <g fill="none" stroke="#4d7a3a" strokeWidth="1.5">
        <path d="M735 608 L716 584" />
        <path d="M735 608 L735 576" />
        <path d="M735 608 L756 588" />
        <path d="M735 608 L724 592" />
        <path d="M735 608 L748 598" />
      </g>
      <g fill="#5a9a48">
        <circle cx="716" cy="582" r="8" />
        <circle cx="735" cy="574" r="9" fill="#4f8c42" />
        <circle cx="757" cy="586" r="8" />
        <circle cx="723" cy="592" r="6" fill="#6aa955" />
        <circle cx="749" cy="598" r="6" fill="#6aa955" />
      </g>
    </g>
  );
}

/* ─── Meuble télé (sans la télé ni la lampe, qui se touchent) ─────── */

const hasardDisques = alea(23);
const COULEURS_DOS = ["#c2562f", "#2f4a3a", "#e3b25a", "#3a281d", "#a99bc4", "#d98a6a", "#59623a", "#efe3cf", "#8a5530"];
const DISQUES: { x: number; w: number; h: number; c: string }[] = [];
for (let x = 1106; x < 1292; ) {
  const w = 4 + Math.floor(hasardDisques() * 4);
  DISQUES.push({ x, w, h: 70 + Math.floor(hasardDisques() * 14), c: COULEURS_DOS[Math.floor(hasardDisques() * COULEURS_DOS.length)] });
  x += w + 1;
}
const LIVRES: { x: number; w: number; h: number; c: string }[] = [];
for (let x = 1480; x < 1580; ) {
  const w = 9 + Math.floor(hasardDisques() * 8);
  LIVRES.push({ x, w, h: 54 + Math.floor(hasardDisques() * 26), c: COULEURS_DOS[Math.floor(hasardDisques() * COULEURS_DOS.length)] });
  x += w + 1;
}

function MeubleTele() {
  return (
    <g>
      <ellipse cx="1370" cy="716" rx="320" ry="11" fill="#2c180c" opacity="0.32" />
      <g fill="#3e2414">
        <path d="M1108 676 L1102 716 H1110 L1122 676 Z" />
        <path d="M1622 676 L1630 716 H1638 L1636 676 Z" />
        <path d="M1300 676 L1298 706 H1304 L1310 676 Z" />
      </g>
      <rect x="1086" y="566" width="580" height="114" fill="url(#g-noyer)" />
      <rect x="1078" y="556" width="590" height="12" rx="2" fill="#9a6238" />
      <rect x="1078" y="556" width="590" height="3" fill="#b87c4c" />
      <rect x="1100" y="580" width="200" height="88" rx="2" fill="#2e1a0e" />
      {DISQUES.map((d) => (
        <rect key={d.x} x={d.x} y={666 - d.h} width={d.w} height={d.h} fill={d.c} />
      ))}
      <rect x="1100" y="580" width="200" height="88" rx="2" fill="none" stroke="#4a2c18" strokeWidth="2" />
      <rect x="1312" y="578" width="152" height="92" rx="2" fill="#b4875a" />
      <rect x="1312" y="578" width="152" height="92" rx="2" fill="url(#p-cannage)" />
      <rect x="1312" y="578" width="152" height="92" rx="2" fill="none" stroke="#5c3519" strokeWidth="4" />
      <rect x="1446" y="614" width="4" height="20" rx="2" fill="#2a1a10" />
      <rect x="1474" y="580" width="200" height="88" rx="2" fill="#2e1a0e" />
      {LIVRES.map((l) => (
        <rect key={l.x} x={l.x} y={666 - l.h} width={l.w} height={l.h} rx="1" fill={l.c} />
      ))}
      {/* pile de livres et bougie en pot */}
      <rect x="1196" y="544" width="44" height="12" rx="1" fill="#2f4a3a" />
      <rect x="1200" y="534" width="38" height="10" rx="1" fill="#d8c39b" />
      <rect x="1176" y="530" width="18" height="26" rx="3" fill="#fff4e4" opacity="0.4" />
      <rect x="1178" y="540" width="14" height="14" rx="2" fill="#f3e6d2" />
      <path d="M1185 540 v-4" stroke="#3a281d" strokeWidth="1.2" />
      {/* pothos qui retombe au bout du meuble */}
      <path d="M1550 524 H1594 L1588 556 H1556 Z" fill="url(#g-pot-blanc)" />
      <path d="M1556 528 C1548 570 1560 610 1552 650" fill="none" stroke="#3d6a34" strokeWidth="2" />
      {[
        [1554, 560, 30],
        [1550, 590, -30],
        [1556, 620, 25],
        [1552, 646, -10],
      ].map(([x, y, r]) => (
        <FeuillePothos key={y} x={x} y={y} r={r} s={0.8} couleur="#3f7a3a" />
      ))}
      <FeuillePothos x={1560} y={522} r={-150} s={0.9} couleur="#2f5f30" />
      <FeuillePothos x={1574} y={518} r={170} s={1} couleur="#4f8c42" />
      <FeuillePothos x={1588} y={522} r={140} s={0.85} couleur="#3f7a3a" />
    </g>
  );
}

/* ─── Le meuble à vinyles (la platine, elle, se touche) ───────────── */

const POCHETTES = [
  { x: 972, c: "#c2562f", r: -4 },
  { x: 986, c: "#e3b25a", r: -2 },
  { x: 998, c: "#2f4a3a", r: 3 },
  { x: 1024, c: "#a99bc4", r: -3 },
  { x: 1038, c: "#efe3cf", r: 2 },
  { x: 1052, c: "#59623a", r: 5 },
];

function MeubleVinyles() {
  return (
    <g>
      <ellipse cx="1018" cy="714" rx="66" ry="7" fill="#2c180c" opacity="0.32" />
      <g fill="#3e2414">
        <path d="M966 688 L961 714 H968 L974 688 Z" />
        <path d="M1064 688 L1070 714 H1077 L1072 688 Z" />
      </g>
      <rect x="962" y="594" width="112" height="96" rx="2" fill="url(#g-noyer)" />
      <rect x="957" y="586" width="122" height="10" rx="2" fill="#9a6238" />
      <rect x="957" y="586" width="122" height="2.5" fill="#b87c4c" />
      <rect x="968" y="602" width="48" height="80" rx="2" fill="#2e1a0e" />
      <rect x="1020" y="602" width="48" height="80" rx="2" fill="#2e1a0e" />
      {POCHETTES.map((p) => (
        <g key={p.x} transform={`rotate(${p.r} ${p.x + 7} 680)`}>
          <rect x={p.x} y="612" width="14" height="68" rx="1" fill={p.c} />
          <rect x={p.x} y="612" width="14" height="68" rx="1" fill="none" stroke="#1c140f" strokeWidth="0.8" opacity="0.4" />
        </g>
      ))}
    </g>
  );
}

/* ─── Table basse en verre (sans la lettre ni les bougies) ────────── */

function TableBasse() {
  return (
    <g>
      <path d="M880 900 L1360 900 L1330 870 L910 870 Z" fill="#2c180c" opacity="0.22" />
      <g stroke="#cfc8bf" strokeWidth="3.2" strokeLinecap="round">
        <path d="M910 772 V868" />
        <path d="M1322 772 V868" />
      </g>
      <path d="M912 850 L1320 850 L1360 886 L872 886 Z" fill="url(#g-verre)" stroke="#d8d1c8" strokeWidth="2" />
      <rect x="985" y="868" width="120" height="10" rx="1" fill="#59623a" />
      <rect x="992" y="858" width="104" height="10" rx="1" fill="#e3b25a" />
      <rect x="1150" y="866" width="90" height="12" rx="1" fill="#c2562f" />
      <g stroke="#e3ddd5" strokeWidth="3.2" strokeLinecap="round">
        <path d="M870 816 V900" />
        <path d="M1362 816 V900" />
      </g>
      <path d="M906 770 L1326 770 L1366 812 L866 812 Z" fill="url(#g-verre)" />
      <path d="M866 812 L1366 812 L1366 818 L866 818 Z" fill="#a9c6c1" opacity="0.55" />
      <path d="M906 770 L1326 770 L1366 812 L866 812 Z" fill="none" stroke="#f4efe7" strokeWidth="3" />
      <path d="M866 818 L1366 818" stroke="#8e8a84" strokeWidth="1.5" opacity="0.6" />
      <path d="M930 806 L980 774 M1180 806 L1214 774" stroke="#fff" strokeWidth="2" opacity="0.45" />
      {/* mug */}
      <path d="M960 748 H996 V774 Q996 782 988 782 H968 Q960 782 960 774 Z" fill="#c8643c" />
      <ellipse cx="978" cy="748" rx="18" ry="4" fill="#9a4526" />
      <ellipse cx="978" cy="749" rx="15" ry="2.8" fill="#4a2a18" />
      <path d="M996 754 C1008 754 1008 770 996 770" fill="none" stroke="#c8643c" strokeWidth="4" />
      {/* pile de livres */}
      <rect x="1148" y="758" width="116" height="14" rx="1.5" fill="#2f4a3a" />
      <rect x="1152" y="761" width="6" height="8" fill="#e3b25a" />
      <rect x="1156" y="746" width="100" height="12" rx="1.5" fill="#d8c39b" />
      <rect x="1162" y="736" width="84" height="10" rx="1.5" fill="#9c3f2a" />
      <path d="M1162 741 h84" stroke="#f3e6cf" strokeWidth="1" opacity="0.5" />
    </g>
  );
}

/* ─── Noël : le sapin prend la place du ficus, les cadeaux au pied ─── */

/** Étages du sapin : sommet, base, demi-largeur */
const ETAGES_SAPIN = [
  { a: 336, b: 410, l: 34 },
  { a: 376, b: 468, l: 46 },
  { a: 426, b: 530, l: 57 },
  { a: 482, b: 594, l: 67 },
  { a: 540, b: 652, l: 76 },
];

const BOULES: [number, number, string][] = [
  [906, 400, "#c2562f"], [940, 396, "#e0a43c"],
  [896, 452, "#f6efe4"], [930, 458, "#a3431f"], [952, 444, "#e0a43c"],
  [880, 516, "#e0a43c"], [914, 506, "#c2562f"], [956, 520, "#f6efe4"],
  [872, 580, "#a3431f"], [906, 572, "#f6efe4"], [944, 584, "#e0a43c"], [978, 570, "#c2562f"],
  [866, 640, "#e0a43c"], [898, 630, "#c2562f"], [934, 644, "#f6efe4"], [968, 632, "#a3431f"],
];

export function Sapin() {
  return (
    <g>
      <ellipse cx="922" cy="722" rx="62" ry="8" fill="#3a2214" opacity="0.3" />
      <rect x="915" y="640" width="14" height="10" fill="#5b3a22" />
      {/* du plus large au plus petit : chaque étage recouvre le pied du suivant */}
      {[...ETAGES_SAPIN].reverse().map(({ a, b, l }) => {
        const pointe = `M922 ${a} C${922 - l * 0.25} ${a + (b - a) * 0.45} ${922 - l * 0.72} ${b - 14} ${922 - l} ${b}`;
        const bas = `Q${922 - l * 0.5} ${b + 9} 922 ${b + 4} Q${922 + l * 0.5} ${b + 9} ${922 + l} ${b}`;
        const retour = `C${922 + l * 0.72} ${b - 14} ${922 + l * 0.25} ${a + (b - a) * 0.45} 922 ${a} Z`;
        return (
          <g key={a}>
            <path d={`${pointe} ${bas} ${retour}`} fill="#2f5a3a" />
            {/* côté ombre, à droite */}
            <path d={`M922 ${a} L922 ${b + 4} Q${922 + l * 0.5} ${b + 9} ${922 + l} ${b} ${retour}`} fill="#234630" />
            {/* aiguilles éclairées au bord */}
            <path d={`M${922 - l * 0.9} ${b - 2} Q${922 - l * 0.5} ${b + 5} 922 ${b + 2}`} fill="none" stroke="#5c8c58" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          </g>
        );
      })}
      {BOULES.map(([x, y, c]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="5" fill={c} />
          <circle cx={x - 1.6} cy={y - 1.8} r="1.4" fill="#fff" opacity="0.65" />
        </g>
      ))}
      {/* l'étoile */}
      <path
        d="M922 314 L926.4 326 L939 326.4 L929 334 L932.6 346 L922 339 L911.4 346 L915 334 L905 326.4 L917.6 326 Z"
        fill="#f2c25a"
        stroke="#d99a2e"
        strokeWidth="1"
      />
      {/* le cache-pot blanc du ficus, gardé */}
      <path d="M888 644 H956 L950 704 Q922 726 894 704 Z" fill="url(#g-pot-blanc)" />
      <rect x="884" y="638" width="76" height="10" rx="4" fill="#f4efe6" />
    </g>
  );
}

function Cadeau({ x, y, w, h, fond, ruban }: { x: number; y: number; w: number; h: number; fond: string; ruban: string }) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={fond} />
      <rect x={x} y={y} width={w} height="5" rx="2" fill="#000" opacity="0.12" />
      <rect x={cx - 3} y={y} width="6" height={h} fill={ruban} />
      <rect x={x} y={y + h * 0.42} width={w} height="5" fill={ruban} opacity="0.9" />
      <path d={`M${cx} ${y} C${cx - 14} ${y - 12} ${cx - 16} ${y + 2} ${cx} ${y} C${cx + 16} ${y + 2} ${cx + 14} ${y - 12} ${cx} ${y} Z`} fill={ruban} />
      <rect x={x + w - 6} y={y} width="6" height={h} rx="2" fill="#000" opacity="0.14" />
    </g>
  );
}

function Cadeaux() {
  return (
    <g>
      <ellipse cx="920" cy="728" rx="96" ry="7" fill="#2c180c" opacity="0.28" />
      <Cadeau x={836} y={686} w={44} h={38} fond="#b8401f" ruban="#f2d79b" />
      <Cadeau x={866} y={704} w={30} h={22} fond="#59623a" ruban="#e0a43c" />
      <Cadeau x={960} y={696} w={38} h={30} fond="#efe3cf" ruban="#c2562f" />
    </g>
  );
}

export function Meubles({ noel = false }: { noel?: boolean }) {
  return (
    <>
      <PothosSuspendu />
      <Monstera />
      {noel ? <Sapin /> : <PlanteTuteur />}
      <Fauteuil />
      <Gueridon />
      <MeubleVinyles />
      {noel && <Cadeaux />}
      <MeubleTele />
      <TableBasse />
    </>
  );
}

/* ─── Premier plan : canapé bouclé et guéridon orange ─────────────── */

function Bouclette({ d, fill }: { d: string; fill: string }) {
  return (
    <>
      <path d={d} fill={fill} />
      <path d={d} fill="url(#p-boucle)" />
    </>
  );
}

function Canape() {
  return (
    <g>
      <path d="M410 760 C500 820 680 950 840 1060 L930 1060 C760 940 560 806 440 748 Z" fill="#2c180c" opacity="0.2" />
      <Bouclette d="M-80 1060 L-80 700 C-50 676 40 660 120 664 C60 800 0 930 -40 1060 Z" fill="#f7efe3" />
      <Bouclette d="M120 664 C150 668 172 686 172 710 L150 790 C120 880 92 960 82 1060 L-40 1060 C0 930 60 800 120 664 Z" fill="#dfcdb1" />
      <path d="M-60 690 C-20 672 50 662 118 666 C70 790 20 910 -24 1060" fill="none" stroke="#fffaf2" strokeWidth="7" opacity="0.75" strokeLinecap="round" />
      <Bouclette d="M150 716 C150 686 196 670 262 670 C332 670 392 674 410 696 C418 706 418 714 412 720 Z" fill="#f6eee2" />
      <Bouclette d="M150 716 L412 720 C416 736 404 748 386 752 C330 758 226 756 172 752 C156 748 148 734 150 716 Z" fill="#e2d1b6" />
      <path d="M168 686 C220 674 330 674 396 688" fill="none" stroke="#fffaf2" strokeWidth="5" opacity="0.7" strokeLinecap="round" />
      <Bouclette
        d="M168 750 C230 756 340 758 398 750 C470 802 640 930 800 1060 L84 1060 C96 960 124 860 152 790 C158 772 162 760 168 750 Z"
        fill="#efe4d1"
      />
      <g fill="#fffaf2" opacity="0.22">
        <ellipse cx="330" cy="804" rx="100" ry="20" />
        <ellipse cx="400" cy="916" rx="140" ry="26" />
      </g>
      <Bouclette d="M398 750 C470 802 640 930 800 1060 L852 1060 C680 930 500 814 420 770 C410 762 404 756 398 750 Z" fill="#cdb899" />
      <path d="M152 760 C122 860 98 960 86 1060 L140 1060 C150 960 170 870 196 770 Z" fill="#8c6c48" opacity="0.2" />
      <path d="M170 752 C250 760 340 760 396 752 L410 770 C340 778 240 778 170 772 Z" fill="#8c6c48" opacity="0.18" />
      <g fill="none" strokeLinecap="round">
        <path d="M138 862 C260 874 440 876 545 862" stroke="#c4ad8b" strokeWidth="3.5" />
        <path d="M140 869 C260 881 440 883 545 869" stroke="#fffaf1" strokeWidth="2" opacity="0.8" />
        <path d="M108 972 C300 988 520 988 687 972" stroke="#c4ad8b" strokeWidth="3.5" />
        <path d="M110 979 C300 995 520 995 687 979" stroke="#fffaf1" strokeWidth="2" opacity="0.8" />
      </g>
      <g transform="rotate(-12 152 792)">
        <path d="M98 742 C130 728 176 730 206 744 C218 780 214 822 202 852 C168 864 128 862 100 848 C88 812 88 774 98 742 Z" fill="#5d6634" />
        <path d="M108 752 C134 742 170 744 196 754" fill="none" stroke="#8a9560" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
        <path d="M150 760 C152 790 152 820 148 846" fill="none" stroke="#454d26" strokeWidth="2" opacity="0.5" />
      </g>
      <g transform="rotate(-8 112 920)">
        <path d="M44 862 C90 846 150 848 186 866 C196 906 192 950 180 984 C140 996 92 994 56 980 C42 940 38 898 44 862 Z" fill="#c0582f" />
        <path d="M56 872 C92 860 140 862 174 874" fill="none" stroke="#e08a5e" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
        <circle cx="114" cy="922" r="4" fill="#8f3c1c" opacity="0.7" />
      </g>
      <path d="M330 1060 C334 1010 344 966 372 940 C450 930 566 936 664 970 C700 1000 728 1032 744 1060 Z" fill="#5b6537" />
      <path d="M330 1060 C334 1010 344 966 372 940 C450 930 566 936 664 970 C700 1000 728 1032 744 1060 Z" fill="url(#p-tricot)" />
      <path d="M392 954 C460 970 552 1000 610 1060" fill="none" stroke="#454e28" strokeWidth="4" opacity="0.5" />
      <path d="M376 944 C452 936 560 942 656 972" fill="none" stroke="#818c58" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
      <g stroke="#4b5530" strokeWidth="3" strokeLinecap="round">
        {Array.from({ length: 9 }, (_, i) => {
          const t = i / 8;
          return <path key={i} d={`M${664 + 80 * t} ${970 + 90 * t} l12 16`} />;
        })}
      </g>
    </g>
  );
}

function GueridonOrange() {
  return (
    <g>
      <ellipse cx="790" cy="1052" rx="112" ry="14" fill="#2c180c" opacity="0.3" />
      <rect x="698" y="976" width="164" height="90" rx="24" fill="url(#g-orange)" />
      <ellipse cx="780" cy="972" rx="80" ry="9" fill="#7f2e12" opacity="0.6" />
      <rect x="692" y="906" width="176" height="64" rx="26" fill="url(#g-orange)" />
      <ellipse cx="780" cy="903" rx="86" ry="9" fill="#7f2e12" opacity="0.55" />
      <rect x="688" y="842" width="184" height="58" rx="26" fill="url(#g-orange)" />
      <ellipse cx="780" cy="842" rx="92" ry="15" fill="#e47445" />
      <ellipse cx="780" cy="842" rx="80" ry="11" fill="none" stroke="#f08c5c" strokeWidth="2" opacity="0.6" />
      <path d="M734 832 L820 826 L830 838 L742 844 Z" fill="#2e3c58" />
      <path d="M742 844 L830 838 L830 842 L742 848 Z" fill="#efe6d6" />
      <ellipse cx="848" cy="842" rx="15" ry="4" fill="#c9643a" />
      <ellipse cx="848" cy="840" rx="11" ry="2.5" fill="#a84d28" />
      {/* pothos qui retombe sur le côté */}
      <path d="M836 808 H872 L868 842 H840 Z" fill="url(#g-pot-blanc)" />
      <path d="M866 836 C884 880 880 940 872 1004" fill="none" stroke="#3d6a34" strokeWidth="2" />
      {[
        [874, 870, -40],
        [882, 906, 30],
        [878, 944, -30],
        [874, 984, 20],
      ].map(([x, y, r]) => (
        <g key={y} transform={`translate(${x} ${y}) rotate(${r}) scale(0.85)`}>
          <use href="#f-pothos" fill="#3f7a3a" />
        </g>
      ))}
      <g transform="translate(842 806) rotate(-140) scale(0.9)">
        <use href="#f-pothos" fill="#2f5f30" />
      </g>
      <g transform="translate(856 802) rotate(175)">
        <use href="#f-pothos" fill="#4f8c42" />
      </g>
      <g transform="translate(868 806) rotate(130) scale(0.8)">
        <use href="#f-pothos" fill="#3f7a3a" />
      </g>
    </g>
  );
}

export function PremierPlan() {
  return (
    <>
      <Canape />
      <GueridonOrange />
    </>
  );
}
