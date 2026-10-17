import { memo, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { stream } from "@/data/stream";
import { lieux } from "../lieux";
import { Calque, placer, Vue, type Boite } from "./Calque";
import type { ActionsScene } from "./types";

/* ───────────────────────────────────────────────────────────────────────
   Le studio de stream : les objets qu'on touche.
   - les écrans (ouvrent le panneau « Le stream »)
   - l'enseigne néon « mathsuo » (s'allume / s'éteint)
   - la lampe de studio (s'allume / s'éteint)
   - le tableau à lettres avec les horaires (décor)
   - la porte du frigo, ses aimants et ses post-its (décor)
   ─────────────────────────────────────────────────────────────────────── */

export const B_ECRAN = { x: 610, y: 390, w: 380, h: 206 };
export const B_CHAT = { x: 1042, y: 420, w: 118, h: 168 };

export const Ecrans = memo(function Ecrans({
  ouvrir,
  survoler,
}: Pick<ActionsScene, "ouvrir" | "survoler">) {
  const boite: Boite = { x: 596, y: 362, w: 580, h: 272 };
  const lieu = lieux.stream;
  return (
    <a
      href="#stream"
      className="objet"
      data-lieu="stream"
      style={placer(boite)}
      aria-label={`${lieu.objet} : ${lieu.titre}`}
      aria-haspopup="dialog"
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        ouvrir("stream");
      }}
      onPointerEnter={() => survoler("stream")}
      onPointerLeave={() => survoler(null)}
      onFocus={() => survoler("stream")}
      onBlur={() => survoler(null)}
    >
      <Vue boite={boite}>
        {/* écran principal, sur son pied */}
        <rect x="788" y="604" width="24" height="24" fill="#1b181d" />
        <ellipse cx="800" cy="628" rx="58" ry="6" fill="#1b181d" />
        <rect x="600" y="380" width="400" height="226" rx="8" fill="#17151a" />
        <rect x={B_ECRAN.x} y={B_ECRAN.y} width={B_ECRAN.w} height={B_ECRAN.h} rx="3" fill="#0b0a0e" />
        <circle cx="800" cy="601" r="1.6" fill="#9146ff" />
        {/* webcam */}
        <rect x="782" y="366" width="36" height="16" rx="7" fill="#1b181d" />
        <circle cx="800" cy="374" r="4.5" fill="#2e2a36" />
        <circle cx="800" cy="374" r="2" fill="#4c5cff" />
        {/* second écran, le chat */}
        <rect x="1094" y="596" width="14" height="32" fill="#1b181d" />
        <ellipse cx="1101" cy="628" rx="34" ry="5" fill="#1b181d" />
        <rect x="1034" y="410" width="134" height="188" rx="7" fill="#17151a" />
        <rect x={B_CHAT.x} y={B_CHAT.y} width={B_CHAT.w} height={B_CHAT.h} rx="3" fill="#0b0a0e" />
      </Vue>
    </a>
  );
});

/* L'enseigne néon : le pseudo, écrit à la main */
export const B_NEON: Boite = { x: 610, y: 168, w: 380, h: 150 };

export function TexteNeon({ trait, coeur }: { trait: string; coeur?: string }) {
  return (
    <>
      <text
        x="800"
        y="276"
        textAnchor="middle"
        className="font-main"
        fontSize="104"
        fill="none"
        stroke={trait}
        strokeWidth={coeur ? 7 : 4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {stream.pseudo}
      </text>
      {coeur && (
        <text x="800" y="276" textAnchor="middle" className="font-main" fontSize="104" fill="none" stroke={coeur} strokeWidth="2">
          {stream.pseudo}
        </text>
      )}
    </>
  );
}

export const Enseigne = memo(function Enseigne({ allume, basculer }: { allume: boolean; basculer: () => void }) {
  return (
    <button
      type="button"
      className="objet"
      style={placer(B_NEON)}
      aria-label={allume ? "Éteindre l'enseigne néon" : "Allumer l'enseigne néon"}
      aria-pressed={allume}
      onClick={basculer}
    >
      <Vue boite={B_NEON}>
        {/* plaque de plexiglas et ses fixations */}
        <rect x="622" y="180" width="356" height="126" rx="16" fill="#fff" opacity="0.06" />
        <rect x="622" y="180" width="356" height="126" rx="16" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.15" />
        {[
          [636, 194],
          [964, 194],
          [636, 292],
          [964, 292],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#cfc6d6" opacity="0.6" />
        ))}
        <TexteNeon trait="#7a5a72" />
      </Vue>
    </button>
  );
});

/* La lampe de studio : un panneau lumineux sur pied */
export const B_PANNEAU: Boite = { x: 420, y: 314, w: 134, h: 134 };

export const LampeStudio = memo(function LampeStudio({ allume, basculer }: { allume: boolean; basculer: () => void }) {
  return (
    <button
      type="button"
      className="objet"
      style={placer(B_PANNEAU)}
      aria-label={allume ? "Éteindre la lampe de studio" : "Allumer la lampe de studio"}
      aria-pressed={allume}
      onClick={basculer}
    >
      <Vue boite={B_PANNEAU}>
        <circle cx="486" cy="438" r="6" fill="#1d1a1f" />
        <g transform="rotate(14 486 380)">
          <rect x="438" y="332" width="96" height="96" rx="8" fill="#1d1a1f" />
          <rect x="446" y="340" width="80" height="80" rx="4" fill="#d9d2c6" />
          <path d="M446 340 h80 v80 h-80 Z" fill="none" stroke="#bfb6a8" strokeWidth="1" />
        </g>
      </Vue>
    </button>
  );
});

/* Le tableau à lettres, avec les horaires du stream (décor) */
export const TableauHoraires = memo(function TableauHoraires() {
  const boite: Boite = { x: 1222, y: 150, w: 240, h: 196 };
  return (
    <Calque boite={boite}>
      <rect x="1232" y="164" width="226" height="176" rx="3" fill="#140c08" opacity="0.35" />
      <rect x="1226" y="156" width="226" height="176" rx="3" fill="#8a5530" />
      <rect x="1236" y="166" width="206" height="156" fill="#1c1a1e" />
      <g stroke="#2a272d" strokeWidth="1">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M1236 ${178 + i * 12} H1442`} />
        ))}
      </g>
      <g className="font-mono" fill="#f3ece0" textAnchor="middle" fontWeight="700" letterSpacing="3">
        <text x="1339" y="212" fontSize="20">
          LIVE LE
        </text>
        <text x="1339" y="248" fontSize="20">
          WEEK-END
        </text>
        <text x="1339" y="284" fontSize="18" fill="#f7c987">
          21H—00H
        </text>
      </g>
      <text x="1339" y="310" textAnchor="middle" className="font-main" fontSize="18" fill="#c9a8ff">
        {stream.displayUrl}
      </text>
    </Calque>
  );
});

/* La petite lampe « ON AIR », allumée seulement pendant le créneau du live */
export const B_ONAIR: Boite = { x: 1040, y: 300, w: 96, h: 40 };

export const LampeOnAir = memo(function LampeOnAir() {
  return (
    <Calque boite={B_ONAIR}>
      <rect x="1042" y="302" width="92" height="36" rx="6" fill="#1b181d" />
      <rect x="1048" y="308" width="80" height="24" rx="3" fill="#3a1a1c" />
      <text x="1088" y="325" textAnchor="middle" className="font-sans" fontSize="13" fontWeight="800" letterSpacing="2" fill="#5a2a2c">
        ON AIR
      </text>
    </Calque>
  );
});

/* ─── Le coin musique : la guitare sur son stand et le clavier ─────── */

const B_MUSIQUE: Boite = { x: 36, y: 500, w: 384, h: 304 };
const B_CORDES: Boite = { x: 330, y: 556, w: 20, h: 200 };

function CordesGuitare() {
  return (
    <g stroke="#f3e6cf" strokeWidth="0.7" opacity="0.9">
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${337.6 + i * 0.95} 562 L${335 + i * 2} 751`} />
      ))}
    </g>
  );
}

function Note({ x, y, signe, delai, parent }: { x: number; y: number; signe: string; delai: number; parent: Boite }) {
  const b: Boite = { x: x - 10, y: y - 22, w: 24, h: 28 };
  return (
    <span
      className="morceau anim-note"
      style={{
        left: `${((b.x - parent.x) / parent.w) * 100}%`,
        top: `${((b.y - parent.y) / parent.h) * 100}%`,
        width: `${(b.w / parent.w) * 100}%`,
        height: `${(b.h / parent.h) * 100}%`,
        animationDelay: `${delai}s`,
      }}
      aria-hidden
    >
      <Vue boite={b}>
        <text x={x} y={y} fontSize="24" fill="#c9a8ff" className="font-sans">
          {signe}
        </text>
      </Vue>
    </span>
  );
}

export const Instruments = memo(function Instruments({
  ouvrir,
  survoler,
  accords,
  touches,
}: Pick<ActionsScene, "ouvrir" | "survoler"> & { accords: number; touches: number }) {
  const lieu = lieux.musique;
  return (
    <a
      href="#musique"
      className="objet"
      data-lieu="musique"
      style={placer(B_MUSIQUE)}
      aria-label={`${lieu.objet} : ${lieu.titre}`}
      aria-haspopup="dialog"
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        ouvrir("musique");
      }}
      onPointerEnter={() => survoler("musique")}
      onPointerLeave={() => survoler(null)}
      onFocus={() => survoler("musique")}
      onBlur={() => survoler(null)}
    >
      <Vue boite={B_MUSIQUE}>
        {/* le clavier, sur son pied en X */}
        <ellipse cx="168" cy="776" rx="120" ry="8" fill="#0b0810" opacity="0.4" />
        <g stroke="#1d1a21" strokeWidth="6" strokeLinecap="round">
          <path d="M84 650 L252 770 M252 650 L84 770" />
          <path d="M70 772 H110 M226 772 H266" strokeWidth="5" />
        </g>
        <rect x="44" y="620" width="248" height="28" rx="5" fill="#1d1a21" />
        <rect x="50" y="623" width="236" height="6" rx="2" fill="#2e2a36" />
        <circle cx="60" cy="626" r="2" fill="#c9a8ff" />
        <circle cx="68" cy="626" r="2" fill="#ff7ab8" />
        <rect x="52" y="630" width="232" height="14" rx="1.5" fill="#f4f1ea" />
        <path d={Array.from({ length: 29 }, (_, i) => `M${52 + (i + 1) * 8} 630 V644`).join(" ")} stroke="#cfc8bd" strokeWidth="0.8" />
        <g fill="#1d1a21">
          {Array.from({ length: 28 }, (_, i) => i)
            .filter((i) => [0, 1, 3, 4, 5].includes(i % 7))
            .map((i) => (
              <rect key={i} x={52 + (i + 1) * 8 - 2.4} y="630" width="4.8" height="8.5" rx="0.8" />
            ))}
        </g>
        {/* la guitare classique, sur son stand */}
        <ellipse cx="340" cy="794" rx="44" ry="6" fill="#0b0810" opacity="0.45" />
        <g stroke="#1d1a21" strokeWidth="3.5" strokeLinecap="round">
          <path d="M340 744 L314 792 M340 744 L366 792 M340 744 L340 796" />
          <path d="M340 562 V744" strokeWidth="3" />
        </g>
        <rect x="330" y="556" width="20" height="5" rx="2" fill="#1d1a21" />
        <path d="M331 524 H349 L347 560 H333 Z" fill="#6e4224" />
        {[530, 539, 548].map((y) => (
          <g key={y} fill="#e9dcc6">
            <circle cx="329" cy={y} r="2.4" />
            <circle cx="351" cy={y} r="2.4" />
          </g>
        ))}
        <rect x="335" y="558" width="10" height="116" fill="#6e4224" />
        <rect x="336" y="558" width="8" height="116" fill="#2a1a10" />
        <path d={Array.from({ length: 9 }, (_, i) => `M336 ${566 + i * 11} H344`).join(" ")} stroke="#cfc8bd" strokeWidth="0.8" />
        <ellipse cx="340" cy="740" rx="42" ry="36" fill="#6e4224" />
        <ellipse cx="340" cy="690" rx="33" ry="28" fill="#6e4224" />
        <ellipse cx="340" cy="740" rx="39" ry="33" fill="#dcae67" />
        <ellipse cx="340" cy="690" rx="30" ry="25" fill="#dcae67" />
        <path d="M312 706 Q340 716 368 706" fill="none" stroke="#c8954f" strokeWidth="2" opacity="0.6" />
        <circle cx="340" cy="704" r="15" fill="none" stroke="#8a5530" strokeWidth="3" />
        <circle cx="340" cy="704" r="11" fill="#2a1a10" />
        <rect x="322" y="748" width="36" height="6" rx="2" fill="#4a2c18" />
        <CordesGuitare />
      </Vue>
      {/* les cordes qui vibrent quand on gratte un accord */}
      {accords > 0 && (
        <span
          key={`c${accords}`}
          className="morceau anim-vibre"
          style={{
            left: `${((B_CORDES.x - B_MUSIQUE.x) / B_MUSIQUE.w) * 100}%`,
            top: `${((B_CORDES.y - B_MUSIQUE.y) / B_MUSIQUE.h) * 100}%`,
            width: `${(B_CORDES.w / B_MUSIQUE.w) * 100}%`,
            height: `${(B_CORDES.h / B_MUSIQUE.h) * 100}%`,
          }}
          aria-hidden
        >
          <Vue boite={B_CORDES}>
            <CordesGuitare />
          </Vue>
        </span>
      )}
      {accords > 0 && (
        <span key={`n${accords}`} aria-hidden>
          <Note x={356} y={690} signe="♪" delai={0} parent={B_MUSIQUE} />
          <Note x={372} y={672} signe="♫" delai={0.25} parent={B_MUSIQUE} />
          <Note x={350} y={660} signe="♪" delai={0.5} parent={B_MUSIQUE} />
        </span>
      )}
      {touches > 0 && (
        <span key={`p${touches}`} aria-hidden>
          <Note x={120} y={616} signe="♩" delai={0} parent={B_MUSIQUE} />
          <Note x={170} y={604} signe="♪" delai={0.18} parent={B_MUSIQUE} />
          <Note x={220} y={612} signe="♫" delai={0.36} parent={B_MUSIQUE} />
        </span>
      )}
    </a>
  );
});

/* ─── Jouer directement dans la scène ──────────────────────────────── */

const B_ZONE_CORDES: Boite = { x: 314, y: 664, w: 52, h: 92 };

/** Passer la souris (ou le doigt) à travers les cordes les gratte, dans le sens du geste */
export const ZoneCordes = memo(function ZoneCordes({ gratter }: { gratter: (sens: 1 | -1) => void }) {
  const cote = useRef<boolean | null>(null);
  const dernierCoup = useRef(0);
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label="Gratter les cordes de la guitare"
      className="zone-jeu zone-cordes"
      style={placer(B_ZONE_CORDES)}
      onPointerMove={(e: PointerEvent<HTMLSpanElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const aGauche = e.clientX - r.left < r.width / 2;
        const maintenant = performance.now();
        if (cote.current !== null && cote.current !== aGauche && maintenant - dernierCoup.current > 140) {
          gratter(aGauche ? -1 : 1);
          dernierCoup.current = maintenant;
        }
        cote.current = aGauche;
      }}
      onPointerLeave={() => {
        cote.current = null;
      }}
      onClick={() => {
        if (performance.now() - dernierCoup.current > 300) gratter(1);
      }}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          gratter(1);
        }
      }}
    />
  );
});

const B_ZONE_CLAVIER: Boite = { x: 52, y: 628, w: 232, h: 18 };
const TOUCHES = 29;

/** Cliquer une touche joue sa note ; bouton enfoncé, on glisse sur le clavier */
export const ZoneClavier = memo(function ZoneClavier({ jouer }: { jouer: (touche: number) => void }) {
  const [appui, setAppui] = useState<{ touche: number; n: number } | null>(null);
  const derniere = useRef(-1);
  const toucheSous = (e: PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return Math.min(TOUCHES - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * TOUCHES)));
  };
  const presser = (touche: number) => {
    derniere.current = touche;
    jouer(touche);
    setAppui((a) => ({ touche, n: (a?.n ?? 0) + 1 }));
  };
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label="Jouer du clavier (do du milieu au clavier)"
      className="zone-jeu zone-clavier"
      style={placer(B_ZONE_CLAVIER)}
      onPointerDown={(e: PointerEvent<HTMLSpanElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        presser(toucheSous(e));
      }}
      onPointerMove={(e: PointerEvent<HTMLSpanElement>) => {
        if (e.buttons !== 1) return;
        const t = toucheSous(e);
        if (t !== derniere.current) presser(t);
      }}
      onPointerUp={() => {
        derniere.current = -1;
      }}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          presser(7);
        }
      }}
    >
      {appui && (
        <span
          key={appui.n}
          className="touche-appuyee"
          style={{ left: `${(appui.touche / TOUCHES) * 100}%`, width: `${100 / TOUCHES}%` }}
          aria-hidden
        />
      )}
    </span>
  );
});

/* ─── La porte du frigo : aimants, post-its griffonnés, crayon ─────── */

const B_FRIGO: Boite = { x: 1436, y: 544, w: 152, h: 244 };

function PostItDessin({ x, y, r, teinte, lignes = 3 }: { x: number; y: number; r: number; teinte: string; lignes?: number }) {
  return (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <rect x={x - 18} y={y - 17} width="38" height="38" rx="1.5" fill="#140c08" opacity="0.18" />
      <rect x={x - 19} y={y - 19} width="38" height="38" rx="1.5" fill={teinte} />
      <rect x={x - 19} y={y - 19} width="38" height="7" fill="#000" opacity="0.06" />
      <g stroke="#3a281d" strokeWidth="1.2" strokeLinecap="round" opacity="0.55">
        {Array.from({ length: lignes }, (_, i) => (
          <path key={i} d={`M${x - 13} ${y - 5 + i * 7} q6 -2 ${10 + ((i * 7) % 9)} 0`} fill="none" />
        ))}
      </g>
    </g>
  );
}

export const Frigo = memo(function Frigo() {
  return (
    <Calque boite={B_FRIGO}>
      <PostItDessin x={1478} y={620} r={-6} teinte="#ffe58a" />
      <PostItDessin x={1530} y={668} r={5} teinte="#a8d8f0" lignes={2} />
      {/* aimants */}
      <circle cx="1478" cy="602" r="5" fill="#c2562f" />
      <circle cx="1546" cy="582" r="5" fill="#5cbcf2" />
      {/* un crayon pendu à sa ficelle */}
      <path d="M1560 610 C1566 640 1562 680 1566 724" fill="none" stroke="#efe3cf" strokeWidth="1" opacity="0.7" />
      <g transform="rotate(8 1566 734)">
        <rect x="1563" y="722" width="6" height="30" rx="1" fill="#d9a441" />
        <path d="M1563 752 L1566 760 L1569 752 Z" fill="#3a281d" />
      </g>
    </Calque>
  );
});
