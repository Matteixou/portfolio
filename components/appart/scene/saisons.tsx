import { memo } from "react";
import type { DecorSaison } from "../saisons";
import { Calque, Halo, placer, Vue, type Boite } from "./Calque";

/* ───────────────────────────────────────────────────────────────────────
   Les décors de saison (voir components/appart/saisons.ts pour le
   calendrier). Montés seulement quand la saison les demande : le reste de
   l'année, ils ne coûtent rien. Mêmes règles que le reste de la scène :
   des petits calques, animés en transform / opacity seulement.
   ─────────────────────────────────────────────────────────────────────── */

/* ═══ Les guirlandes lumineuses ══════════════════════════════════════ */

export type Point = [number, number];

/** Des ampoules régulièrement espacées le long de fils qui pendent entre des points d'accroche */
export function guirlande(ancres: Point[], fleche: number, pas: number) {
  const ampoules: Point[] = [];
  let fil = `M${ancres[0][0]} ${ancres[0][1]}`;
  for (let i = 0; i < ancres.length - 1; i++) {
    const [x0, y0] = ancres[i];
    const [x1, y1] = ancres[i + 1];
    // point de contrôle : le milieu du fil descend de `fleche`
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2 + 2 * fleche;
    fil += ` Q${cx} ${cy} ${x1} ${y1}`;
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / pas));
    for (let k = 1; k < n; k++) {
      const t = k / n;
      const u = 1 - t;
      ampoules.push([u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]);
    }
  }
  return { fil, ampoules };
}

export function boiteDe(points: Point[], marge: number): Boite {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x = Math.min(...xs) - marge;
  const y = Math.min(...ys) - marge;
  return { x, y, w: Math.max(...xs) - x + marge, h: Math.max(...ys) - y + marge };
}

/** Une guirlande : le fil, les ampoules qui scintillent en trois groupes, et leur lueur la nuit */
const Guirlande = memo(function Guirlande({
  id,
  ancres,
  fleche,
  couleurs,
}: {
  /** préfixe des dégradés (unique dans la page) */
  id: string;
  ancres: Point[];
  fleche: number;
  couleurs: string[];
}) {
  const { fil, ampoules } = guirlande(ancres, fleche, 17);
  const boite = boiteDe([...ancres, ...ampoules.map(([x, y]): Point => [x, y + 2 * fleche])], 14);
  return (
    <>
      <Calque boite={boite}>
        <path d={fil} fill="none" stroke="#2a2420" strokeWidth="1.3" />
        {ampoules.map(([x, y], i) => (
          <rect key={i} x={x - 1.6} y={y} width="3.2" height="3" rx="0.6" fill="#3a3430" />
        ))}
      </Calque>
      {/* la lueur des ampoules, la nuit (statique, en dégradé doux) */}
      <div className="nuit-seule" aria-hidden>
        <Calque boite={boite}>
          <defs>
            {couleurs.map((c, i) => (
              <radialGradient key={c} id={`${id}-lueur-${i}`}>
                <stop offset="0" stopColor={c} stopOpacity="0.55" />
                <stop offset="1" stopColor={c} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          {ampoules.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y + 6.5} r="11" fill={`url(#${id}-lueur-${i % couleurs.length})`} />
          ))}
        </Calque>
      </div>
      {[0, 1, 2].map((g) => (
        <Calque key={g} boite={boite} className="anim-guirlande" style={{ animationDelay: `${-g * 0.7}s` }}>
          {ampoules.map(([x, y], i) =>
            i % 3 === g ? <ellipse key={i} cx={x} cy={y + 6.5} rx="2.6" ry="3.6" fill={couleurs[i % couleurs.length]} /> : null,
          )}
        </Calque>
      ))}
    </>
  );
});

/** Le long de la tringle des rideaux, au-dessus de la fenêtre */
export function GuirlandeSalon({ couleurs }: { couleurs: string[] }) {
  return (
    <Guirlande
      id="guirlande-salon"
      ancres={[
        [352, 86],
        [490, 86],
        [628, 86],
        [766, 86],
        [902, 86],
      ]}
      fleche={18}
      couleurs={couleurs}
    />
  );
}

/** Sous l'étagère du studio */
export function GuirlandeStudio({ couleurs }: { couleurs: string[] }) {
  return (
    <Guirlande
      id="guirlande-studio"
      ancres={[
        [1240, 418],
        [1354, 418],
        [1468, 418],
      ]}
      fleche={12}
      couleurs={couleurs}
    />
  );
}

/* ═══ Le sapin de Noël (dessiné dans l'image « meubles-noel ») ═══════ */

/** Les ampoules du sapin : placées à la main, hors du cache-pot et du meuble à vinyles */
const LUMIERES_SAPIN: Point[] = [
  [912, 380], [932, 384], [904, 404], [922, 409], [940, 404],
  [890, 462], [908, 468], [926, 470], [944, 466], [960, 458],
  [875, 522], [896, 530], [918, 533], [940, 531], [962, 524],
  [866, 586], [888, 595], [910, 598], [932, 597], [952, 590],
  [880, 612], [902, 618], [926, 620], [948, 614], [858, 640], [874, 646],
];
const B_SAPIN: Boite = { x: 846, y: 300, w: 152, h: 360 };
const TEINTES_SAPIN = ["#fff1d6", "#ffd36b", "#ff8a6b", "#fff1d6", "#ffc46b"];

export const LumieresSapin = memo(function LumieresSapin() {
  return (
    <>
      <div className="nuit-seule" aria-hidden>
        <Halo cx={922} cy={330} r={46} className="ambre" />
        <Calque boite={B_SAPIN}>
          <defs>
            <radialGradient id="sapin-lueur">
              <stop offset="0" stopColor="#ffd98a" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
            </radialGradient>
          </defs>
          {LUMIERES_SAPIN.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="10" fill="url(#sapin-lueur)" />
          ))}
        </Calque>
      </div>
      {[0, 1, 2].map((g) => (
        <Calque key={g} boite={B_SAPIN} className="anim-guirlande" style={{ animationDelay: `${-g * 0.55}s`, animationDuration: "10.4s" }}>
          {LUMIERES_SAPIN.map(([x, y], i) =>
            i % 3 === g ? <circle key={i} cx={x} cy={y} r="2.4" fill={TEINTES_SAPIN[i % TEINTES_SAPIN.length]} /> : null,
          )}
        </Calque>
      ))}
    </>
  );
});

/* ═══ Halloween : les citrouilles ════════════════════════════════════ */

/** Les yeux, le nez et la bouche découpés (centre cx, cy ; demi-largeur r) */
function visage(cx: number, cy: number, r: number) {
  const p = (dx: number, dy: number) => `${cx + dx * r} ${cy + dy * r}`;
  return [
    `M${p(-0.44, -0.08)} L${p(-0.16, -0.08)} L${p(-0.3, -0.36)} Z`,
    `M${p(0.16, -0.08)} L${p(0.44, -0.08)} L${p(0.3, -0.36)} Z`,
    `M${p(-0.07, 0.06)} L${p(0.07, 0.06)} L${p(0, -0.07)} Z`,
    `M${p(-0.46, 0.16)} Q${p(0, 0.66)} ${p(0.46, 0.16)} L${p(0.32, 0.27)} L${p(0.2, 0.17)} L${p(0.06, 0.29)} L${p(-0.08, 0.18)} L${p(-0.21, 0.29)} L${p(-0.33, 0.19)} Z`,
  ].join(" ");
}

function Citrouille({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const h = r * 0.82;
  return (
    <g>
      <ellipse cx={cx} cy={cy + h * 0.92} rx={r * 1.08} ry={r * 0.16} fill="#2c180c" opacity="0.3" />
      <ellipse cx={cx - r * 0.42} cy={cy} rx={r * 0.62} ry={h} fill="#d0601b" />
      <ellipse cx={cx + r * 0.42} cy={cy} rx={r * 0.62} ry={h} fill="#b9521a" />
      <ellipse cx={cx} cy={cy} rx={r * 0.52} ry={h * 1.03} fill="#e8762a" />
      <path d={`M${cx - r * 0.2} ${cy - h * 0.7} Q${cx - r * 0.28} ${cy} ${cx - r * 0.2} ${cy + h * 0.7}`} fill="none" stroke="#f39a4a" strokeWidth={r * 0.06} opacity="0.6" />
      <path
        d={`M${cx} ${cy - h + 2} q-1 ${-r * 0.28} ${r * 0.2} ${-r * 0.4}`}
        fill="none"
        stroke="#5b6b2e"
        strokeWidth={r * 0.15}
        strokeLinecap="round"
      />
      <path d={visage(cx, cy, r)} fill="#4a2410" />
    </g>
  );
}

/** Le visage qui s'éclaire la nuit (au-dessus du voile), et sa lueur */
function LueurCitrouille({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <div className="nuit-seule" aria-hidden>
      <Halo cx={cx} cy={cy} r={r * 2.6} className="bougie" />
      <Calque boite={{ x: cx - r, y: cy - r, w: 2 * r, h: 2 * r }} className="anim-citrouille">
        <path d={visage(cx, cy, r)} fill="#ffd36b" />
      </Calque>
    </div>
  );
}

const B_CITROUILLES: Boite = { x: 790, y: 660, w: 120, h: 76 };

/** Au pied de la fenêtre, à côté du guéridon */
export const CitrouillesSalon = memo(function CitrouillesSalon() {
  return (
    <Calque boite={B_CITROUILLES}>
      <Citrouille cx={834} cy={702} r={30} />
      <Citrouille cx={878} cy={716} r={15} />
    </Calque>
  );
});

export const LueursCitrouillesSalon = memo(function LueursCitrouillesSalon() {
  return (
    <>
      <LueurCitrouille cx={834} cy={702} r={30} />
      <LueurCitrouille cx={878} cy={716} r={15} />
    </>
  );
});

/** Sur le frigo du studio, à côté du cactus */
export const CitrouilleFrigo = memo(function CitrouilleFrigo() {
  return (
    <Calque boite={{ x: 1536, y: 514, w: 44, h: 38 }}>
      <Citrouille cx={1557} cy={536} r={14} />
    </Calque>
  );
});

export const LueurCitrouilleFrigo = memo(function LueurCitrouilleFrigo() {
  return <LueurCitrouille cx={1557} cy={536} r={14} />;
});

/** La toile d'araignée dans le coin de la vitre, et sa locataire */
export const ToileAraignee = memo(function ToileAraignee() {
  const [ox, oy] = [553, 102];
  const rayons = [0, 22, 45, 68, 90].map((a) => (a * Math.PI) / 180);
  const fils = rayons.map((a) => `M${ox} ${oy} L${ox + Math.cos(a) * 50} ${oy + Math.sin(a) * 50}`).join(" ");
  const tours = [14, 27, 40]
    .map((r) => rayons.map((a, i) => `${i ? "L" : "M"}${ox + Math.cos(a) * r} ${oy + Math.sin(a) * r}`).join(" "))
    .join(" ");
  return (
    <>
      <Calque boite={{ x: ox, y: oy, w: 54, h: 54 }}>
        <path d={`${fils} ${tours}`} fill="none" stroke="#f6efe4" strokeWidth="0.9" opacity="0.75" />
      </Calque>
      <Calque boite={{ x: 584, y: 102, w: 14, h: 40 }} className="anim-araignee">
        <path d="M591 102 V128" stroke="#f6efe4" strokeWidth="0.6" opacity="0.8" />
        <g stroke="#1c1a1f" strokeWidth="0.9" fill="none">
          <path d="M588 130 l-4 -3 M588 132 l-4 1 M588 134 l-4 4 M594 130 l4 -3 M594 132 l4 1 M594 134 l4 4" />
        </g>
        <circle cx="591" cy="129" r="2" fill="#1c1a1f" />
        <ellipse cx="591" cy="133.5" rx="3.2" ry="3.8" fill="#1c1a1f" />
      </Calque>
    </>
  );
});

/* ═══ Le balcon (derrière le garde-corps) ════════════════════════════ */

export const Balcon = memo(function Balcon({ type }: { type: NonNullable<DecorSaison["balcon"]> }) {
  return (
    <div className="fenetre-vue" aria-hidden>
      {type === "drapeau" ? (
        <Calque boite={{ x: 766, y: 528, w: 36, h: 52 }} className="anim-drapeau">
          {/* un petit drapeau planté dans le garde-corps */}
          <rect x="771" y="532" width="2" height="46" rx="1" fill="#3a2a20" />
          <path d="M773 534 C780 531 786 537 796 533 V549 C786 553 780 547 773 550 Z" fill="#f6efe4" />
          <path d="M773 534 C775.5 533 777.5 533.5 780 534.2 V550.2 C777.5 549.5 775.5 549.4 773 550 Z" fill="#2a4da8" />
          <path d="M789 535.3 C791.5 535 793.5 534.2 796 533 V549 C793.5 550.2 791.5 551 789 551.3 Z" fill="#d6302c" />
        </Calque>
      ) : type === "citrouille" ? (
        <Calque boite={{ x: 770, y: 568, w: 44, h: 36 }}>
          <Citrouille cx={791} cy={588} r={14} />
        </Calque>
      ) : (
        <Calque boite={{ x: 766, y: 536, w: 46, h: 40 }}>
          {/* une jardinière accrochée au garde-corps */}
          <g fill="#4f7a3c">
            <path d="M776 562 C772 552 774 546 780 544 C780 552 780 556 778 562 Z" />
            <path d="M790 562 C792 550 798 546 804 548 C800 554 796 558 794 562 Z" />
            <path d="M784 562 C782 552 786 544 790 542 C790 550 788 556 786 562 Z" />
          </g>
          <g fill="#d9472b">
            <circle cx="778" cy="546" r="4.2" />
            <circle cx="789" cy="541" r="4.6" />
            <circle cx="800" cy="547" r="4.2" />
          </g>
          <g fill="#f08a6b">
            <circle cx="777" cy="545" r="1.6" />
            <circle cx="788" cy="540" r="1.8" />
            <circle cx="799" cy="546" r="1.6" />
          </g>
          <path d="M770 560 H808 L805 574 H773 Z" fill="#b9602f" />
          <rect x="769" y="559" width="40" height="3.5" rx="1" fill="#c9733d" />
        </Calque>
      )}
    </div>
  );
});

/* ═══ Les vitres : neige en bombe (Noël) ou givre (hiver) ════════════ */

const CARREAUX: [number, number, number, number][] = [
  [410, 102, 547, 232],
  [553, 102, 687, 232],
  [693, 102, 830, 232],
  [410, 240, 616, 602],
  [624, 240, 830, 602],
];

function congere(x0: number, x1: number, y: number) {
  let d = `M${x0} ${y} V${y - 8}`;
  const n = Math.max(3, Math.round((x1 - x0) / 22));
  const pas = (x1 - x0) / n;
  for (let i = 0; i < n; i++) {
    const haut = i % 2 ? 7 : 12;
    d += ` Q${x0 + pas * (i + 0.5)} ${y - 8 - haut} ${x0 + pas * (i + 1)} ${y - 8 + (i % 3) - 1}`;
  }
  return `${d} V${y} Z`;
}

export const VitresSaison = memo(function VitresSaison({ type }: { type: "neige" | "givre" }) {
  const neige = type === "neige";
  return (
    <Calque boite={{ x: 408, y: 100, w: 424, h: 504 }}>
      <defs>
        <radialGradient id="g-givre">
          <stop offset="0" stopColor="#ffffff" stopOpacity={neige ? 0.9 : 0.6} />
          <stop offset="0.55" stopColor="#f4f8ff" stopOpacity={neige ? 0.45 : 0.25} />
          <stop offset="1" stopColor="#f4f8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {CARREAUX.map(([x0, y0, x1, y1]) => {
        const r = (y1 - y0 > 200 ? 48 : 30) * (neige ? 1 : 0.8);
        return (
          <g key={`${x0}-${y0}`}>
            {[
              [x0, y0],
              [x1, y0],
              [x0, y1],
              [x1, y1],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="url(#g-givre)" />
            ))}
            {neige && (
              <>
                <path d={congere(x0, x1, y1)} fill="#fbfdff" opacity="0.95" />
                <path d={congere(x0, x1, y1)} fill="none" stroke="#dbe6f2" strokeWidth="1.2" opacity="0.8" />
              </>
            )}
          </g>
        );
      })}
    </Calque>
  );
});

/* ═══ Dehors : feuilles mortes, pétales (dans le ciel, sous le mur) ══ */

const tuile = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const feuille = (x: number, y: number, a: number, c: string, s = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 -8 C6 -4 6 4 0 8 C-6 4 -6 -4 0 -8 Z" fill="${c}"/><path d="M0 -7 V9" stroke="#7a3d17" stroke-width=".8" opacity=".6"/></g>`;
const petale = (x: number, y: number, a: number, c: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`;

const FEUILLES_PRES = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">${feuille(30, 26, 35, "#d9822b")}${feuille(112, 70, -50, "#b5532a")}${feuille(64, 128, 110, "#e0a43c")}</svg>`,
);
const FEUILLES_LOIN = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><g opacity=".7">${feuille(20, 22, 60, "#c9742e", 0.6)}${feuille(74, 64, -20, "#a65a2c", 0.55)}</g></svg>`,
);
const PETALES_PRES = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">${petale(26, 20, 30, "#f6b8c8")}${petale(110, 54, -40, "#fbd3dc")}${petale(70, 104, 70, "#fff4f6")}${petale(140, 138, 10, "#f6b8c8")}</svg>`,
);
const PETALES_LOIN = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><g opacity=".75">${petale(18, 30, -20, "#f9c9d5")}${petale(72, 70, 50, "#fff0f3")}</g></svg>`,
);

const note = (x: number, y: number, c: string, s = 1, double = false) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><ellipse cx="0" cy="0" rx="4.2" ry="3.2" transform="rotate(-20)"/><rect x="3" y="-17" width="1.6" height="17"/>${
    double ? `<ellipse cx="12" cy="-3" rx="4.2" ry="3.2" transform="rotate(-20 12 -3)"/><rect x="15" y="-20" width="1.6" height="17"/><path d="M3 -17 L16.6 -20 V-16 L3 -13 Z"/>` : `<path d="M4.6 -17 C9 -14 10 -10 8 -6 C8.5 -9 7 -12 4.6 -13 Z"/>`
  }</g>`;
const NOTES_PRES = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">${note(28, 40, "#ffe2a8")}${note(108, 92, "#ffd1e6", 1, true)}${note(60, 146, "#fff4dc", 0.9)}</svg>`,
);
const NOTES_LOIN = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><g opacity=".6">${note(24, 34, "#fff0d2", 0.6)}${note(72, 82, "#ffe2a8", 0.55, true)}</g></svg>`,
);

const TUILES_DEHORS = {
  feuilles: [FEUILLES_PRES, FEUILLES_LOIN],
  petales: [PETALES_PRES, PETALES_LOIN],
  notes: [NOTES_PRES, NOTES_LOIN],
};

export const DehorsSaison = memo(function DehorsSaison({ boite, type }: { boite: Boite; type: NonNullable<DecorSaison["dehors"]> }) {
  const [pres, loin] = TUILES_DEHORS[type];
  // les feuilles et les pétales tombent ; les notes de la Fête de la musique montent de la rue
  const sens = type === "notes" ? " monte" : "";
  return (
    <div className="calque saison-dehors" style={placer(boite)} aria-hidden>
      <div className={`rideau-saison-loin${sens}`} style={{ backgroundImage: loin }} />
      <div className={`rideau-saison${sens}`} style={{ backgroundImage: pres }} />
    </div>
  );
});

/* ═══ Le ciel, la nuit : chauves-souris, feux d'artifice, lucioles ═══ */

const B_CHAUVES_SOURIS: Boite = { x: 420, y: 150, w: 60, h: 40 };
const CHAUVES_SOURIS: [number, number, number][] = [
  [428, 168, 1],
  [452, 158, 0.75],
  [446, 178, 0.6],
];
const AILES = "M0 0 C-3 -3 -6 -4 -10 -2 C-8 0 -9 2 -10 4 C-7 2 -5 3 -4 5 C-3 3 -1 3 0 4 C1 3 3 3 4 5 C5 3 7 2 10 4 C9 2 8 0 10 -2 C6 -4 3 -3 0 0 Z";

const FEUX: { cx: number; cy: number; c: string; d: number; t: number }[] = [
  { cx: 655, cy: 160, c: "#ffd36b", d: 0, t: 2.8 },
  { cx: 770, cy: 214, c: "#ff8fb1", d: -1.1, t: 3.4 },
  { cx: 585, cy: 290, c: "#8fe3ff", d: -2, t: 3.1 },
];

const LUCIOLES = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><defs><radialGradient id="l"><stop offset="0" stop-color="#e6ff8a" stop-opacity=".85"/><stop offset="1" stop-color="#e6ff8a" stop-opacity="0"/></radialGradient></defs><g fill="url(#l)"><circle cx="34" cy="46" r="8"/><circle cx="126" cy="128" r="7"/></g><g fill="#fbffd6"><circle cx="34" cy="46" r="1.5"/><circle cx="126" cy="128" r="1.3"/></g></svg>`,
);

const BLEU_BLANC_ROUGE = ["#6f93ff", "#ffffff", "#ff5a52"];

export const CielSaison = memo(function CielSaison({ type }: { type: NonNullable<DecorSaison["ciel"]> }) {
  if (type === "chauves-souris") {
    return (
      <div className="calque" style={placer(B_CHAUVES_SOURIS)}>
        <div className="remplir anim-chauves-souris">
          {CHAUVES_SOURIS.map(([x, y, s], i) => {
            const b = { x: x - 11 * s, y: y - 5 * s, w: 22 * s, h: 11 * s };
            return (
              <span
                key={i}
                className="morceau anim-aile"
                style={{
                  left: `${((b.x - B_CHAUVES_SOURIS.x) / B_CHAUVES_SOURIS.w) * 100}%`,
                  top: `${((b.y - B_CHAUVES_SOURIS.y) / B_CHAUVES_SOURIS.h) * 100}%`,
                  width: `${(b.w / B_CHAUVES_SOURIS.w) * 100}%`,
                  height: `${(b.h / B_CHAUVES_SOURIS.h) * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "3.52s", // 8 battements (aller-retour de 0,22 s) par tour
                }}
              >
                <Vue boite={b}>
                  <path transform={`translate(${x} ${y}) scale(${s})`} d={AILES} fill="#15131d" />
                </Vue>
              </span>
            );
          })}
        </div>
      </div>
    );
  }
  if (type === "feux" || type === "feux-tricolores") {
    // le 14 juillet, les feux sont bleu, blanc, rouge
    const feux = type === "feux" ? FEUX : FEUX.map((f, i) => ({ ...f, c: BLEU_BLANC_ROUGE[i] }));
    return (
      <>
        {feux.map((f) => {
          const b: Boite = { x: f.cx - 34, y: f.cy - 34, w: 68, h: 68 };
          return (
            <Calque key={f.cx} boite={b} className="anim-feu" style={{ animationDelay: `${f.d}s`, animationDuration: `${f.t}s` }}>
              <g stroke={f.c} strokeWidth="1.6" strokeLinecap="round">
                {Array.from({ length: 14 }, (_, i) => {
                  const a = (i / 14) * Math.PI * 2;
                  return (
                    <path
                      key={i}
                      d={`M${f.cx + Math.cos(a) * 6} ${f.cy + Math.sin(a) * 6} L${f.cx + Math.cos(a) * 24} ${f.cy + Math.sin(a) * 24}`}
                    />
                  );
                })}
              </g>
              <g fill={f.c}>
                {Array.from({ length: 14 }, (_, i) => {
                  const a = ((i + 0.5) / 14) * Math.PI * 2;
                  return <circle key={i} cx={f.cx + Math.cos(a) * 29} cy={f.cy + Math.sin(a) * 29} r="1.5" />;
                })}
              </g>
            </Calque>
          );
        })}
      </>
    );
  }
  return (
    <div className="calque saison-dehors" style={placer({ x: 388, y: 420, w: 464, h: 204 })}>
      <div className="anim-scintille remplir">
        <div className="rideau-lucioles" style={{ backgroundImage: LUCIOLES }} />
      </div>
      <div className="anim-scintille remplir" style={{ animationDelay: "-1.6s", animationDuration: "24.6s" }}>
        <div className="rideau-lucioles lent" style={{ backgroundImage: LUCIOLES }} />
      </div>
    </div>
  );
});

/** La lueur de la citrouille du balcon (dans le cadre de la vitre) */
export function LueurBalcon() {
  return (
    <>
      <Halo cx={791} cy={588} r={30} className="bougie" />
      <Calque boite={{ x: 777, y: 574, w: 28, h: 28 }} className="anim-citrouille">
        <path d={visage(791, 588, 14)} fill="#ffd36b" />
      </Calque>
    </>
  );
}
