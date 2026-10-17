import { FeuillePothos, JOINTS } from "./decor";

/* ───────────────────────────────────────────────────────────────────────
   Le studio de stream, à droite du salon : le décor fixe.
   Même repère que le salon (1600 × 1000), propre à la pièce.
   Mur prune, panneaux acoustiques hexagonaux, bureau en noyer, PC,
   fauteuil, étagère et sansevieria. Rendu en images par `npm run salon`.
   ─────────────────────────────────────────────────────────────────────── */

/** Hexagone « à plat » centré en (cx, cy) */
function hexagone(cx: number, cy: number, r: number) {
  const h = (r * Math.sqrt(3)) / 2;
  return `M${cx - r} ${cy} L${cx - r / 2} ${cy - h} L${cx + r / 2} ${cy - h} L${cx + r} ${cy} L${cx + r / 2} ${cy + h} L${cx - r / 2} ${cy + h} Z`;
}

/* Grappe de panneaux acoustiques : colonne, rang, couleur */
const R = 34;
const PANNEAUX: [number, number, string][] = [
  [0, 1, "#c2562f"],
  [1, 0, "#d9a441"],
  [1, 1, "#59623a"],
  [2, 0, "#e9dcc6"],
  [2, 1, "#c2562f"],
  [2, 2, "#6b4a63"],
  [3, 0, "#59623a"],
  [3, 1, "#d9a441"],
  [4, 1, "#e9dcc6"],
  [1, 2, "#6b4a63"],
];

function Panneaux({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {PANNEAUX.map(([col, rang, couleur]) => {
        const cx = x + col * R * 1.5;
        const cy = y + rang * R * Math.sqrt(3) + (col % 2 ? (R * Math.sqrt(3)) / 2 : 0);
        return (
          <g key={`${col}-${rang}`}>
            <path d={hexagone(cx + 4, cy + 6, R - 2)} fill="#1c1219" opacity="0.35" />
            <path d={hexagone(cx, cy, R - 2)} fill={couleur} />
            <path d={hexagone(cx, cy, R - 10)} fill="#000" opacity="0.08" />
            <path d={`M${cx - R + 4} ${cy} L${cx - R / 2 + 2} ${cy - R * 0.8}`} stroke="#fff" strokeWidth="2" opacity="0.18" />
          </g>
        );
      })}
    </g>
  );
}

export function StudioFond() {
  return (
    <>
      {/* mur, plafond, plinthe */}
      <rect x="-40" y="40" width="1680" height="660" fill="url(#g-mur-studio)" />
      <rect x="-40" y="-40" width="1680" height="88" fill="#2c2029" />
      <rect x="-40" y="46" width="1680" height="16" fill="#382834" />
      <rect x="-40" y="62" width="1680" height="40" fill="url(#g-ombre-poutre)" />
      <rect x="-40" y="680" width="1680" height="16" fill="#2b1f27" />
      <rect x="-40" y="695" width="1680" height="3" fill="#120c10" opacity="0.6" />

      {/* parquet et tapis rond */}
      <rect x="-40" y="694" width="1680" height="350" fill="url(#g-sol)" />
      <path d={JOINTS} stroke="#3e2213" strokeWidth="1.6" opacity="0.4" />
      <ellipse cx="800" cy="884" rx="470" ry="100" fill="#2c180c" opacity="0.25" />
      <ellipse cx="800" cy="878" rx="470" ry="100" fill="#59623a" />
      <ellipse cx="800" cy="878" rx="400" ry="84" fill="none" stroke="#e9dcc6" strokeWidth="6" opacity="0.8" />
      <ellipse cx="800" cy="878" rx="330" ry="68" fill="none" stroke="#d9a441" strokeWidth="5" opacity="0.8" />
      <ellipse cx="800" cy="878" rx="260" ry="52" fill="none" stroke="#e9dcc6" strokeWidth="4" opacity="0.6" />

      {/* panneaux acoustiques */}
      <Panneaux x={150} y={176} />

      {/* étagère : manette, livres, petite plante */}
      <rect x="1236" y="404" width="236" height="11" rx="2" fill="#8a5530" />
      <rect x="1236" y="412" width="236" height="4" fill="#5c3519" />
      <path d="M1250 416 L1250 432 L1262 416 Z M1458 416 L1458 432 L1446 416 Z" fill="#2a1d18" />
      <rect x="1252" y="360" width="12" height="44" rx="1" fill="#c2562f" />
      <rect x="1265" y="366" width="10" height="38" rx="1" fill="#e9dcc6" />
      <rect x="1276" y="356" width="13" height="48" rx="1" fill="#59623a" />
      <rect x="1290" y="368" width="9" height="36" rx="1" fill="#d9a441" />
      {/* manette */}
      <path
        d="M1330 386 C1330 374 1344 370 1356 374 H1388 C1400 370 1414 374 1414 386 C1416 398 1408 404 1400 402 C1394 400 1390 394 1384 394 H1360 C1354 394 1350 400 1344 402 C1336 404 1328 398 1330 386 Z"
        fill="#e9dcc6"
      />
      <circle cx="1350" cy="384" r="4" fill="#3a281d" />
      <circle cx="1398" cy="381" r="2.4" fill="#c2562f" />
      <circle cx="1404" cy="387" r="2.4" fill="#59623a" />
      <circle cx="1392" cy="387" r="2.4" fill="#d9a441" />
      {/* petit pothos */}
      <path d="M1428 380 H1460 L1456 404 H1432 Z" fill="url(#g-pot-blanc)" />
      <path d="M1440 400 C1430 440 1446 480 1436 520" fill="none" stroke="#3d6a34" strokeWidth="2" />
      {[
        [1436, 430, 30],
        [1442, 462, -25],
        [1436, 496, 20],
      ].map(([x, y, r]) => (
        <FeuillePothos key={y} x={x} y={y} r={r} s={0.8} couleur="#3f7a3a" />
      ))}
      <FeuillePothos x={1434} y={380} r={-150} s={0.9} couleur="#2f5f30" />
      <FeuillePothos x={1448} y={376} r={175} s={1} couleur="#4f8c42" />
      <FeuillePothos x={1458} y={380} r={140} s={0.8} couleur="#3f7a3a" />

      {/* pied de la lampe de studio (le panneau lumineux se touche) */}
      <path d="M486 440 L486 690" stroke="#1d1a1f" strokeWidth="5" />
      <path d="M486 690 L452 726 M486 690 L520 726 M486 690 L488 732" stroke="#1d1a1f" strokeWidth="4" strokeLinecap="round" />

      {/* la tranche du mur mitoyen avec le salon */}
      <rect x="-40" y="0" width="62" height="1000" fill="#241a16" />
      <rect x="22" y="0" width="3" height="1000" fill="#4a3a30" />
    </>
  );
}

/** Le petit frigo rétro du studio (aimants et post-its de la porte : objets-studio.tsx) */
function Frigo() {
  return (
    <g>
      <ellipse cx="1512" cy="794" rx="82" ry="9" fill="#140c08" opacity="0.4" />
      {/* pieds */}
      <rect x="1452" y="780" width="10" height="12" rx="2" fill="#2a2420" />
      <rect x="1562" y="780" width="10" height="12" rx="2" fill="#2a2420" />
      {/* carrosserie arrondie, crème, côté dans l'ombre */}
      <rect x="1440" y="548" width="144" height="236" rx="26" fill="#cdbfa6" />
      <rect x="1440" y="548" width="134" height="236" rx="26" fill="#efe3cf" />
      <path d="M1452 572 C1452 560 1460 554 1472 554" fill="none" stroke="#fffaf0" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      {/* séparation du freezer */}
      <rect x="1444" y="604" width="132" height="3" fill="#cdbfa6" />
      {/* poignées chromées */}
      <rect x="1450" y="574" width="7" height="22" rx="3.5" fill="#c9c3ba" />
      <rect x="1450" y="618" width="7" height="58" rx="3.5" fill="#c9c3ba" />
      <rect x="1451" y="620" width="2.5" height="52" rx="1.2" fill="#fff" opacity="0.6" />
      {/* un petit cactus posé dessus */}
      <path d="M1500 548 H1528 L1524 528 H1504 Z" fill="url(#g-terre-cuite)" />
      <path d="M1514 528 C1506 528 1506 500 1514 496 C1522 500 1522 528 1514 528 Z" fill="#4f7a3c" />
      <path d="M1508 512 C1500 512 1500 500 1504 498" fill="none" stroke="#4f7a3c" strokeWidth="6" strokeLinecap="round" />
      <path d="M1520 516 C1528 516 1528 506 1525 503" fill="none" stroke="#4f7a3c" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

export function StudioMeubles() {
  return (
    <>
      {/* le PC, au sol à droite du bureau */}
      <ellipse cx="1322" cy="792" rx="80" ry="9" fill="#140c08" opacity="0.4" />
      <rect x="1262" y="556" width="122" height="234" rx="8" fill="#1d1a21" />
      <rect x="1272" y="568" width="80" height="210" rx="4" fill="#120f16" />
      <rect x="1272" y="568" width="80" height="210" rx="4" fill="none" stroke="#3a3542" strokeWidth="2" />
      <rect x="1360" y="572" width="16" height="6" rx="2" fill="#3a3542" />
      <circle cx="1368" cy="592" r="3" fill="#5c5566" />

      {/* le bureau en noyer */}
      <ellipse cx="800" cy="780" rx="470" ry="14" fill="#140c08" opacity="0.35" />
      <g stroke="#1b181d" strokeWidth="7" strokeLinecap="round">
        <path d="M392 660 L382 772" />
        <path d="M1208 660 L1218 772" />
        <path d="M410 700 L1190 700" strokeWidth="4" />
      </g>
      <path d="M380 626 L1220 626 L1242 648 L358 648 Z" fill="#9a6238" />
      <path d="M380 626 L1220 626" stroke="#b87c4c" strokeWidth="2" />
      <rect x="358" y="648" width="884" height="14" fill="#6e4224" />
      {/* tapis de souris, clavier, souris */}
      <path d="M560 628 L1040 628 L1052 644 L548 644 Z" fill="#2b2530" />
      <path d="M640 630 L840 630 L846 641 L634 641 Z" fill="#2a2a30" />
      <path d="M646 632 L834 632" stroke="#5c5566" strokeWidth="5" strokeDasharray="7 2" />
      <ellipse cx="904" cy="636" rx="11" ry="5.5" fill="#e9dcc6" />
      {/* mug */}
      <path d="M1092 604 H1120 V626 Q1120 632 1114 632 H1098 Q1092 632 1092 626 Z" fill="#d9a441" />
      <path d="M1120 610 C1130 610 1130 624 1120 624" fill="none" stroke="#d9a441" strokeWidth="3.5" />
      {/* casque sur son support */}
      <path d="M430 626 L430 560" stroke="#1b181d" strokeWidth="4" />
      <ellipse cx="430" cy="626" rx="16" ry="3.5" fill="#1b181d" />
      <path d="M408 586 C406 550 454 550 452 586" fill="none" stroke="#2f2a33" strokeWidth="7" strokeLinecap="round" />
      <rect x="400" y="578" width="14" height="24" rx="6" fill="#2f2a33" />
      <rect x="446" y="578" width="14" height="24" rx="6" fill="#2f2a33" />
      <rect x="402" y="582" width="5" height="16" rx="2" fill="#c2562f" />

      {/* le micro sur son bras articulé */}
      <g stroke="#1b181d" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M512 626 L512 600 L540 470 L590 452" />
        <path d="M516 596 L544 474" strokeWidth="2" stroke="#3a3542" />
      </g>
      <rect x="506" y="616" width="14" height="14" rx="2" fill="#1b181d" />
      <g transform="rotate(-12 588 492)">
        <rect x="574" y="452" width="28" height="80" rx="13" fill="#26222a" />
        <rect x="574" y="452" width="28" height="44" rx="13" fill="#3a3542" />
        <path d="M578 462 H598 M578 470 H598 M578 478 H598 M578 486 H598" stroke="#26222a" strokeWidth="2" />
        <rect x="582" y="508" width="12" height="4" rx="2" fill="#c2562f" />
      </g>

      {/* le fauteuil, vu de dos */}
      <ellipse cx="800" cy="902" rx="120" ry="16" fill="#140c08" opacity="0.35" />
      <g stroke="#1b181d" strokeWidth="6" strokeLinecap="round">
        <path d="M800 820 L800 880" strokeWidth="9" />
        <path d="M800 880 L720 898 M800 880 L880 898 M800 880 L760 910 M800 880 L842 910" />
      </g>
      {[720, 880, 760, 842].map((x, i) => (
        <circle key={x} cx={x} cy={i < 2 ? 900 : 912} r="7" fill="#26222a" />
      ))}
      <path d="M716 760 C716 742 734 736 800 736 C866 736 884 742 884 760 L878 818 C876 830 860 836 800 836 C740 836 724 830 722 818 Z" fill="#4a3346" />
      <path
        d="M712 652 C712 620 740 606 800 606 C860 606 888 620 888 652 L882 776 C880 794 860 802 800 802 C740 802 720 794 718 776 Z"
        fill="#5a3f55"
      />
      <path d="M736 650 C736 632 760 624 800 624 C840 624 864 632 864 650 L860 760 C858 774 840 780 800 780 C760 780 742 774 740 760 Z" fill="#6b4a63" />
      <path d="M752 640 C770 632 830 632 848 640" fill="none" stroke="#8a6680" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <rect x="690" y="720" width="26" height="12" rx="6" fill="#2f2a33" />
      <rect x="884" y="720" width="26" height="12" rx="6" fill="#2f2a33" />

      <Frigo />
    </>
  );
}
