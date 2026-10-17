import { alea } from "./Defs";

/* ───────────────────────────────────────────────────────────────────────
   Le gymnase, à gauche du salon : le décor fixe (rendu en images par
   `npm run salon`). Aux couleurs d'Efrei Volley (le logo du club) :
   bleu ciel, bleu glacier, marine, nuit, blanc. Mode supporters : fanions,
   écharpes sur les gradins, drapeaux, projecteurs pour les matchs du soir.
   Vu depuis la ligne de fond : le terrain fuit vers (800, 300).
   ─────────────────────────────────────────────────────────────────────── */

export const CLUB = {
  ciel: "#5cbcf2",
  glacier: "#d6f0ff",
  marine: "#1f2a5c",
  nuit: "#0b0f24",
  blanc: "#f4f8fb",
};

/** Les hautes fenêtres (trous dans le mur, le ciel est derrière) */
export const FENETRES_GYM = [140, 420, 700, 980, 1260].map((x) => ({ x, y: 130, w: 200, h: 100 }));
const TROUS = FENETRES_GYM.map((f) => `M${f.x} ${f.y} H${f.x + f.w} V${f.y + f.h} H${f.x} Z`).join(" ");

/** Les projecteurs de la charpente (allumés la nuit) ; angle > 0 : visent vers la droite */
export const PROJECTEURS = [
  { x: 270, angle: 24 },
  { x: 800, angle: 0 },
  { x: 1330, angle: -24 },
];

/** Bord du terrain à la profondeur y (lignes de côté qui fuient vers 800, 300) */
export function bordTerrain(y: number) {
  const d = (640 * (y - 300)) / 700;
  return { gauche: 800 - d, droite: 800 + d };
}

function ligneTerrain(y: number) {
  const { gauche, droite } = bordTerrain(y);
  return `M${gauche.toFixed(1)} ${y} L${droite.toFixed(1)} ${y}`;
}

const FUITE = { x: 800, y: 300 };
const LAMES = Array.from({ length: 26 }, (_, i) => {
  const xBas = -900 + i * 130;
  const k = (694 - FUITE.y) / (1040 - FUITE.y);
  return `M${xBas} 1040 L${(FUITE.x + (xBas - FUITE.x) * k).toFixed(1)} 694`;
}).join(" ");

/* ─── Le ciel derrière les hautes fenêtres ───────────────────────── */

const hasard = alea(5);
const ETOILES_GYM = Array.from({ length: 40 }, () => ({ x: 140 + hasard() * 1320, y: 134 + hasard() * 90, r: 0.6 + hasard() * 1.2 }));

export function CielGymnase({ nuit }: { nuit: boolean }) {
  return (
    <>
      <rect x="0" y="110" width="1600" height="140" fill={nuit ? "url(#g-ciel-gym-nuit)" : "url(#g-ciel-gym)"} />
      {nuit ? (
        <g fill="#fff8e6">
          {ETOILES_GYM.map((e, i) => (
            <circle key={i} cx={e.x} cy={e.y} r={e.r} opacity={0.5 + (i % 3) * 0.2} />
          ))}
        </g>
      ) : (
        <g fill="#fbd3ad" opacity="0.7">
          <ellipse cx="300" cy="170" rx="120" ry="5" />
          <ellipse cx="900" cy="150" rx="160" ry="6" />
          <ellipse cx="1350" cy="190" rx="110" ry="4" />
        </g>
      )}
    </>
  );
}

/* ─── Les supporters : écharpes, drapeaux ────────────────────────── */

/** Une écharpe rayée qui pend du banc, avec ses franges */
function Echarpe({ x, y, longueur, penche = 0 }: { x: number; y: number; longueur: number; penche?: number }) {
  const bandes = [CLUB.marine, CLUB.ciel, CLUB.blanc, CLUB.ciel];
  const h = longueur / 8;
  return (
    <g transform={`rotate(${penche} ${x} ${y})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={x - 13} y={y + i * h} width="26" height={h + 0.5} fill={bandes[i % bandes.length]} />
      ))}
      <rect x={x - 13} y={y} width="26" height={longueur} fill="none" stroke={CLUB.nuit} strokeWidth="1" opacity="0.3" />
      <path d={Array.from({ length: 6 }, (_, i) => `M${x - 11 + i * 4.4} ${y + longueur} v9`).join(" ")} stroke={CLUB.ciel} strokeWidth="1.6" />
    </g>
  );
}

function Drapeau({ x, y, couleur, bord }: { x: number; y: number; couleur: string; bord: string }) {
  return (
    <g>
      <path d={`M${x} ${y} V${y - 74}`} stroke="#6a4b36" strokeWidth="2.5" />
      <path d={`M${x} ${y - 74} L${x + 46} ${y - 62} L${x} ${y - 48} Z`} fill={couleur} />
      <path d={`M${x} ${y - 74} L${x + 46} ${y - 62}`} stroke={bord} strokeWidth="3" />
    </g>
  );
}

function Gradins() {
  return (
    <g>
      <ellipse cx="190" cy="742" rx="190" ry="12" fill="#2c180c" opacity="0.25" />
      {/* trois rangs de bancs en bois, contre le mur */}
      <rect x="20" y="540" width="250" height="16" rx="3" fill="#b07a45" />
      <rect x="20" y="556" width="250" height="60" fill="#8a5530" />
      <rect x="20" y="604" width="290" height="16" rx="3" fill="#c08a52" />
      <rect x="20" y="620" width="290" height="60" fill="#8f5a32" />
      <rect x="20" y="668" width="330" height="16" rx="3" fill="#c99560" />
      <rect x="20" y="684" width="330" height="56" fill="#94603a" />
      <g stroke="#6e4224" strokeWidth="2" opacity="0.6">
        <path d="M20 556 H270 M20 620 H310 M20 684 H350" />
      </g>
      {/* drapeaux plantés dans les gradins */}
      <Drapeau x={40} y={540} couleur={CLUB.ciel} bord={CLUB.marine} />
      <Drapeau x={236} y={540} couleur={CLUB.marine} bord={CLUB.ciel} />
      {/* sac du club, gourde, serviette */}
      <path d="M120 604 C116 580 126 572 160 572 H214 C246 572 254 580 250 604 Z" fill={CLUB.marine} />
      <path d="M150 574 C152 556 214 556 216 574" fill="none" stroke={CLUB.nuit} strokeWidth="4" />
      <rect x="132" y="584" width="104" height="5" fill={CLUB.ciel} />
      <rect x="268" y="582" width="16" height="38" rx="5" fill={CLUB.ciel} />
      <rect x="270" y="576" width="12" height="8" rx="2" fill={CLUB.nuit} />
      <path d="M60 668 C60 650 104 646 112 668 L116 712 C102 716 72 716 62 712 Z" fill={CLUB.blanc} />
      <path d="M66 690 H112" stroke={CLUB.ciel} strokeWidth="3" />
      {/* écharpes de supporters qui pendent des bancs */}
      <Echarpe x={92} y={556} longueur={78} penche={4} />
      <Echarpe x={196} y={620} longueur={70} penche={-3} />
      <Echarpe x={300} y={684} longueur={62} penche={5} />
    </g>
  );
}

/** Un ballon aux couleurs du club : blanc, bandes bleu ciel et marine */
export function Ballon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={CLUB.blanc} />
      <path
        d={`M${cx - r} ${cy} C${cx - r * 0.4} ${cy - r * 0.9} ${cx + r * 0.5} ${cy - r * 0.9} ${cx + r * 0.95} ${cy - r * 0.3}`}
        fill="none"
        stroke={CLUB.ciel}
        strokeWidth={r * 0.32}
      />
      <path
        d={`M${cx - r * 0.5} ${cy + r * 0.85} C${cx - r * 0.2} ${cy + r * 0.1} ${cx + r * 0.4} ${cy - r * 0.2} ${cx + r * 0.9} ${cy + r * 0.4}`}
        fill="none"
        stroke={CLUB.marine}
        strokeWidth={r * 0.3}
      />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={CLUB.nuit} strokeWidth={r * 0.06} opacity="0.6" />
      <circle cx={cx - r * 0.35} cy={cy - r * 0.4} r={r * 0.22} fill="#fff" opacity="0.5" />
    </g>
  );
}

function ChariotBallons() {
  return (
    <g>
      <ellipse cx="1400" cy="796" rx="96" ry="9" fill="#2c180c" opacity="0.3" />
      <Ballon cx={1350} cy={676} r={22} />
      <Ballon cx={1396} cy={672} r={22} />
      <Ballon cx={1442} cy={680} r={22} />
      <Ballon cx={1372} cy={640} r={22} />
      <Ballon cx={1420} cy={638} r={22} />
      <g stroke={CLUB.nuit} strokeWidth="3" fill="none">
        <path d="M1318 690 H1474 L1466 768 H1326 Z" />
        <path d="M1318 720 H1470 M1322 745 H1468 M1360 690 V768 M1400 690 V768 M1440 690 V768" strokeWidth="1.6" />
      </g>
      {[1334, 1458].map((x) => (
        <g key={x}>
          <path d={`M${x} 768 V786`} stroke={CLUB.nuit} strokeWidth="3" />
          <circle cx={x} cy="790" r="6" fill={CLUB.nuit} />
        </g>
      ))}
    </g>
  );
}

function Suspension({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 46 V112`} stroke="#2a2420" strokeWidth="2" />
      <path d={`M${x - 34} 140 Q${x - 30} 112 ${x} 112 Q${x + 30} 112 ${x + 34} 140 Z`} fill="#3a3330" />
    </g>
  );
}

/** Un projecteur de match, fixé à la charpente */
function Projecteur({ x, angle }: { x: number; angle: number }) {
  return (
    <g>
      <path d={`M${x - 16} 100 H${x + 16}`} stroke="#2a2420" strokeWidth="4" />
      <path d={`M${x} 100 V108`} stroke="#2a2420" strokeWidth="4" />
      <g transform={`rotate(${-angle} ${x} 112)`}>
        <rect x={x - 22} y="106" width="44" height="30" rx="6" fill="#26222a" />
        <rect x={x - 18} y="130" width="36" height="8" rx="3" fill="#4a4652" />
        <path d={`M${x - 22} 114 h-6 M${x + 22} 114 h6`} stroke="#26222a" strokeWidth="4" />
      </g>
    </g>
  );
}

export function GymnaseFond() {
  const fond = bordTerrain(722);
  const devant = bordTerrain(1044);
  return (
    <>
      {/* mur, percé des hautes fenêtres */}
      <path fillRule="evenodd" d={`M-40 40 H1640 V470 H-40 Z ${TROUS}`} fill="#eae3d6" />
      <path fillRule="evenodd" d={`M-40 40 H1640 V250 H-40 Z ${TROUS}`} fill="#e0d8ca" />
      {FENETRES_GYM.map((f) => (
        <g key={f.x} fill="#2a2420">
          <rect x={f.x - 6} y={f.y - 6} width={f.w + 12} height="6" />
          <rect x={f.x - 6} y={f.y + f.h} width={f.w + 12} height="8" />
          <rect x={f.x - 6} y={f.y} width="6" height={f.h} />
          <rect x={f.x + f.w} y={f.y} width="6" height={f.h} />
          <rect x={f.x + f.w / 2 - 2} y={f.y} width="4" height={f.h} />
          <rect x={f.x} y={f.y + f.h / 2 - 2} width={f.w} height="4" />
        </g>
      ))}
      {/* bandes aux couleurs du club */}
      <rect x="-40" y="326" width="1680" height="16" fill={CLUB.marine} />
      <rect x="-40" y="342" width="1680" height="6" fill={CLUB.ciel} />
      <rect x="-40" y="348" width="1680" height="3" fill={CLUB.blanc} />
      {/* plafond, charpente métallique, projecteurs, suspensions */}
      <rect x="-40" y="-40" width="1680" height="86" fill="#2c2a35" />
      <g stroke="#1d1b24" strokeWidth="5">
        <path d="M-40 46 H1640 M-40 100 H1640" />
      </g>
      <path
        d={Array.from({ length: 34 }, (_, i) => `M${-40 + i * 50} 100 L${-15 + i * 50} 46 L${10 + i * 50} 100`).join(" ")}
        fill="none"
        stroke="#1d1b24"
        strokeWidth="2.5"
      />
      {PROJECTEURS.map((p) => (
        <Projecteur key={p.x} x={p.x} angle={p.angle} />
      ))}
      {[535, 1065].map((x) => (
        <Suspension key={x} x={x} />
      ))}
      {/* fanions du club */}
      <path d="M40 262 Q800 300 1560 262" fill="none" stroke="#6a4b36" strokeWidth="1.5" />
      {Array.from({ length: 30 }, (_, i) => {
        const x = 70 + i * 50;
        const t = (x - 40) / 1520;
        const y = 262 + 4 * 38 * t * (1 - t);
        const c = [CLUB.marine, CLUB.ciel, CLUB.blanc, CLUB.nuit][i % 4];
        return <path key={i} d={`M${x - 12} ${y} L${x + 12} ${y} L${x} ${y + 26} Z`} fill={c} />;
      })}
      {/* protections murales */}
      <rect x="-40" y="470" width="1680" height="220" fill={CLUB.marine} />
      <rect x="-40" y="470" width="1680" height="8" fill={CLUB.ciel} />
      <path d={Array.from({ length: 15 }, (_, i) => `M${i * 120 - 20} 478 V690`).join(" ")} stroke="#141c40" strokeWidth="3" />
      <rect x="-40" y="680" width="1680" height="16" fill={CLUB.nuit} />

      {/* parquet et terrain bleu ciel */}
      <rect x="-40" y="694" width="1680" height="350" fill="url(#g-sol-gym)" />
      <path d={LAMES} stroke="#8a5530" strokeWidth="1.4" opacity="0.35" />
      <path d={`M${fond.gauche} 722 L${fond.droite} 722 L${devant.droite} 1044 L${devant.gauche} 1044 Z`} fill="#3f8fca" />
      <path d={`M${fond.gauche} 722 L${fond.droite} 722 L${devant.droite} 1044 L${devant.gauche} 1044 Z`} fill="url(#g-terrain)" />
      <path d={`M${fond.gauche} 722 L${devant.gauche} 1044 M${fond.droite} 722 L${devant.droite} 1044`} stroke={CLUB.blanc} strokeWidth="5" />
      <path d={`${ligneTerrain(722)} ${ligneTerrain(800)} ${ligneTerrain(766)} ${ligneTerrain(858)}`} stroke={CLUB.blanc} strokeWidth="4" />
      <path d="M-40 694 H1640" stroke="#2c180c" strokeWidth="2" opacity="0.3" />

      <Gradins />
      <ChariotBallons />

      {/* la tranche du mur mitoyen avec le salon */}
      <rect x="1578" y="0" width="62" height="1000" fill="#241a16" />
      <rect x="1575" y="0" width="3" height="1000" fill="#4a3a30" />
    </>
  );
}
