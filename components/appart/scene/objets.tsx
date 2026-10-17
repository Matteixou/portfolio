import { memo, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { lieux, type LieuId } from "../lieux";
import { placer, Vue, type Boite } from "./Calque";
import { Huisseries } from "./decor";
import { domeChampignon, CotesLanterne, LANTERNE } from "./formes";
import type { ActionsScene } from "./types";
import type { DecorSaison } from "../saisons";
import { PetalesKrylos } from "../LogoKrylos";

/* ───────────────────────────────────────────────────────────────────────
   Les objets qu'on peut toucher. Chacun est un vrai lien (#lieu) ou un
   vrai bouton HTML, posé sur la scène avec son petit dessin SVG.
   Seules les formes dessinées captent la souris (pas la boîte entière).
   ─────────────────────────────────────────────────────────────────────── */

type Survol = ActionsScene["survoler"];

function Porte({
  id,
  boite,
  soulever,
  ouvrir,
  survoler,
  children,
  apres,
}: {
  id: LieuId;
  boite: Boite;
  soulever?: boolean;
  ouvrir: (id: LieuId) => void;
  survoler: Survol;
  children: ReactNode;
  /** des calques HTML posés par-dessus le dessin (animés à part) */
  apres?: ReactNode;
}) {
  const lieu = lieux[id];
  return (
    <a
      href={`#${id}`}
      className={soulever ? "objet soulever" : "objet"}
      data-lieu={id}
      style={placer(boite)}
      aria-label={`${lieu.objet} : ${lieu.titre}`}
      aria-haspopup="dialog"
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        ouvrir(id);
      }}
      onPointerEnter={() => survoler(id)}
      onPointerLeave={() => survoler(null)}
      onFocus={() => survoler(id)}
      onBlur={() => survoler(null)}
    >
      <Vue boite={boite}>{children}</Vue>
      {apres}
    </a>
  );
}

function Bouton({
  boite,
  label,
  presse,
  onActiver,
  className = "",
  children,
}: {
  boite: Boite;
  label: string;
  presse?: boolean;
  onActiver: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`objet ${className}`}
      style={placer(boite)}
      aria-label={label}
      aria-pressed={presse}
      onClick={onActiver}
    >
      {children}
    </button>
  );
}

/** Un morceau d'objet, positionné à l'intérieur de la boîte de l'objet */
function Morceau({
  boite,
  parent,
  className = "",
  style,
  children,
}: {
  boite: Boite;
  parent: Boite;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <span
      className={`morceau ${className}`}
      style={{
        left: `${((boite.x - parent.x) / parent.w) * 100}%`,
        top: `${((boite.y - parent.y) / parent.h) * 100}%`,
        width: `${(boite.w / parent.w) * 100}%`,
        height: `${(boite.h / parent.h) * 100}%`,
        ...style,
      }}
      aria-hidden
    >
      <Vue boite={boite}>{children}</Vue>
    </span>
  );
}

/* ═══ La fenêtre (fait tomber la nuit) ════════════════════════════════ */

const B_FENETRE: Boite = { x: 338, y: 72, w: 576, h: 626 };

export const Fenetre = memo(function Fenetre({ nuit, basculer }: { nuit: boolean; basculer: () => void }) {
  return (
    <Bouton
      boite={B_FENETRE}
      className="sans-lueur"
      label={nuit ? "La fenêtre : revenir au coucher du soleil" : "La fenêtre : attendre la nuit"}
      presse={nuit}
      onActiver={basculer}
    >
      <Vue boite={B_FENETRE}>
        {/* la vitre, invisible, pour qu'on puisse cliquer sur le ciel */}
        <rect x="408" y="100" width="424" height="504" fill="transparent" />
        <Huisseries />
      </Vue>
    </Bouton>
  );
});

/* ═══ Le mur : portrait, mur de cadres, affiche Krylos ═══════════════ */

const B_AFFICHE: Boite = { x: 1194, y: 90, w: 186, h: 260 };
/** Le logo de Krylos sur l'affiche (repris par sa copie lumineuse, la nuit) */
export const B_LOGO_KRYLOS: Boite = { x: 1216, y: 152, w: 136, h: 136 };

/** Une boîte, en % de sa boîte parente */
function dans(enfant: Boite, parent: Boite): CSSProperties {
  return {
    left: `${((enfant.x - parent.x) / parent.w) * 100}%`,
    top: `${((enfant.y - parent.y) / parent.h) * 100}%`,
    width: `${(enfant.w / parent.w) * 100}%`,
    height: `${(enfant.h / parent.h) * 100}%`,
  };
}

function OmbreCadre({ x, y, w, h }: Boite) {
  return <rect x={x + 5} y={y + 7} width={w} height={h} rx="2" fill="#5a3a22" opacity="0.2" />;
}

function Cadre({ x, y, w, h, bordure, epaisseur, fond, children }: Boite & { bordure: string; epaisseur: number; fond: string; children: ReactNode }) {
  return (
    <>
      <OmbreCadre x={x} y={y} w={w} h={h} />
      <rect x={x} y={y} width={w} height={h} rx="2" fill={bordure} />
      <rect x={x + epaisseur} y={y + epaisseur} width={w - 2 * epaisseur} height={h - 2 * epaisseur} fill={fond} />
      {children}
    </>
  );
}

interface PropsPorte {
  ouvrir: (id: LieuId) => void;
  survoler: Survol;
}

export const Cadres = memo(function Cadres({ ouvrir, survoler }: PropsPorte) {
  return (
    <>
      <Porte id="atelier" boite={{ x: 960, y: 116, w: 230, h: 284 }} soulever ouvrir={ouvrir} survoler={survoler}>
        <Cadre x={1094} y={118} w={76} h={78} bordure="#1f1b18" epaisseur={4} fond="#e2723c">
          <text x="1132" y="165" textAnchor="middle" fontSize="22" fontWeight="700" fill="#f6efe4" className="font-mono">
            {"</>"}
          </text>
        </Cadre>
        <Cadre x={1098} y={210} w={74} h={88} bordure="#9a6a40" epaisseur={5} fond="#59623a">
          <g fill="none" stroke="#f3e6cf" strokeWidth="2">
            <ellipse cx="1135" cy="254" rx="22" ry="8" />
            <ellipse cx="1135" cy="254" rx="22" ry="8" transform="rotate(60 1135 254)" />
            <ellipse cx="1135" cy="254" rx="22" ry="8" transform="rotate(-60 1135 254)" />
          </g>
          <circle cx="1135" cy="254" r="3.5" fill="#f7c987" />
        </Cadre>
        <Cadre x={962} y={280} w={68} h={70} bordure="#f6f1e8" epaisseur={6} fond="#f2b48e">
          <rect x="962" y="280" width="68" height="70" rx="2" fill="none" stroke="#d8cbb6" strokeWidth="1" />
          <text x="996" y="324" textAnchor="middle" fontSize="24" fill="#3a281d" className="font-serif">
            {"{ }"}
          </text>
        </Cadre>
        <Cadre x={1044} y={314} w={66} h={76} bordure="#1f1b18" epaisseur={4} fond="#a99bc4">
          <path d="M1077 334 L1096 370 H1058 Z" fill="#2e2440" />
          <path d="M1050 380 H1104" stroke="#f6efe4" strokeWidth="2" opacity="0.7" />
        </Cadre>
        <Cadre x={1124} y={312} w={58} h={58} bordure="#9a6a40" epaisseur={4} fond="#efe3cf">
          <text x="1153" y="347" textAnchor="middle" fontSize="17" fontWeight="700" fill="#59623a" className="font-mono">
            {">_"}
          </text>
        </Cadre>
      </Porte>

      <Porte id="a-propos" boite={{ x: 958, y: 108, w: 130, h: 166 }} soulever ouvrir={ouvrir} survoler={survoler}>
        <OmbreCadre x={960} y={110} w={120} h={154} />
        <rect x="960" y="110" width="120" height="154" rx="2" fill="#1f1b18" />
        <rect x="968" y="118" width="104" height="138" fill="#f4ede2" />
        {/* le selfie de Matthieu, tiré en sépia comme les photos de la référence */}
        <image href="/images/moi-cadre.webp" x="980" y="130" width="80" height="114" preserveAspectRatio="xMidYMid slice" />
        <rect x="980" y="130" width="80" height="114" fill="none" stroke="#d9cdb8" strokeWidth="1" />
        <path d="M980 130 L1008 130 L980 172 Z" fill="#fff" opacity="0.1" />
      </Porte>

      <Porte
        id="krylos"
        boite={B_AFFICHE}
        soulever
        ouvrir={ouvrir}
        survoler={survoler}
        apres={
          <span className="morceau logo-krylos" style={dans(B_LOGO_KRYLOS, B_AFFICHE)} aria-hidden>
            <PetalesKrylos />
          </span>
        }
      >
        <OmbreCadre x={1196} y={92} w={176} h={248} />
        <rect x="1196" y="92" width="176" height="248" rx="2" fill="#8e5e36" />
        <rect x="1196" y="92" width="176" height="3" fill="#a9754a" />
        <rect x="1204" y="100" width="160" height="232" fill="#f3e8d6" />
        <text x="1284" y="134" textAnchor="middle" className="font-serif" fontSize="24" fontWeight="600" letterSpacing="6" fill="#2e2420">
          KRYLOS
        </text>
        {/* une zone cliquable sous le logo (les pétales sont des calques à part) */}
        <rect x={B_LOGO_KRYLOS.x} y={B_LOGO_KRYLOS.y} width={B_LOGO_KRYLOS.w} height={B_LOGO_KRYLOS.h} fill="transparent" />
        <rect x="1228" y="306" width="112" height="1.5" fill="#2e2420" opacity="0.5" />
        <text x="1284" y="322" textAnchor="middle" fontSize="8" letterSpacing="2.2" fill="#2e2420" className="font-sans">
          AGENCE WEB · VILLEJUIF
        </text>
      </Porte>
    </>
  );
});

/* ═══ Le lampadaire lanterne ═════════════════════════════════════════ */

export const Lanterne = memo(function Lanterne({ allume, basculer }: { allume: boolean; basculer: () => void }) {
  const boite = { x: 76, y: 376, w: 148, h: 418 };
  return (
    <Bouton boite={boite} label={allume ? "Éteindre le lampadaire" : "Allumer le lampadaire"} presse={allume} onActiver={basculer}>
      <Vue boite={boite}>
        <rect x="148" y="520" width="4" height="270" fill="#b8894a" />
        <rect x="148" y="380" width="4" height="20" fill="#b8894a" />
        <circle cx={LANTERNE.cx} cy={LANTERNE.cy} r={LANTERNE.r} fill="url(#g-lanterne-eteinte)" />
        <CotesLanterne couleur="#d4b88f" />
        <rect x="138" y="386" width="24" height="7" rx="2" fill="#2a2420" />
        <rect x="141" y="527" width="18" height="6" rx="2" fill="#2a2420" />
      </Vue>
    </Bouton>
  );
});

/* ═══ Sur le meuble : la télé et la lampe champignon ═════════════════ */

export const Tele = memo(function Tele({ ouvrir, survoler }: PropsPorte) {
  return (
    <Porte id="realisations" boite={{ x: 1244, y: 392, w: 296, h: 168 }} ouvrir={ouvrir} survoler={survoler}>
      <rect x="1246" y="394" width="292" height="158" rx="8" fill="#151517" />
      <rect x="1250" y="398" width="284" height="150" rx="6" fill="#1d1d21" />
      <rect x="1256" y="404" width="272" height="138" rx="4" fill="#0b0d10" />
      <path d="M1296 552 L1286 558 H1310 L1306 552 Z" fill="#202022" />
      <path d="M1478 552 L1474 558 H1498 L1488 552 Z" fill="#202022" />
      <circle cx="1392" cy="548" r="1.5" fill="#ff6a3d" />
    </Porte>
  );
});

export const Champignon = memo(function Champignon({ allume, basculer }: { allume: boolean; basculer: () => void }) {
  const boite = { x: 1098, y: 488, w: 84, h: 74 };
  return (
    <Bouton
      boite={boite}
      label={allume ? "Éteindre la lampe du meuble" : "Allumer la lampe du meuble"}
      presse={allume}
      onActiver={basculer}
    >
      <Vue boite={boite}>
        <ellipse cx="1140" cy="556" rx="20" ry="4" fill="#e6d4b8" />
        <rect x="1134" y="510" width="12" height="46" rx="5" fill="#f0e2cb" />
        <path d={domeChampignon(1140, 516, 38)} fill="#e7b57a" />
        <path d="M1102 516 H1178" stroke="#c4935a" strokeWidth="2" />
      </Vue>
    </Bouton>
  );
});

/* ═══ Sur la table basse : la lettre et les bougies ══════════════════ */

export const Lettre = memo(function Lettre({ ouvrir, survoler }: PropsPorte) {
  return (
    <Porte id="contact" boite={{ x: 1050, y: 694, w: 100, h: 80 }} soulever ouvrir={ouvrir} survoler={survoler}>
      <g transform="rotate(-7 1100 740)">
        <rect x="1062" y="706" width="78" height="58" rx="2" fill="#f8f0e3" />
        <rect x="1062" y="706" width="78" height="58" rx="2" fill="none" stroke="#d6c2a0" strokeWidth="1.5" />
        <path d="M1062 707 L1101 738 L1140 707" fill="none" stroke="#cdb48e" strokeWidth="1.6" />
        <rect x="1120" y="711" width="13" height="14" fill="#e07a48" stroke="#fff" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <g stroke="#8a6a50" strokeWidth="1.4" strokeLinecap="round" opacity="0.7">
          <path d="M1072 748 h28" />
          <path d="M1072 755 h20" />
        </g>
        <circle cx="1101" cy="738" r="8.5" fill="#b23a2a" />
        <circle cx="1101" cy="738" r="5" fill="none" stroke="#8c2a1e" strokeWidth="1.4" />
        <path d="M1098 738 l2 2.4 l4 -4.6" fill="none" stroke="#e8a090" strokeWidth="1.2" />
      </g>
    </Porte>
  );
});

export const FLAMMES = [
  { x: 1281, y: 748 },
  { x: 1302, y: 762 },
  { x: 1320, y: 772 },
];

export const Bougies = memo(function Bougies({ allumees, souffler }: { allumees: boolean; souffler: () => void }) {
  const boite = { x: 1252, y: 742, w: 96, h: 62 };
  return (
    <Bouton boite={boite} label={allumees ? "Souffler les bougies" : "Rallumer les bougies"} presse={allumees} onActiver={souffler}>
      <Vue boite={boite}>
        <ellipse cx="1300" cy="792" rx="44" ry="8" fill="#b8894a" />
        <ellipse cx="1300" cy="790" rx="40" ry="6" fill="#d4a862" />
        <rect x="1272" y="752" width="18" height="38" rx="2" fill="#f6eedf" />
        <ellipse cx="1281" cy="752" rx="9" ry="2.5" fill="#fffaf0" />
        <rect x="1294" y="766" width="16" height="25" rx="2" fill="#f1e6d2" />
        <ellipse cx="1302" cy="766" rx="8" ry="2.2" fill="#fffaf0" />
        <rect x="1313" y="776" width="15" height="16" rx="2" fill="#f6eedf" />
        <ellipse cx="1320.5" cy="776" rx="7.5" ry="2" fill="#fffaf0" />
        <g stroke="#3a281d" strokeWidth="1.3">
          {FLAMMES.map((f) => (
            <path key={f.x} d={`M${f.x} ${f.y + 4} v-4`} />
          ))}
        </g>
      </Vue>
    </Bouton>
  );
});

/* ═══ Le chat, endormi sur le canapé ═════════════════════════════════ */

const B_CHAT: Boite = { x: 216, y: 800, w: 200, h: 164 };

/** Ce que porte le chat selon la saison (sa tête : centre 254, 906 ; rayon 24) */
function TenueChat({ chapeau }: { chapeau: DecorSaison["chapeau"] }) {
  if (chapeau === "sorciere") {
    return (
      <g transform="rotate(-12 256 880)">
        <ellipse cx="256" cy="881" rx="31" ry="6.5" fill="#2b2233" />
        <path d="M241 880 C246 862 252 846 274 830 C266 848 268 864 272 880 Z" fill="#3a2d47" />
        <path d="M242.5 873 H271 L272 880 H241 Z" fill="#e0782a" />
        <circle cx="262" cy="876.5" r="2.2" fill="#f2c25a" />
      </g>
    );
  }
  if (chapeau === "pere-noel") {
    return (
      <g transform="rotate(-8 256 882)">
        <path d="M236 878 C238 856 258 846 280 852 C292 856 298 866 300 874 C292 868 284 866 276 868 C278 872 278 876 276 878 Z" fill="#c8302a" />
        <path d="M262 852 C272 850 282 854 288 860" fill="none" stroke="#e85a4a" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <rect x="231" y="874" width="50" height="10" rx="5" fill="#f6efe4" />
        <circle cx="300" cy="876" r="5.5" fill="#f6efe4" />
      </g>
    );
  }
  if (chapeau === "bonnet") {
    return (
      <g transform="rotate(-6 255 882)">
        <path d="M232 884 C232 860 278 860 278 884 Z" fill="#59623a" />
        <g stroke="#4a5230" strokeWidth="1.6" opacity="0.7">
          <path d="M244 864 V882 M255 861 V882 M266 864 V882" />
        </g>
        <rect x="230" y="878" width="50" height="9" rx="4.5" fill="#efe3cf" />
        <path d="M232 882.5 H278" stroke="#c2562f" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="255" cy="858" r="6" fill="#efe3cf" />
      </g>
    );
  }
  if (chapeau === "couronne") {
    // la couronne de la galette des rois
    return (
      <g transform="rotate(-8 256 880)">
        <path d="M236 886 V870 L243 878 L249.5 864 L256 877 L262.5 864 L269 878 L276 870 V886 Z" fill="#f2c25a" stroke="#d99a2e" strokeWidth="1" />
        <rect x="236" y="881" width="40" height="5" fill="#e0a43c" />
        <circle cx="249.5" cy="866" r="1.8" fill="#d6302c" />
        <circle cx="262.5" cy="866" r="1.8" fill="#2a4da8" />
      </g>
    );
  }
  if (chapeau === "lunettes-coeur") {
    const coeur = (x: number, y: number) =>
      `M${x} ${y + 6} C${x - 9} ${y} ${x - 9} ${y - 7} ${x - 4.5} ${y - 7} C${x - 2} ${y - 7} ${x} ${y - 5} ${x} ${y - 3.5} C${x} ${y - 5} ${x + 2} ${y - 7} ${x + 4.5} ${y - 7} C${x + 9} ${y - 7} ${x + 9} ${y} ${x} ${y + 6} Z`;
    return (
      <g>
        <path d="M253 903.5 H257 M236 902 L231 898 M274 901 L279 897" stroke="#8e1426" strokeWidth="1.8" strokeLinecap="round" />
        <path d={coeur(245, 906)} fill="#e0304e" opacity="0.92" />
        <path d={coeur(265, 905)} fill="#e0304e" opacity="0.92" />
        <path d="M240 901 L243 899.5 M260 900 L263 898.5" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
      </g>
    );
  }
  if (chapeau === "oreilles-lapin") {
    // le serre-tête à oreilles de lapin (Pâques)
    return (
      <g>
        <path d="M244 884 C236 864 236 842 243 838 C250 842 251 864 250 884 Z" fill="#f6efe4" />
        <path d="M245 880 C240 864 240 848 243.5 845 C247 848 247.5 864 247.5 880 Z" fill="#f2a6b8" />
        <path d="M262 883 C266 862 274 842 281 842 C285 848 276 866 268 885 Z" fill="#f6efe4" />
        <path d="M264.5 879 C268 864 274 850 278 849 C279.5 854 273 866 267 880 Z" fill="#f2a6b8" />
        <path d="M232 892 C236 880 274 876 280 888" fill="none" stroke="#f2a6b8" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    );
  }
  if (chapeau === "casque") {
    // la Fête de la musique : le casque sur les oreilles
    return (
      <g>
        <path d="M231 904 C228 872 282 868 279 902" fill="none" stroke="#3a281d" strokeWidth="4.5" strokeLinecap="round" />
        <rect x="224" y="896" width="11" height="20" rx="5" fill="#3a281d" />
        <rect x="275" y="894" width="11" height="20" rx="5" fill="#3a281d" />
        <rect x="226.5" y="900" width="5" height="12" rx="2.5" fill="#c2562f" />
        <rect x="278.5" y="898" width="5" height="12" rx="2.5" fill="#c2562f" />
      </g>
    );
  }
  if (chapeau === "beret") {
    // le 14 juillet : un béret, bien de travers
    return (
      <g transform="rotate(-10 256 880)">
        <ellipse cx="256" cy="881" rx="25" ry="6" fill="#1f2340" />
        <ellipse cx="255" cy="876" rx="20" ry="8" fill="#2a2f52" />
        <path d="M255 868 V863" stroke="#1f2340" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    );
  }
  if (chapeau === "lunettes-rondes") {
    // la rentrée : des lunettes d'étude
    return (
      <g fill="#fff" fillOpacity="0.18" stroke="#3a281d" strokeWidth="1.6">
        <circle cx="245" cy="906" r="7.5" />
        <circle cx="265" cy="905" r="7.5" />
        <path d="M252.5 905 Q255 903 257.5 905" fill="none" />
        <path d="M237.5 904 L232 900 M272.5 903 L278 899" fill="none" strokeLinecap="round" />
      </g>
    );
  }
  if (chapeau === "lunettes") {
    return (
      <g>
        <path d="M253 905 H257" stroke="#1f1b18" strokeWidth="2" />
        <path d="M236 903 L231 899 M274 902 L279 898" stroke="#1f1b18" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="236" y="899.5" width="17.5" height="12" rx="5" fill="#1f1b18" />
        <rect x="256.5" y="899" width="17.5" height="12" rx="5" fill="#1f1b18" />
        <path d="M239 903 L244 901 M259.5 902.5 L264.5 900.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      </g>
    );
  }
  return null;
}

export const Chat = memo(function Chat({
  caresses,
  caresser,
  chapeau,
}: {
  caresses: number;
  caresser: () => void;
  chapeau: DecorSaison["chapeau"];
}) {
  return (
    <Bouton boite={B_CHAT} label="Caresser le chat" onActiver={caresser}>
      {/* le corps respire (calque à part, animé par la carte graphique) */}
      <Morceau boite={B_CHAT} parent={B_CHAT} className="anim-respire" style={{ transformOrigin: "47% 87%" }}>
        <ellipse cx="308" cy="936" rx="78" ry="10" fill="#7a5a3c" opacity="0.25" />
        <path
          d="M236 930 C228 896 254 868 300 864 C348 860 382 882 384 912 C386 930 372 940 340 942 L262 942 C246 940 238 936 236 930 Z"
          fill="#d98a45"
        />
        <path d="M300 868 C330 864 366 878 376 902 C350 888 322 882 300 884 Z" fill="#e9a25e" opacity="0.6" />
        <g fill="none" stroke="#b5662b" strokeWidth="4" strokeLinecap="round" opacity="0.75">
          <path d="M302 868 C308 880 306 890 298 898" />
          <path d="M326 868 C332 880 330 894 322 902" />
          <path d="M350 876 C354 888 350 900 342 906" />
        </g>
      </Morceau>
      <Vue boite={B_CHAT}>
        <path d="M378 922 C392 944 362 954 322 951 C296 949 274 947 262 942" fill="none" stroke="#cf7d3c" strokeWidth="13" strokeLinecap="round" />
        <ellipse cx="270" cy="932" rx="16" ry="7" fill="#f1c08a" />
        <path d="M236 892 L232 868 L254 884 Z" fill="#d98a45" />
        <path d="M239 888 L237 875 L249 884 Z" fill="#f2b38a" />
        <path d="M260 882 L272 862 L276 888 Z" fill="#d98a45" />
        <path d="M264 882 L271 870 L273 885 Z" fill="#f2b38a" />
        <circle cx="254" cy="906" r="24" fill="#e09650" />
        <path d="M236 896 C244 888 264 886 274 894" fill="none" stroke="#b5662b" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
        <g fill="none" stroke="#5a3420" strokeWidth="2" strokeLinecap="round">
          <path d="M240 906 q5 4 10 0" />
          <path d="M258 905 q5 4 10 0" />
        </g>
        <path d="M252 913 l3 3 l3 -3 Z" fill="#e58f86" />
        <g stroke="#fff4e6" strokeWidth="0.8" opacity="0.7">
          <path d="M244 916 l-16 -2 M244 919 l-15 3" />
          <path d="M265 915 l16 -3 M265 918 l15 2" />
        </g>
        <TenueChat chapeau={chapeau} />
      </Vue>
      {/* le bout de la queue qui frétille */}
      <Morceau boite={B_CHAT} parent={B_CHAT} className="anim-queue" style={{ transformOrigin: "42% 91.5%" }}>
        <path d="M288 950 C276 950 266 948 258 944" fill="none" stroke="#a85a26" strokeWidth="12" strokeLinecap="round" />
      </Morceau>
      {/* il dort… */}
      <Morceau boite={{ x: 222, y: 846, w: 16, h: 22 }} parent={B_CHAT} className="anim-zzz">
        <text x="226" y="866" className="font-main" fontSize="22" fill="#6a4b36">
          z
        </text>
      </Morceau>
      <Morceau boite={{ x: 234, y: 842, w: 12, h: 18 }} parent={B_CHAT} className="anim-zzz" style={{ animationDelay: "-2.3s" }}>
        <text x="236" y="858" className="font-main" fontSize="16" fill="#6a4b36">
          z
        </text>
      </Morceau>
      {/* …mais il aime les caresses */}
      {caresses > 0 && (
        <span key={caresses} aria-hidden>
          <Morceau boite={{ x: 284, y: 838, w: 32, h: 32 }} parent={B_CHAT} className="anim-coeur">
            <path d="M300 850 c-6 -8 -18 -2 -12 8 l12 10 l12 -10 c6 -10 -6 -16 -12 -8 Z" fill="#d9534f" />
          </Morceau>
          <Morceau boite={{ x: 318, y: 834, w: 24, h: 24 }} parent={B_CHAT} className="anim-coeur" style={{ animationDelay: "0.25s" }}>
            <path d="M330 842 c-4 -6 -13 -2 -9 6 l9 7 l9 -7 c4 -8 -5 -12 -9 -6 Z" fill="#e98a7a" />
          </Morceau>
          <Morceau boite={{ x: 338, y: 848, w: 60, h: 26 }} parent={B_CHAT} className="anim-coeur" style={{ animationDelay: "0.1s" }}>
            <text x="340" y="868" className="font-main" fontSize="24" fill="#6a4b36">
              prrr…
            </text>
          </Morceau>
        </span>
      )}
    </Bouton>
  );
});

/* ═══ La lampe du guéridon (premier plan) ════════════════════════════ */

export const LampeChevet = memo(function LampeChevet({ allume, basculer }: { allume: boolean; basculer: () => void }) {
  const boite = { x: 738, y: 766, w: 92, h: 72 };
  return (
    <Bouton
      boite={boite}
      label={allume ? "Éteindre la lampe du guéridon" : "Allumer la lampe du guéridon"}
      presse={allume}
      onActiver={basculer}
    >
      <Vue boite={boite}>
        <ellipse cx="784" cy="830" rx="22" ry="4.5" fill="#f0e2c8" />
        <rect x="777" y="788" width="14" height="42" rx="6" fill="#f3e6d0" />
        <path d={domeChampignon(784, 796, 42)} fill="#e8b47c" />
        <path d="M742 796 H826" stroke="#c4935a" strokeWidth="2" />
      </Vue>
    </Bouton>
  );
});

/* ═══ La platine vinyle, sur son meuble ══════════════════════════════ */

const B_PLATINE: Boite = { x: 958, y: 528, w: 120, h: 62 };
/** le disque, dessiné de face puis écrasé en perspective (scaleY) */
const B_DISQUE: Boite = { x: 979, y: 538, w: 62, h: 62 };

export const Platine = memo(function Platine({ tourne, basculer }: { tourne: boolean; basculer: () => void }) {
  return (
    <Bouton boite={B_PLATINE} label={tourne ? "Arrêter la platine" : "Lancer la platine vinyle"} presse={tourne} onActiver={basculer}>
      <Vue boite={B_PLATINE}>
        {/* une zone invisible un peu plus large : la platine est une petite cible */}
        <rect x="960" y="548" width="116" height="42" fill="transparent" />
        {/* le socle en noyer et sa plaque */}
        <rect x="964" y="574" width="108" height="13" rx="2" fill="#7a4a2a" />
        <rect x="964" y="574" width="108" height="2" fill="#a26a3e" />
        <path d="M969 560 H1067 L1072 575 H964 Z" fill="#2a2622" />
        <ellipse cx="1010" cy="569.5" rx="33" ry="8.5" fill="#100e0d" />
        <circle cx="1064" cy="571" r="2.2" fill="#c2562f" />
        <circle cx="1056" cy="572" r="1.6" fill="#8c867e" />
        <circle cx="1058" cy="562" r="3.6" fill="#b8b0a4" />
      </Vue>
      {/* le vinyle : il tourne pour de vrai (rotation dans son plan, puis perspective) */}
      <span className="morceau disque-perspective" style={dans(B_DISQUE, B_PLATINE)} aria-hidden>
        <span className={`morceau ${tourne ? "anim-tourne" : ""}`} style={{ inset: 0 }}>
          <Vue boite={B_DISQUE}>
            <circle cx="1010" cy="569" r="30" fill="#171515" />
            <g fill="none" stroke="#2c2927" strokeWidth="0.8">
              <circle cx="1010" cy="569" r="26.5" />
              <circle cx="1010" cy="569" r="22.5" />
              <circle cx="1010" cy="569" r="18.5" />
              <circle cx="1010" cy="569" r="14.5" />
            </g>
            <path d="M992 552 A24 24 0 0 1 1022 547" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" />
            <circle cx="1010" cy="569" r="10" fill="#c2562f" />
            <rect x="1004" y="562" width="12" height="3" rx="1" fill="#f6efe4" />
            <circle cx="1010" cy="569" r="1.4" fill="#e6e0d8" />
          </Vue>
        </span>
      </span>
      {/* le bras de lecture : il se pose sur le disque */}
      <span className="morceau bras-platine" data-joue={tourne} style={{ inset: 0 }} aria-hidden>
        <Vue boite={B_PLATINE}>
          <path d="M1058 562 L1052 578 L1046 583" fill="none" stroke="#d8d2c8" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="1041" y="581" width="8" height="4" rx="1" fill="#26222a" transform="rotate(-20 1045 583)" />
        </Vue>
      </span>
      {/* et la musique s'envole */}
      {tourne && (
        <span aria-hidden>
          {[
            { x: 1000, d: 0, s: "♪" },
            { x: 1022, d: 1.1, s: "♫" },
            { x: 1010, d: 2.2, s: "♪" },
          ].map((n) => (
            <span key={n.d} className="morceau anim-note-boucle" style={{ ...dans({ x: n.x - 10, y: 528, w: 24, h: 28 }, B_PLATINE), animationDelay: `${n.d}s` }}>
              <Vue boite={{ x: n.x - 10, y: 528, w: 24, h: 28 }}>
                <text x={n.x} y="552" fontSize="20" fill="#c2562f" className="font-sans">
                  {n.s}
                </text>
              </Vue>
            </span>
          ))}
        </span>
      )}
    </Bouton>
  );
});
