import { memo } from "react";
import { projets } from "@/data/projets";
import { Calque, Halo, ImageSalon, Vue, placer, type Boite } from "./Calque";
import { alea } from "./Defs";
import { FENETRES_VILLE, TOUR_EIFFEL, VITRE } from "./decor";
import { CotesLanterne, domeChampignon, LANTERNE } from "./formes";
import { FLAMMES } from "./objets";
import salon from "./salon.json";
import { MeteoFenetre } from "./meteo";
import { CielSaison, DehorsSaison, LueurBalcon } from "./saisons";
import type { DecorSaison } from "../saisons";
import { BOITES } from "./statiques";

/* ───────────────────────────────────────────────────────────────────────
   Tout ce qui bouge ou qui éclaire. Règle d'or : chaque animation porte
   sur un petit calque HTML et ne touche qu'à transform et opacity, pour
   que la carte graphique s'en charge seule, sans redessiner la scène.
   ─────────────────────────────────────────────────────────────────────── */

const hasard = alea(42);

/* ═══ Dehors : le ciel, les nuages, les oiseaux ══════════════════════ */

const B_OISEAUX: Boite = { x: 436, y: 222, w: 48, h: 36 };
const OISEAUX: [number, number, number][] = [
  [440, 240, 1],
  [458, 232, 0.8],
  [452, 250, 0.7],
];

export const Dehors = memo(function Dehors({ saison }: { saison: DecorSaison["dehors"] }) {
  return (
    <div className="fenetre-vue" aria-hidden>
      <div className="remplir prl-ciel">
        <ImageSalon nom="ciel-jour" boite={BOITES.ciel} />
        <ImageSalon nom="ciel-nuit" boite={BOITES.ciel} className="nuit-seule" />
        <div className="calque anim-nuages" style={placer(BOITES.nuages)}>
          {/* eslint-disable-next-line @next/next/no-img-element -- calque vectoriel */}
          <img src={salon["nuages-jour"]} alt="" className="remplir jour-seul" draggable={false} />
          {/* eslint-disable-next-line @next/next/no-img-element -- calque vectoriel */}
          <img src={salon["nuages-nuit"]} alt="" className="remplir nuit-seule" draggable={false} />
        </div>
        <div className="calque jour-seul" style={placer(B_OISEAUX)}>
          <div className="remplir anim-oiseaux">
            {OISEAUX.map(([x, y, s], i) => {
              const b = { x: x - 1, y: y - 4 * s, w: 22 * s, h: 6 * s };
              return (
                <span
                  key={i}
                  className="morceau anim-aile"
                  style={{
                    left: `${((b.x - B_OISEAUX.x) / B_OISEAUX.w) * 100}%`,
                    top: `${((b.y - B_OISEAUX.y) / B_OISEAUX.h) * 100}%`,
                    width: `${(b.w / B_OISEAUX.w) * 100}%`,
                    height: `${(b.h / B_OISEAUX.h) * 100}%`,
                    animationDelay: `${i * 0.12}s`,
                  }}
                >
                  <Vue boite={b}>
                    <path
                      transform={`translate(${x} ${y}) scale(${s})`}
                      d="M0 0 Q5 -5 10 0 Q15 -5 20 0"
                      fill="none"
                      stroke="#4d3446"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </Vue>
                </span>
              );
            })}
          </div>
        </div>
        {/* la saison : feuilles mortes en automne, pétales au printemps */}
        {saison && <DehorsSaison boite={BOITES.ciel} type={saison} />}
        {/* la météo de Villejuif : pluie, neige, orage, ciel voilé */}
        <MeteoFenetre boite={BOITES.ciel} gouttes />
      </div>
    </div>
  );
});

/* ═══ La vapeur du mug (sous le voile de la nuit) ════════════════════ */

const VAPEURS = ["M972 738 C966 728 980 720 974 708", "M984 740 C990 728 978 718 986 704", "M978 736 C974 726 984 716 978 702"];

export const Vapeur = memo(function Vapeur() {
  return (
    <>
      {VAPEURS.map((d, i) => (
        <Calque key={d} boite={{ x: 960, y: 698, w: 34, h: 46 }} className="anim-vapeur" style={{ animationDelay: `${-i * 1.4}s` }}>
          <path d={d} fill="none" stroke="#fff8ec" strokeWidth="3" strokeLinecap="round" />
        </Calque>
      ))}
    </>
  );
});

/* ═══ Les lumières, au-dessus du voile de la nuit ════════════════════ */

const BARRES_FENETRE = [
  (_x: number, y: number) => y > 88 && y < 106,
  (_x: number, y: number) => y > 228 && y < 244,
  (x: number) => Math.abs(x - 620) < 7 || Math.abs(x - 550) < 6 || Math.abs(x - 690) < 6,
];
const ETOILES: { x: number; y: number; r: number }[] = [];
while (ETOILES.length < 33) {
  const x = 450 + hasard() * 350;
  const y = 108 + hasard() * 330;
  if (Math.hypot(x - 508, y - 176) < 34) continue;
  if (x < 492 && y > 320) continue; // derrière la monstera
  if (BARRES_FENETRE.some((barre) => barre(x, y))) continue;
  ETOILES.push({ x, y, r: 0.6 + hasard() * 1.3 });
}

/* Seules les fenêtres d'en face qu'aucun meuble ne cache s'allument */
const LUMIERES_VILLE = FENETRES_VILLE.filter((f) =>
  [
    [456, 567],
    [694, 585],
    [779, 567],
    [779, 585],
  ].some(([x, y]) => f.x === x && f.y === y),
);
const LUMIERES_LOIN = Array.from({ length: 12 }, () => [575 + hasard() * 225, 497 + hasard() * 20]);
const ETINCELLES = Array.from({ length: 16 }, () => {
  const t = hasard();
  return { x: 520 + (hasard() - 0.5) * (2 + t * t * 20), y: 396 + t * 116 };
});

const B_EIFFEL: Boite = { x: 494, y: 376, w: 52, h: 144 };

const POUSSIERES = Array.from({ length: 14 }, () => {
  const t = hasard();
  const demi = 170 + t * 260;
  const r = 0.9 + hasard() * 1.8;
  return { x: 625 + t * 90 + (hasard() - 0.5) * 1.6 * demi, y: 260 + t * 700, r, d: hasard() * 14 };
});

function Flamme({ x, y, delai, echelle = 1 }: { x: number; y: number; delai: number; echelle?: number }) {
  return (
    <Calque
      boite={{ x: x - 7 * echelle, y: y - 19 * echelle, w: 14 * echelle, h: 21 * echelle }}
      className="anim-flamme si-bougies"
      style={{ animationDelay: `${delai}s` }}
    >
      <g transform={`translate(${x} ${y}) scale(${echelle})`}>
        <path d="M0 0 C-4.5 -4 -4.5 -10 0 -17 C4.5 -10 4.5 -4 0 0 Z" fill="url(#g-flamme)" />
        <path d="M0 -1 C-1.6 -3 -1.6 -6 0 -9 C1.6 -6 1.6 -3 0 -1 Z" fill="#fffbe9" />
      </g>
    </Calque>
  );
}

export const Lumieres = memo(function Lumieres({ ciel, balcon }: { ciel: DecorSaison["ciel"]; balcon: DecorSaison["balcon"] }) {
  return (
    <>
      {/* Fin de journée : rayon de soleil et poussière dorée */}
      <Calque boite={{ x: 330, y: 250, w: 760, h: 794 }} className="jour-seul rayon">
        <path d="M444 250 L800 250 L1090 1044 L330 1044 Z" fill="#fff1d6" opacity="0.07" />
        <path d="M440 698 L808 698 L1070 1044 L370 1044 Z" fill="url(#g-rayon)" opacity="0.55" />
      </Calque>
      <div className="jour-seul" aria-hidden>
        {POUSSIERES.map((p, i) => (
          <span
            key={i}
            className="poussiere"
            style={{ ...placer({ x: p.x - p.r, y: p.y - p.r, w: 2 * p.r, h: 2 * p.r }), animationDelay: `-${p.d}s` }}
          />
        ))}
      </div>

      {/* Nuit : lune, étoiles, tour Eiffel qui scintille, fenêtres d'en face.
          Le masque les cache derrière ce qui passe devant la vitre. */}
      <div className="fenetre-vue nuit-seule masque-vitre" style={{ ["--masque" as string]: `url(${salon["masque-vitre"]})` }} aria-hidden>
        <div className="remplir prl-ciel">
          <Calque boite={{ x: 428, y: 96, w: 160, h: 160 }} className="ciel-etoiles">
            <circle cx="508" cy="176" r="80" fill="url(#g-lune)" />
            <circle cx="508" cy="176" r="20" fill="#fbf3dc" mask="url(#m-lune)" />
          </Calque>
          {[0, 1, 2].map((g) => (
            <Calque key={g} boite={VITRE} className="anim-scintille ciel-etoiles" style={{ animationDelay: `${-g * 1.07}s` }}>
              {ETOILES.filter((_, i) => i % 3 === g).map((e, i) => (
                <circle key={i} cx={e.x} cy={e.y} r={e.r} fill="#fff8e6" />
              ))}
            </Calque>
          ))}
          <Calque boite={B_EIFFEL}>
            <path d={TOUR_EIFFEL} fill="#d9a04c" opacity="0.9" />
            <rect x="507" y="467" width="26" height="3" fill="#ffd27a" />
            <rect x="511" y="438" width="18" height="2.5" fill="#ffd27a" />
          </Calque>
          {[0, 1].map((g) => (
            <Calque key={g} boite={B_EIFFEL} className="anim-eiffel" style={{ animationDelay: `${-g * 0.45}s` }}>
              {ETINCELLES.filter((_, i) => i % 2 === g).map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r="1.3" fill="#fff" />
              ))}
            </Calque>
          ))}
          <Calque boite={VITRE}>
            {LUMIERES_LOIN.map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="3" height="4" fill="#ffd27a" opacity="0.8" />
            ))}
            {LUMIERES_VILLE.map((f) => (
              <rect key={`${f.x}-${f.y}`} x={f.x} y={f.y} width="8" height="11" rx="1" fill="#ffcf73" opacity="0.92" />
            ))}
          </Calque>
          {/* la saison, dans le ciel : chauves-souris, feux d'artifice, lucioles */}
          {ciel && <CielSaison type={ciel} />}
        </div>
        {balcon === "citrouille" && <LueurBalcon />}
      </div>

      {/* Le lampadaire lanterne */}
      <Halo cx={LANTERNE.cx} cy={LANTERNE.cy} r={330} className="ambre si-lanterne" />
      <Calque boite={{ x: 78, y: 388, w: 144, h: 144 }} className="allume si-lanterne">
        <circle cx={LANTERNE.cx} cy={LANTERNE.cy} r={LANTERNE.r} fill="url(#g-lanterne)" />
        <CotesLanterne couleur="#e5823a" />
      </Calque>

      {/* La lampe champignon du meuble télé */}
      <Halo cx={1140} cy={500} r={210} className="ambre si-champignon" />
      <Calque boite={{ x: 1100, y: 490, w: 80, h: 28 }} className="allume si-champignon">
        <path d={domeChampignon(1140, 516, 38)} fill="url(#g-dome)" />
      </Calque>

      {/* La télé : sa lueur sur le mur */}
      <Halo cx={1392} cy={472} r={270} className="tele" />

      {/* Les bougies */}
      <Halo cx={1300} cy={760} r={160} className="bougie si-bougies" />
      <Halo cx={1185} cy={534} r={70} className="bougie si-bougies" />
      {FLAMMES.map((f, i) => (
        <Flamme key={f.x} x={f.x} y={f.y} delai={-i * 0.6} />
      ))}
      <Flamme x={1185} y={537} delai={-0.3} echelle={0.8} />

      {/* La lampe du guéridon, au premier plan (suit la parallaxe) */}
      <div className="remplir prl-avant" aria-hidden>
        <Halo cx={784} cy={790} r={270} className="ambre si-chevet" />
        <Calque boite={{ x: 740, y: 768, w: 88, h: 30 }} className="allume si-chevet">
          <path d={domeChampignon(784, 796, 42)} fill="url(#g-dome)" />
        </Calque>
      </div>
    </>
  );
});

/* ═══ L'écran de la télé (change avec la chaîne) ═════════════════════ */

const ECRAN: Boite = { x: 1256, y: 404, w: 272, h: 138 };

export const Ecran = memo(function Ecran({ chaine, zap }: { chaine: number; zap: number }) {
  return (
    <>
      <Calque boite={ECRAN} className="anim-ecran">
        <clipPath id="c-ecran-vue">
          <rect x="1256" y="404" width="272" height="138" rx="4" />
        </clipPath>
        <g clipPath="url(#c-ecran-vue)">
          <rect x="1256" y="404" width="272" height="138" fill="#101317" />
          {projets.map((p, i) => (
            <image
              key={p.slug}
              href={p.image}
              x="1256"
              y="404"
              width="272"
              height="138"
              preserveAspectRatio="xMidYMin slice"
              opacity={i === chaine ? 1 : 0}
              className="fondu-vite"
            />
          ))}
          <rect x="1256" y="404" width="272" height="138" fill="url(#p-lignes-tv)" opacity="0.35" />
          <rect x="1256" y="404" width="272" height="138" fill="url(#g-ecran-vignette)" />
          <path d="M1256 404 H1340 L1300 542 H1256 Z" fill="#fff" opacity="0.05" />
        </g>
        <text
          x="1516"
          y="424"
          textAnchor="end"
          fontSize="12"
          fontWeight="700"
          fill="#d6ffbf"
          className="font-mono"
          style={{ paintOrder: "stroke", stroke: "#0b2a0b", strokeWidth: 2 }}
        >
          {`CH ${String(chaine + 1).padStart(2, "0")}`}
        </text>
      </Calque>
      {zap > 0 && (
        <Calque key={zap} boite={ECRAN} className="anim-zap">
          <rect x="1256" y="404" width="272" height="138" rx="4" fill="url(#p-bruit)" />
        </Calque>
      )}
    </>
  );
});

/* ═══ La fumée quand on souffle les bougies ══════════════════════════ */

export const Fumee = memo(function Fumee({ souffle, bougies }: { souffle: number; bougies: boolean }) {
  if (bougies || souffle === 0) return null;
  return (
    <Calque key={souffle} boite={{ x: 1160, y: 690, w: 180, h: 90 }} className="anim-fumee">
      <g fill="none" stroke="#e6dfd6" strokeWidth="2" strokeLinecap="round">
        {FLAMMES.map((f) => (
          <path key={f.x} d={`M${f.x} ${f.y} c-4 -8 4 -14 0 -22 c-4 -8 4 -12 0 -20`} />
        ))}
      </g>
    </Calque>
  );
});
