import { memo, useState } from "react";
import type { DecorSaison } from "../saisons";
import { Calque, placer, Vue, type Boite } from "./Calque";
import { boiteDe, guirlande, type Point } from "./saisons";

/* ───────────────────────────────────────────────────────────────────────
   Les temps forts de l'année (calendrier : components/appart/saisons.ts) :
   fanions du 14 juillet, ce qui se pose sur la table basse (galette,
   roses, lapin en chocolat, muguet, cahiers) et par terre (ballons cœurs,
   cartable, panier de Pâques et sa chasse aux œufs).
   Montés seulement pendant leur période.
   ─────────────────────────────────────────────────────────────────────── */

/* ═══ Les fanions (14 juillet) ═══════════════════════════════════════ */

const Fanions = memo(function Fanions({ ancres, fleche, couleurs }: { ancres: Point[]; fleche: number; couleurs: string[] }) {
  const { fil, ampoules: points } = guirlande(ancres, fleche, 16);
  const boite = boiteDe([...ancres, ...points.map(([x, y]): Point => [x, y + 18])], 8);
  return (
    <Calque boite={boite}>
      <path d={fil} fill="none" stroke="#3a2a20" strokeWidth="1.2" />
      {points.map(([x, y], i) => (
        <path
          key={i}
          d={`M${x - 6.5} ${y} L${x + 6.5} ${y} L${x} ${y + 15} Z`}
          fill={couleurs[i % couleurs.length]}
          stroke="#000"
          strokeOpacity="0.12"
        />
      ))}
    </Calque>
  );
});

/** Le long de la tringle des rideaux */
export function FanionsSalon({ couleurs }: { couleurs: string[] }) {
  return (
    <Fanions
      ancres={[
        [352, 86],
        [536, 86],
        [720, 86],
        [902, 86],
      ]}
      fleche={14}
      couleurs={couleurs}
    />
  );
}

/** Sous l'étagère du studio */
export function FanionsStudio({ couleurs }: { couleurs: string[] }) {
  return (
    <Fanions
      ancres={[
        [1240, 418],
        [1354, 418],
        [1468, 418],
      ]}
      fleche={10}
      couleurs={couleurs}
    />
  );
}

/* ═══ Sur la table basse ═════════════════════════════════════════════
   Deux places libres : devant la lettre (x ≈ 1082), à gauche du mug
   (x ≈ 920). Le plateau de verre va de y 770 (fond) à 812 (bord).      */

/** La galette des rois, sur son plat, devant la lettre */
function Galette() {
  return (
    <g>
      <defs>
        <clipPath id="c-galette">
          <ellipse cx="1082" cy="793" rx="31" ry="7.5" />
        </clipPath>
      </defs>
      <ellipse cx="1082" cy="802" rx="42" ry="9" fill="#2c180c" opacity="0.18" />
      <ellipse cx="1082" cy="799" rx="41" ry="9" fill="#f4efe7" />
      <ellipse cx="1082" cy="798" rx="34" ry="6.5" fill="#e6ddd0" />
      <ellipse cx="1082" cy="797" rx="31" ry="7.5" fill="#b8742a" />
      <ellipse cx="1082" cy="793" rx="31" ry="7.5" fill="#e3a647" />
      <g clipPath="url(#c-galette)" stroke="#c27a26" strokeWidth="1.1" opacity="0.8">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${1046 + i * 9} 784 l14 18 M${1060 + i * 9} 784 l-14 18`} />
        ))}
      </g>
      <ellipse cx="1074" cy="790.5" rx="12" ry="2" fill="#fff" opacity="0.25" />
    </g>
  );
}

/** Un bouquet de roses rouges dans un vase en verre */
function Roses() {
  const fleurs: Point[] = [
    [906, 736],
    [920, 728],
    [934, 738],
    [912, 750],
    [928, 752],
  ];
  return (
    <g>
      <g stroke="#3f6b35" strokeWidth="1.6" fill="none">
        {fleurs.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y} Q${(x + 920) / 2} ${y + 20} 920 774`} />
        ))}
      </g>
      <g fill="#4f7a3c">
        <path d="M908 760 C900 756 898 750 902 746 C906 750 908 754 908 760 Z" />
        <path d="M932 762 C940 758 942 752 938 748 C934 752 932 756 932 762 Z" />
      </g>
      {fleurs.map(([x, y]) => (
        <g key={`r-${x}-${y}`}>
          <circle cx={x} cy={y} r="6.5" fill="#c8243a" />
          <path d={`M${x - 3.5} ${y} a3.5 3.5 0 1 1 3.5 3.5 a2 2 0 1 1 -1.6 -2.4`} fill="none" stroke="#8e1426" strokeWidth="1.1" />
        </g>
      ))}
      {/* le vase */}
      <path d="M908 768 H932 L934 796 Q920 802 906 796 Z" fill="#cfe3ea" opacity="0.55" stroke="#f4f8fb" strokeWidth="1.2" />
      <path d="M911 772 V794" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
    </g>
  );
}

/** Le lapin en chocolat de Pâques, avec son nœud */
function Lapin() {
  return (
    <g>
      <ellipse cx="920" cy="800" rx="20" ry="4" fill="#2c180c" opacity="0.22" />
      <path d="M911 744 C906 728 908 716 913 716 C918 716 918 732 916 746 Z" fill="#6b3a1f" />
      <path d="M922 744 C924 728 930 718 934 720 C938 723 932 736 926 747 Z" fill="#5b3019" />
      <ellipse cx="919" cy="756" rx="11" ry="10" fill="#6b3a1f" />
      <path d="M904 798 C902 780 906 764 920 762 C934 764 938 780 936 798 Z" fill="#5b3019" />
      <path d="M909 790 C908 778 912 768 919 767" fill="none" stroke="#8a5530" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="915" cy="754" r="1.4" fill="#2a160b" />
      <path d="M911 764 L919 768 L927 764 L925 772 L919 769 L913 772 Z" fill="#d6302c" />
      <circle cx="919" cy="768.5" r="2" fill="#f2c25a" />
    </g>
  );
}

/** Un brin de muguet du 1er mai, dans un petit pot */
function Muguet() {
  const clochettes: Point[] = [
    [924, 744],
    [928, 750],
    [931, 757],
    [933, 764],
  ];
  return (
    <g>
      <ellipse cx="920" cy="800" rx="16" ry="3.5" fill="#2c180c" opacity="0.2" />
      <path d="M914 790 C902 774 902 754 910 742 C914 760 918 774 918 790 Z" fill="#4f8c42" />
      <path d="M924 790 C934 770 936 752 932 740 C926 758 922 774 921 790 Z" fill="#5a9a48" />
      <path d="M920 790 C920 770 922 750 924 738 C928 742 930 748 933 760" fill="none" stroke="#4f7a3c" strokeWidth="1.3" />
      {clochettes.map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x - 3} ${y} C${x - 3} ${y - 4} ${x + 3} ${y - 4} ${x + 3} ${y} L${x + 3.6} ${y + 1.6} H${x - 3.6} Z`}
          fill="#fbfaf2"
        />
      ))}
      <path d="M908 786 H932 L929 800 H911 Z" fill="url(#g-terre-cuite)" />
      <rect x="907" y="784" width="26" height="4" rx="1" fill="#c9733d" />
      <path d="M911 793 H929" stroke="#d6302c" strokeWidth="2.4" />
    </g>
  );
}

/** La rentrée : cahiers et crayon */
function Cahiers() {
  return (
    <g>
      <ellipse cx="1082" cy="804" rx="44" ry="5" fill="#2c180c" opacity="0.16" />
      <path d="M1046 794 L1112 790 L1120 800 L1052 805 Z" fill="#2f4a3a" />
      <path d="M1050 789 L1114 785 L1121 795 L1055 800 Z" fill="#e3b25a" />
      <path d="M1054 784 L1112 780 L1118 790 L1059 795 Z" fill="#c2562f" />
      <path d="M1063 783 L1069 793" stroke="#f6efe4" strokeWidth="1.2" opacity="0.7" />
      <path d="M1074 776 L1110 772" stroke="#f2c25a" strokeWidth="3" strokeLinecap="round" />
      <path d="M1110 772 L1116 771.4" stroke="#e9b48c" strokeWidth="3" strokeLinecap="round" />
      <path d="M1116 771.4 L1118.5 771.2" stroke="#3a281d" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M1074 776 L1070 776.4" stroke="#e58f86" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

const DESSINS_TABLE = { galette: Galette, roses: Roses, lapin: Lapin, muguet: Muguet, cahiers: Cahiers };

export const SurLaTable = memo(function SurLaTable({ type }: { type: NonNullable<DecorSaison["table"]> }) {
  const Dessin = DESSINS_TABLE[type];
  return (
    <Calque boite={{ x: 896, y: 712, w: 232, h: 96 }}>
      <Dessin />
    </Calque>
  );
});

/* ═══ Par terre, à côté du guéridon ══════════════════════════════════ */

const B_SOL: Boite = { x: 780, y: 520, w: 140, h: 214 };

/** Deux ballons cœurs, attachés à un petit poids, qui se balancent */
function Ballons() {
  return (
    <>
      <Calque boite={B_SOL}>
        <rect x="834" y="716" width="14" height="10" rx="2" fill="#c8243a" />
        <path d="M838 716 C836 712 839 710 841 714 C843 710 846 712 844 716" fill="none" stroke="#f2c25a" strokeWidth="1.4" />
      </Calque>
      {/* le balancement pivote autour du poids (841, 716) */}
      <Calque boite={B_SOL} className="anim-ballons" style={{ transformOrigin: "43.6% 91.6%" }}>
        <path d="M841 716 C836 680 822 640 820 594" fill="none" stroke="#f4efe7" strokeWidth="0.9" opacity="0.9" />
        <path d="M841 716 C846 676 862 628 864 574" fill="none" stroke="#f4efe7" strokeWidth="0.9" opacity="0.9" />
        <path d="M820 594 C806 582 796 568 800 556 C804 544 818 544 820 556 C822 544 836 544 840 556 C844 568 834 582 820 594 Z" fill="#d9304e" />
        <path d="M806 556 C807 551 811 549 814 551" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M864 574 C850 562 840 548 844 536 C848 524 862 524 864 536 C866 524 880 524 884 536 C888 548 878 562 864 574 Z" fill="#ff8fb1" />
        <path d="M850 536 C851 531 855 529 858 531" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      </Calque>
    </>
  );
}

/** Le cartable de la rentrée, posé contre le mur */
function Cartable() {
  return (
    <Calque boite={B_SOL}>
      <ellipse cx="838" cy="728" rx="34" ry="5" fill="#2c180c" opacity="0.25" />
      <path d="M828 664 C828 652 850 652 850 664" fill="none" stroke="#3f4729" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M818 678 C818 670 822 664 830 662 H848 C856 664 860 670 860 678 V722 C860 726 856 728 852 728 H826 C822 728 818 726 818 722 Z"
        fill="#59623a"
      />
      <path
        d="M816 676 C816 668 822 664 830 664 H848 C856 664 862 668 862 676 V696 C862 700 858 702 854 702 H824 C820 702 816 700 816 696 Z"
        fill="#6b7445"
      />
      <rect x="834" y="694" width="10" height="9" rx="1.5" fill="#e0a43c" />
      <rect x="824" y="708" width="30" height="13" rx="3" fill="#4f5733" />
      <path d="M824 712 H854" stroke="#c2562f" strokeWidth="1.6" />
    </Calque>
  );
}

/* ─── Pâques : la chasse aux œufs ─── */

/** Cinq œufs cachés dans le salon : pot du monstera, pied du fauteuil,
    meuble à vinyles, haut de l'affiche Krylos, étagère de la table basse */
const OEUFS: { x: number; y: number; c: string; motif: string; a: number }[] = [
  { x: 352, y: 630, c: "#f2a6b8", motif: "#fff4f6", a: -12 },
  { x: 690, y: 722, c: "#8fc7e8", motif: "#f6efe4", a: 10 },
  { x: 1066, y: 670, c: "#f2c25a", motif: "#c2562f", a: -6 },
  { x: 1215, y: 84, c: "#9ccf8a", motif: "#ffffff", a: 14 },
  { x: 1262, y: 854, c: "#c9a8ff", motif: "#f2c25a", a: -10 },
];

function Oeuf({ x, y, c, motif, a, s = 1 }: { x: number; y: number; c: string; motif: string; a: number; s?: number }) {
  return (
    <g transform={`rotate(${a} ${x} ${y}) translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="6.2" ry="8" fill={c} />
      <path d="M-6 -1 Q-3 -3.5 0 -1 T6 -1" fill="none" stroke={motif} strokeWidth="1.5" />
      <path d="M-5.6 3 Q-2.8 0.8 0 3 T5.6 3" fill="none" stroke={motif} strokeWidth="1.2" opacity="0.8" />
      <ellipse cx="-2.2" cy="-4" rx="1.4" ry="2" fill="#fff" opacity="0.45" />
    </g>
  );
}

function ChasseAuxOeufs() {
  const [trouves, setTrouves] = useState<number[]>([]);
  const fini = trouves.length === OEUFS.length;
  return (
    <>
      {/* les œufs cachés : un vrai bouton chacun */}
      {OEUFS.map((o, i) => {
        if (trouves.includes(i)) return null;
        const b: Boite = { x: o.x - 13, y: o.y - 13, w: 26, h: 26 };
        return (
          <button
            key={i}
            type="button"
            className="objet"
            style={placer(b)}
            aria-label="Un œuf de Pâques caché : le mettre dans le panier"
            onClick={() => setTrouves((t) => (t.includes(i) ? t : [...t, i]))}
          >
            <Vue boite={b}>
              <circle cx={o.x} cy={o.y} r="12" fill="transparent" />
              <Oeuf {...o} />
            </Vue>
          </button>
        );
      })}
      {/* le panier se remplit à chaque œuf trouvé */}
      <Calque boite={B_SOL}>
        <ellipse cx="838" cy="726" rx="36" ry="5" fill="#2c180c" opacity="0.25" />
        <path d="M812 694 C812 668 864 668 864 694" fill="none" stroke="#a8743f" strokeWidth="4" />
        {trouves.map((i, k) => (
          <Oeuf key={i} {...OEUFS[i]} x={822 + k * 8} y={692 - (k % 2) * 3} a={-20 + k * 10} s={0.9} />
        ))}
        <path d="M808 694 H868 L862 722 Q838 730 814 722 Z" fill="#c89055" />
        <g stroke="#a8743f" strokeWidth="1.2" opacity="0.8">
          <path d="M810 702 H866 M812 710 H864 M814 717 H862" />
          <path d="M820 694 L822 724 M832 694 L833 727 M844 694 L843 727 M856 694 L854 724" />
        </g>
        <rect x="808" y="692" width="60" height="5" rx="2.5" fill="#d9a066" />
      </Calque>
      {/* le compteur, sur une étiquette accrochée à l'anse */}
      <Calque boite={{ x: 784, y: 640, w: 108, h: 36 }}>
        <path d="M838 668 V662" stroke="#a8743f" strokeWidth="1" />
        <rect x={fini ? 788 : 814} y="644" width={fini ? 100 : 48} height="18" rx="4" fill="#fbf7f0" stroke="#d6c4a8" />
        <text x="838" y="657" textAnchor="middle" className="font-main" fontSize="13" fill="#6a4b36">
          {fini ? "joyeuses Pâques !" : `${trouves.length} / ${OEUFS.length} œufs`}
        </text>
      </Calque>
      <p className="sr-only" aria-live="polite">
        {trouves.length > 0 &&
          (fini ? "Bravo, tous les œufs sont trouvés : joyeuses Pâques !" : `Œuf trouvé : ${trouves.length} sur ${OEUFS.length}.`)}
      </p>
    </>
  );
}

export const AuSol = memo(function AuSol({ type }: { type: NonNullable<DecorSaison["sol"]> }) {
  if (type === "ballons") return <Ballons />;
  if (type === "cartable") return <Cartable />;
  return <ChasseAuxOeufs />;
});
